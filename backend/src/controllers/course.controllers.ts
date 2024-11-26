import { Response } from "express";
import { Course } from "../db/db";


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

// export const handleCoursePurchase = async (req: any, res: Response) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({
//         error: "Unauthorized",
//       });
//     }

//     const { courseId } = req.body;

//     if (!courseId) {
//       return res.status(400).json({
//         error: "Missing required fields",
//       });
//     }

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({
//         error: "Course not found",
//       });
//     }

//     const purchasedCourse = await PurchasedCourse.create({
//       courseId,
//       userId: user.id,
//     });

//     if (!purchasedCourse) {
//       return res.status(500).json({
//         error: "Error in purchasing course",
//       });
//     }

//     return res.status(201).json({
//       message: "Course purchased successfully",
//       data: purchasedCourse,
//     });
//   } catch (error: any) {
//     console.log(error);
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };

export const handleCourseDetail = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: "Invalid id",
      });
    }

    console.log(id)

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

    console.log(course)

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