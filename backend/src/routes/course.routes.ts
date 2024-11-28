import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middlewares";
import {
  // handleCoursePurchase,
  handleCoursesPreview,
  handleCourseDetail,
  handleCourseSearch,
  handleCoursePurchase,
  handleCheckExistingCourse
} from "../controllers/course.controllers";

export const courseRoutes = Router();

courseRoutes.get("/preview", handleCoursesPreview);
courseRoutes.get("/preview/:id", handleCourseDetail);
courseRoutes.get("/search", handleCourseSearch);
courseRoutes.get("/:id", userAuth, handleCheckExistingCourse);
courseRoutes.post("/purchased/:id", userAuth, handleCoursePurchase);