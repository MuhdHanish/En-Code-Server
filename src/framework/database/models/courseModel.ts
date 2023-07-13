import mongoose, { Model, Schema, Document } from "mongoose";
import { Course } from "../../../domain/models/Course";

export type MongoDBCourse = Model<Document<any, any, any> & Course>;

const courseSchema = new Schema<Course>({
  tutorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  coursename: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  shortdescription: { type: String, required: true, trim: true },
  status: { type: Boolean, required: true, default: true },
  category: { type: String, required: true },
  ispaid: { type: Boolean, required: true },
  price: { type: Number, required: true, trim: true },
  level: { type: String, required: true, trim: true },
  imgUrl: { type: String, required: true, trim: true },
  videoUrl: { type: String, required: true, trim: true },
  rating: { type: Number, required: true },
  sylabus: [
    {
      session: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
    },
  ],
  assignments: [
    {
      question: { type: String, required: true, trim: true },
      rightAns: { type: String, required: true, trim: true },
      options: { type: [String], required: true },
    },
  ],
});

export const courseModel: MongoDBCourse = mongoose.connection.model<Document<any, any, any> & Course>('Course', courseSchema);