import { Router } from "express";
// import { userAuth } from "../middlewares/userAuth.middlewares";
import {
  // handleCoursePurchase,
  handleCoursesPreview,
  handleCourseDetail,
  handleCourseSearch
} from "../controllers/course.controllers";

export const courseRoutes = Router();

courseRoutes.get("/preview", handleCoursesPreview);
courseRoutes.get("/preview/:id", handleCourseDetail);
courseRoutes.get("/search", handleCourseSearch);
// courseRoutes.post("/purchased", userAuth, handleCoursePurchase);