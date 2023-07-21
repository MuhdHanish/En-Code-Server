import mongoose, { Model, Schema, Document } from "mongoose";
import { Course } from "../../../domain/models/Course";

export type MongoDBCourse = Model<Document<any, any, any> & Course>;

const courseSchema = new Schema<Course>({
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coursename: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  status: { type: Boolean, required: true, default: true },
  category: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  price: { type: Number, required: true },
  level: { type: String, required: true },
  imgUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  sylabus: [
    {
      session: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  assignments: [
    {
      question: { type: String, required: true },
      rightAns: { type: String, required: true },
      options: { type: [String], required: true },
    },
  ],
});

export const courseModel: MongoDBCourse = mongoose.connection.model<Document<any, any, any> & Course>('Course', courseSchema);