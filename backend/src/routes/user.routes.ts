import { Router } from "express";
import {
  handleUserCourses,
  handleUserLogin,
  handleUserLogout,
  handleUserRegister,
} from "../controllers/user.controllers";
import { userAuth } from "../middlewares/userAuth.middlewares";

const userRoutes = Router();

userRoutes
  .post("/register", handleUserRegister)
  .post("/login", handleUserLogin);

userRoutes.use(userAuth);

userRoutes
    .get("/logout", handleUserLogout)
    .get("/courses", handleUserCourses);
    

export default userRoutes;
