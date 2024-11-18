import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { adminJwtSecret } from "../constant";

export const checkAdminAuth = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies?.adminSessionId;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const adminScecrete: string = adminJwtSecret || "qazplm";
  
  const decode = verifyToken(token, adminScecrete);

  if (!decode) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  req.admin = decode;

  next();
};
