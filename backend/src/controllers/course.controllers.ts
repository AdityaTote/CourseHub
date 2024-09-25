import { Response } from "express";
import { Course } from "../models/course.models";
import { PurchasedCourse } from "../models/purchasedCourse.models";

export const handleCoursesPreview = async (req: any, res: Response) => {
  try {
   
    const courses = await Course.find();

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

export const handleCoursePurchase = async (req: any, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    const purchasedCourse = await PurchasedCourse.create({
      courseId,
      userId: user.id,
    });

    if (!purchasedCourse) {
      return res.status(500).json({
        error: "Error in purchasing course",
      });
    }

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
