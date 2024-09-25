import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { userJwtSecret } from "../constant";

export const userAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies?.sessionId;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const userSecrete: string = userJwtSecret || "plmzaq";

  const decode = verifyToken(token, userSecrete);

  if (!decode) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  req.user = decode;

  next();
};
