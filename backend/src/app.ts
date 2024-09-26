import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
import { secureAdminRoute } from "./routes/secure.routes";
import { secureUserRoute } from "./routes/secureUser.routes";
import { adminRouter } from "./routes/adminRoute.routes";
import userRoutes from "./routes/user.routes";
import { courseRoutes } from "./routes/course.routes";

// admin routes
app.use("/api/v1/secure/admin", secureAdminRoute);
app.use("/api/v1/admin", adminRouter);
// user routes
app.use("/api/v1/secure/user", secureUserRoute);
app.use("/api/v1/auth/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

export default app;
