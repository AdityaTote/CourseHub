import { Response } from "express";
import * as z from "zod";
import { Course, Purchase, prisma } from "../db/db";
import { verifyTransaction } from "../utils/checkTransaction.utils";

const purchasedCourseSchema = z.object({
  address: z.string(),
  signature: z.string(),
  amount: z.string(),
  adminId: z.string(),
})

export const handleCoursesPreview = async (req: any, res: Response) => {
  try {
    const courses = await Course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageURL: true,
        creater: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!courses) {
      return res.status(404).json({
        message: "No courses found",
      });
    }

    return res.status(200).json({
      message: "Courses preview",
      data: courses,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
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
        isPurchased: true
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
        isPurchased: false
      }
    });
  }

  return res.status(200).json({
    message: "Course not purchased",
    data: {
      isPurchased: true,
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

   const confirm = await verifyTransaction(signature, address);

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

export const handleCourseDetail = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Invalid id",
      });
    }

    const course = await Course.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        imageURL: true,
        creater: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course detail",
      data: course,
    });
  } catch (error: any) {
    return res.json({
      error: error.message,
    });
  }
};

export const handleCourseSearch = async(req: any, res: Response) => {

  try{
    const { search } = req.query;

  if (!search) {
    return res.status(400).json({
      error: "Missing search query",
    });
  }

  const courses = await Course.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          }
        }
      ]
    }
  });

  if(!courses){
    return res.status(404).json({
      message: "No courses found"
    })
  }

  if(courses.length === 0){
    return res.status(404).json({
      message: "No courses found"
    })
  }

  return res.status(200).json({
    message: "Courses found",
    data: courses,
  });
  } catch (error: any) {
    console.log(error.message)
  }

}