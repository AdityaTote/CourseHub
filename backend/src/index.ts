import dotenv from "dotenv";
import app from "./app";
import { connectDb } from "./db/db";

dotenv.config();

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
     });
  }).catch((err) => {
    console.log(err);
  });
