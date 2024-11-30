import { Router } from "express";
import {
  handleCheckExistingCourse,
  handleCoursePurchase,
  handleUserCourses,
  handleUserLogin,
  handleUserLogout,
  handleUserRegister,
  handleUserTransaction,
} from "../controllers/user.controllers";
import { userAuth } from "../middlewares/userAuth.middlewares";

const userRoutes = Router();

userRoutes
  .post("/register", handleUserRegister)
  .post("/login", handleUserLogin);

userRoutes.use(userAuth);

userRoutes
    .get("/logout", handleUserLogout)
    .get("/courses", handleUserCourses)
    .get("/transactions", handleUserTransaction)
    .get("/course/:id", handleCheckExistingCourse)
    .post("/purchased/:id", handleCoursePurchase);
    

export default userRoutes;
