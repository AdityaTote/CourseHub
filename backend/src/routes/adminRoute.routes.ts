import { Router } from "express";
import {
  handleAdminCourseDisplay,
  handleAdminLogin,
  handleAdminLogout,
  handleAdminRegister,
  handleCourseCreation,
  handleCourseDelete,
  handleCourseUpdate
} from "../controllers/admin.controllers";
import { checkAdminAuth } from "../middlewares/adminAuth.middlewares";
import { upload } from "../middlewares/multer.middlewares";

export const adminRouter = Router();

adminRouter
  .post("/register", handleAdminRegister)
  .post("/login", handleAdminLogin);

adminRouter.use(checkAdminAuth);

adminRouter
  .get("/logout", handleAdminLogout)
  .post("/course", handleCourseCreation)
  .patch("/course/:id", upload.single("coverImg"), handleCourseUpdate)
  .get("/courses", handleAdminCourseDisplay)
  .delete("/course/:id", handleCourseDelete)