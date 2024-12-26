import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://course-hub-teal.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import { secureAdminRoute } from "./routes/secure.routes";
import { secureUserRoute } from "./routes/secureUser.routes";
import { adminRouter } from "./routes/adminRoute.routes";
import userRoutes from "./routes/user.routes";
import { courseRoutes } from "./routes/course.routes";
import { preSignedUrlRouter } from "./routes/presignedUrl.routes";

// admin routes
app.use("/api/v1/secure/admin", secureAdminRoute);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/presignedUrl", preSignedUrlRouter);
// user routes
app.use("/api/v1/secure/user", secureUserRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

export default app;
