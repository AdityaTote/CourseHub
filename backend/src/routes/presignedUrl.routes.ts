import { S3Client} from "@aws-sdk/client-s3";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Router, Request, Response } from "express";
import dotenv from "dotenv";
import { checkAdminAuth } from "../middlewares/adminAuth.middlewares";

dotenv.config();

const cred = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
}

if (!cred.accessKeyId || !cred.secretAccessKey || !cred.bucket || !cred.region) {
  throw new Error("AWS credentials are missing");
}
const s3Client = new S3Client({
  credentials: {
    accessKeyId: cred.accessKeyId!,
    secretAccessKey: cred.secretAccessKey!,
  },
  region: cred.region,
});

export const preSignedUrlRouter = Router();

preSignedUrlRouter.use(checkAdminAuth);

preSignedUrlRouter.get("/", async (req: any, res: Response) => {
  try {
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const randomNum = Math.floor(Math.random() * 100);
    
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: cred.bucket || "",
      Key: `course-cover/${admin.firstName.trim()}/${randomNum}-cover.png`,
      Expires: 3600
    })
    return res.json({ preSignedUrl: url, fields: fields });
  } catch (error: any) {
    throw new Error(error);
  }
});
