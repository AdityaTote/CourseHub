import { Request, Response } from "express";
import * as z from "zod";
import { hashPass, verifyPass } from "../utils/managePass.utils";
import { signToken } from "../utils/jwt.utils";
import { adminJwtSecret } from "../constant";
import { Admin, Balance, Course, prisma } from "../db/db";
import { sendTxn } from "../utils/sendTxn";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6),
  address: z.string(),
});

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.string(),
  imageURL: z.string(),
});

const payoutSchema = z.object({
  address: z.string(),
  amount: z.number(),
});

const option = {
  httpOnly: true
};

const handleAdminRegister = async (req: Request, res: Response) => {
  //   check user data validation
  const userData = userSchema.safeParse(req.body);

  if (!userData.success) {
    return res.status(400).json({ error: userData.error });
  }

  const { email, password, firstName, lastName, address } = userData.data;

  if (!email || !password || !firstName || !lastName || !address) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  //   check user already exists or not
  const userExists = await Admin.findFirst({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res.status(400).json({ error: "Admin already exists" });
  }

  //   pass hassing
  const hashedPass = await hashPass(password);

  if (!hashedPass) {
    return res.status(500).json({
      error: "Error in pass hassing",
    });
  }

  const user = await Admin.create({
    data: {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPass,
      address: address,
    },
  });

  if (!user) {
    return res.status(500).json({ error: "Error in creating user" });
  }

  return res.status(201).json({
    message: "Admin created successfully",
    user: user,
  });
};

const handleAdminLogin = async (req: Request, res: Response) => {
  try {
    const userData = loginSchema.safeParse(req.body);

    if (!userData.success) {
      return res.status(400).json({ error: userData.error });
    }

    const { email, password, address } = req.body;

    if (!email || !password || !address) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //   check user already exists or not
    const userExists = await Admin.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists) {
      return res.status(400).json({ error: "Admin does not exists" });
    }

    console.log(userExists.address, address);

    if(userExists.address !== address){
      return res.status(400).json({ error: "Invalid address" });
    }

    //   pass check
    if (!userExists.password) {
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

    const adminSecreteKey: string = adminJwtSecret || "qazplm";

    const token = signToken(userExists, adminSecreteKey);

    return res.status(204).cookie("adminSessionId", token).json({
      message: "Admin logged in successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
    });
  }
};

const handleAdminLogout = async (req: any, res: Response) => {
  const admin = req.admin;

  if (!admin) {
    return res.status(400).json({ error: "Admin not found" });
  }

  return res.clearCookie("adminSessionId").json({
    message: "Admin logged out successfully",
  });
};

const handleCourseCreation = async (req: any, res: Response) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({
        error: "User is unauthorized",
      });
    }

    const courseData = courseSchema.safeParse(req.body);

    if (!courseData.success) {
      return res.status(400).json({ error: courseData.error });
    }

    const { title, description, price, imageURL } = courseData.data;

    if (!title || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const courseExists = await Course.findFirst({
      where: {
        title: title,
        createrId: admin.id,
      },
    });

    if (courseExists) {
      return res.status(400).json({ error: "Course already exists" });
    }

    const course = await Course.create({
      data: {
        title: title,
        description: description,
        price: price,
        imageURL: imageURL,
        createrId: admin.id,
      },
    });

    if (!course) {
      return res.status(500).json({ error: "Error in creating course" });
    }

    return res.status(201).json({
      message: "Course created successfully",
      data: course,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
    });
  }
};

const handleAdminCourseDisplay = async (req: any, res: Response) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ error: "User is unauthorized" });
    }

    const courses = await Course.findMany({
      where: {
        createrId: admin.id,
      },
    });

    if (!courses) {
      return res.status(404).json({ error: "Courses not found" });
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
    });
  }
};

const handleCourseUpdate = async (req: any, res: Response) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const courseData = courseSchema.safeParse(req.body);

    if (!courseData.success) {
      return res.status(400).json({ error: courseData.error });
    }

    const { title, description, price, imageURL } = courseData.data;

    const courseInputData: {
      title?: string;
      description?: string;
      price?: string;
      imageURL?: string;
    } = {};

    if (title) {
      courseInputData.title = title;
    }

    if (price) {
      courseInputData.price = price;
    }

    if (description) {
      courseInputData.description = description;
    }

    if (imageURL) {
      courseInputData.imageURL = imageURL;
    }

    const updatedCourse = await Course.update({
      where: {
        id: courseId,
      },
      data: courseInputData,
    });

    if (!updatedCourse) {
      return res.status(500).json({ error: "Error in updating course" });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({ error: error.message });
  }
};

const handleCourseDelete = async (req: any, res: Response) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const courseId = req.params.id;

    if (!courseId) {
      return res.status(403).json({
        error: "Please provide CourseId",
      });
    }

    const deletedCourse = await Course.delete({
      where: {
        id: courseId,
      },
    });

    if (!deletedCourse) {
      return res.status(500).json({
        error: "Error in deleting course",
      });
    }

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.json({ error: error.message });
  }
};

const handleBalance = async (req: any, res: Response) => {
  const admin = req.admin;

  if (!admin) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const balance = await Balance.findFirst({
    where: {
      adminId: admin.id,
    },
  });

  if (!balance) {
    return res.status(404).json({
      error: "Balance not found",
    });
  }

  return res.status(200).json({
    message: "Balance fetched successfully",
    data: {
      pendingAmount: balance.pendingAmount,
      lockedAmount: balance.lockedAmount,
    },
  });
};

const handlePayout = async (req: any, res: Response) => {
  const admin = req.admin;

  if (!admin) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const payoutData = payoutSchema.safeParse(req.body);

  if (!payoutData.success) {
    return res.status(400).json({ error: payoutData.error });
  }

  const { address, amount } = payoutData.data;

  if (!address || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const balance = await Balance.findFirst({
      where: {
        adminId: admin.id,
      },
    });

    if (balance?.pendingAmount !== amount) {
      return res.status(400).json({
        error: "Invalid amount",
      });
    }

    const payoutTxn = await sendTxn(address, amount);

    if (payoutTxn?.verify === false || !payoutTxn?.sign) {
      return res.status(500).json({
        error: "Transaction failed",
      });
    }

    const { updatedBalance, adminTxn } = await prisma.$transaction(
      async (tx) => {
        const updatedBalance = await tx.balance.update({
          where: {
            id: balance?.id,
            adminId: admin.id,
          },
          data: {
            pendingAmount: {
              decrement: amount,
            },
            lockedAmount: {
              increment: amount,
            },
          },
        });

        const adminTxn = await tx.adminTransaction.create({
          data: {
            amount: String(amount),
            tansactionId: payoutTxn?.sign,
            adminId: admin.id,
          },
        });

        return {
          updatedBalance,
          adminTxn,
        };
      }
    );

    if (!updatedBalance || !adminTxn) {
      return res.status(500).json({
        error: "Error in transaction",
      });
    }

    return res.status(204).json({
      message: "Payout successful",
    });
  } catch (error) {
    console.log(error);
  }
};

const handleAdminTransactions = async (req: any, res: Response) => {
  const admin = req.admin;

  if(!admin){
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const transactions = await prisma.adminTransaction.findMany({
    where: {
      adminId: admin.id
    },
    select: {
      id: true,
      tansactionId: true,
      amount: true,
      createdAt: true,
    }
  });

  if(!transactions){
    return res.status(404).json({
      error: "Transactions not found"
    });
  }

  return res.status(200).json({
    message: "Transactions fetched successfully",
    data: transactions,
  });

}

export {
  handleAdminRegister,
  handleAdminLogin,
  handleAdminLogout,
  handleCourseCreation,
  handleAdminCourseDisplay,
  handleCourseUpdate,
  handleCourseDelete,
  handleBalance,
  handlePayout,
  handleAdminTransactions
};
