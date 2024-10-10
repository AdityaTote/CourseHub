import bcrypt, { hash } from "bcrypt";
import { Request, Response } from "express";
import { User } from "../models/users.models";
import * as z from "zod";
import { hashPass, verifyPass } from "../utils/managePass.utils";
import { signToken } from "../utils/jwt.utils";
import { userJwtSecret } from "../constant";
import { PurchasedCourse } from "../models/purchasedCourse.models";
import { Course } from "../models/course.models";

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
    const userExists = await User.findOne({ email });

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

    const user: any = await User.create({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPass,
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
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ error: "User doesnot exists" });
    }

    //   pass check
    const passCheck = await verifyPass(password, userExists.password);

    if (!passCheck) {
      return res.status(404).json({
        error: "Invalid password",
      });
    }

    const userSecrete: string = userJwtSecret || "plmzaq";

    const token = signToken(userExists, userSecrete);

    return res.status(200).cookie("sessionId", token, option).json({
      message: "User logged in successfully",
      data: userExists,
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

    const userCourses = await PurchasedCourse.find({ userId: user.id });

    if (!userCourses) {
      return res.status(404).json({ error: "No courses found" });
    }

    let courses: any[] = [];

    for (let i = 0; i < userCourses.length; i++) {
      courses.push(userCourses[i].courseId);
    }

    const courseDetails = await Course.find({ _id: { $in: courses } });

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

const handleUserCoursePurchase = async (req: any, res: Response) => {

  try {
    const user = req.user;
  
    if(!user){
      return res.status(401).json({error: "Unauthorized"});
    }
  
    const { courseId } = req.body;
  
    if(!courseId){
      return res.status(400).json({error: "Missing required fields"});
    }
  
    const course = await Course.findById(courseId);
  
    if(!course){
      return res.status(404).json({error: "Course not found"});
    }
  
    const purchasedCourse = await PurchasedCourse.create({
      courseId,
      userId: user.id,
    });
  
    if(!purchasedCourse){
      return res.status(500).json({error: "Error in purchasing course"});
    }
  
    return res.status(200).json({
      message: "Course purchased successfully",
      data: purchasedCourse,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      error: error.message,
    });
    
  }

}

export {
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
  handleUserCourses,
  handleUserCoursePurchase
};
