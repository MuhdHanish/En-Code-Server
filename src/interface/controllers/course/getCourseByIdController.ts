import { Request, Response } from "express";
import { courseModel } from "../../../framework/database/models/courseModel";
import { courseRepositoryEmpl } from "../../../framework/repository/courseRepository";
import { getCourseById } from "../../../app/usecases/course/getCourseById";

const courseRepository = courseRepositoryEmpl(courseModel);

const getCourseByIdController = async (req: Request, res: Response) => {
 try {
  const { id } = req.params;
  const course = await getCourseById(courseRepository)(id);
  if (course) {
   return res.status(200).json({ message: "Course fetched successfully", course });
  } else {
   return res.status(400).json({ message: "Course fetch failed" });
  }
 } catch (error) {
  console.log(error);
  return res.status(500).json({ message: "Internal server error" });
 }
}

export default getCourseByIdController;