import { Course } from "../../../domain/models/Course";
import { courseRepository } from "../../../framework/repository/courseRepository";

export const getCourses = (courseRepository: courseRepository) => async ():Promise<Course[]|null> => {
  const courses = await courseRepository.getCourses();
  return courses ? courses : null;
}