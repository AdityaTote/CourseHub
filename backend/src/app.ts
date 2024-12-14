import express, {Request, Response, NextFunction} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(
  cors({
    // origin: ["http://localhost:5173", "http://localhost:4173", "https://course-hub-azure.vercel.app", "https://76.76.21.93:443"],
    origin: "https://course-hub-azure.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'https://course-hub-azure.vercel.app');
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

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
app.use("/api/v1/presignedUrl",preSignedUrlRouter)
// user routes
app.use("/api/v1/secure/user", secureUserRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

export default app;
