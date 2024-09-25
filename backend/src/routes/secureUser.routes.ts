import { Router, Response } from "express";
import { userAuth } from "../middlewares/userAuth.middlewares";

export const secureUserRoute = Router();

secureUserRoute.get("/", userAuth, (req: any, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  return res.status(200).json({
    message: "Welcome to the secure route",
    user,
  });
});
