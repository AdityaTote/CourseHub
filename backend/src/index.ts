import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./db/db";

dotenv.config();

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`MONGODB not connected: ${error}`);
  });
