import mongoose from "mongoose";
import { DBSTRING } from "../src/constant";

const DBString: string = DBSTRING!;

export const connectDB = async () => {
  try {
    await mongoose.connect(DBString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
