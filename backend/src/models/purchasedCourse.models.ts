import { Schema, model } from "mongoose";

const purchasedCourseSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const PurchasedCourse = model("PurchasedCourse", purchasedCourseSchema);
