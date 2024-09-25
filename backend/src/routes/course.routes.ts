import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.middlewares";
import {
  handleCoursePurchase,
  handleCoursesPreview,
} from "../controllers/course.controllers";

export const courseRoutes = Router();

courseRoutes.get("/preview", handleCoursesPreview);
courseRoutes.post("/purchased", userAuth, handleCoursePurchase);