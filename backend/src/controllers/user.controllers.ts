import { Request, Response } from "express";
import * as z from "zod";
import { hashPass, verifyPass } from "../utils/managePass.utils";
import { signToken } from "../utils/jwt.utils";
import { userJwtSecret } from "../constant";
import { Course, prisma, Purchase, User } from "../db/db";
import { verifyTransaction } from "../utils/checkTransaction.utils";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6),
});

const purchasedCourseSchema = z.object({
  address: z.string(),
  signature: z.string(),
  amount: z.string(),
  adminId: z.string(),
})

const option = {
  httpOnly: true,
};

const handleUserRegister = async (req: Request, res: Response) => {
  try {
    //   check user data validation
    const userData = userSchema.safeParse(req.body);

    if (!userData.success) {
      return res.status(400).json({ error: userData.error });
    }

    const { email, password, firstName, lastName } = userData.data;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //   check user already exists or not
    const userExists = await User.findFirst({
      where: {
        email: email,
      }
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    //   pass hassing
    const hashedPass = await hashPass(password);

    if (!hashedPass) {
      return res.status(500).json({
        error: "Error in pass hassing",
      });
    }

    const user = await User.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPass
      }
    });

    if (!user) {
      return res.status(500).json({ error: "Error in creating user" });
    }

    return res.status(201).json({
      message: "User created successfully",
      user: user,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
      message: "Error in creating user",
    });
  }
};

const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const userData = loginSchema.safeParse(req.body);

    if (!userData.success) {
      return res.status(400).json({ error: userData.error });
    }

    const { email, password } = userData.data;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //   check user already exists or not
    const userExists = await User.findFirst({
      where: {
        email: email,
      }
    });

    if (!userExists) {
      return res.status(400).json({ error: "User doesnot exists" });
    }

    //   pass check
    if(!userExists.password){
      return res.status(404).json({
        error: "Invalid password",
      });
    }
    const passCheck = await verifyPass(password, userExists.password);

    if (!passCheck) {
      return res.status(404).json({
        error: "Invalid password",
      });
    }

    const userSecrete: string = userJwtSecret || "plmzaq";

    const token = signToken(userExists, userSecrete);

    return res.status(200).cookie("sessionId", token).json({
      message: "User logged in successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
    });
  }
};

const handleUserLogout = async (req: any, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  return res.clearCookie("sessionId").json({
    message: "User logged out successfully",
  });
};

const handleUserCourses = async (req: any, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const userCourses = await Purchase.findMany({
      where: {
        userId: user.id,
      },
    });

    type UserCourse = typeof userCourses[0];

    if (!userCourses) {
      return res.status(404).json({ error: "No courses found" });
    }

    let courses: UserCourse[] = [];

    for (let i = 0; i < userCourses.length; i++) {
      if (userCourses[i]?.courseId) {
        if (userCourses[i].courseId) {
          courses.push(userCourses[i]);
        }
      }
    }

    const courseDetails = await Course.findMany({
      where: {
        id: {
          in: courses.map((course) => course.courseId).filter((id) => id !== null),
        },
      },
    });

    if (!courseDetails) {
      return res.status(404).json({ error: "No courses found" });
    }

    return res.status(200).json({
      message: "Courses found",
      data: courseDetails,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
    });
  }
};

export const handleCheckExistingCourse = async(req: any, res: Response) => {
  
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const courseId = req.params.id;

  if(!courseId){
    return res.status(400).json({
      error: "courseId is missing"
    })
  }

  const course = await Course.findFirst({
    where: {
      id: courseId,
    }
  });

  if (!course) {
    return res.status(404).json({
      error: "Course not found",
      data: {
        isPurchased: null
      }
    });
  }

  const existingPurchase = await Purchase.findFirst({
    where: {
      courseId,
      userId: user.id,
    }
  })

  if (existingPurchase) {
    return res.status(400).json({
      error: "Course already purchased",
      data: {
        isPurchased: true
      }
    });
  }

  return res.status(200).json({
    message: "Course not purchased",
    data: {
      isPurchased: false,
      adminId: course.createrId
    }
  });

}

export const handleCoursePurchase = async (req: any, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const courseId = req.params.id;

    if(!courseId){
      return res.status(400).json({
        error: "courseId is missing"
      })
    }

    const purchasedCourseData = purchasedCourseSchema.safeParse(req.body);

    if (!purchasedCourseData.success) {
      return res.status(400).json({ error: purchasedCourseData.error });
    }

    const { address, amount, signature, adminId } = purchasedCourseData.data;

    if (!address || !amount || !signature || !adminId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

   const confirm = verifyTransaction(signature, address);

   console.log(confirm)

   if(!confirm){
      return res.status(400).json({
        error: "Transaction verification failed"
   })
    };

    const { transaction, balance, purchasedCourse } = await prisma.$transaction(async (tx) => {
      // Step 1: Create a new transaction record
      const transaction = await tx.transaction.create({
        data: {
          address,
          amount,
          signature,
          courseId,
          userId: user.id, // assuming `user.id` is defined
        },
      });
    
      // Step 2: Upsert the balance record for the admin
      const balance = await tx.balance.upsert({
        where: {
          adminId: adminId,
        },
        update: {
          pendingAmount: {
            increment: Number(amount), // Increment existing balance
          },
        },
        create: {
          adminId: adminId, // Create new balance entry
          pendingAmount: Number(amount), // Initialize with the given amount
          lockedAmount: 0, // Initialize with 0
        },
      });
    
      // Step 3: Create a purchase record linked to the transaction
      const purchasedCourse = await tx.purchase.create({
        data: {
          courseId: courseId,
          userId: user.id,
          transactionId: transaction.id, // Reference the transaction created above
        },
      });
    
      // Return the results of all operations
      return {
        transaction,
        balance,
        purchasedCourse,
      };
    });

    return res.status(201).json({
      message: "Course purchased successfully",
      data: purchasedCourse,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

const handleUserTransaction = async (req: any, res: Response) => {

  const user = req.user;

  if(!user){
    return res.status(400).json({error: "User not found"});
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      address: true,
      amount: true,
      course: {
        select: {
          title: true,
        },
      },
      signature: true,
      createdAt: true,
    }
  });

  if(!transactions){
    return res.status(404).json({error: "No transactions found"});
  }

  return res.status(200).json({
    message: "Transactions found",
    data: transactions,
  });

}

export {
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
  handleUserCourses,
  handleUserTransaction
};
