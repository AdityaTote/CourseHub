import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middlewares";
import {
  // handleCoursePurchase,
  handleCoursesPreview,
  handleCourseDetail
} from "../controllers/course.controllers";

export const courseRoutes = Router();

courseRoutes.get("/preview", handleCoursesPreview);
courseRoutes.get("/preview/:id", handleCourseDetail);
// courseRoutes.post("/purchased", userAuth, handleCoursePurchase);