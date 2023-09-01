import { Course } from "../../../domain/models/Course";
import { courseRepository } from "../../../framework/repository/courseRepository";

export const getPopularCourses =
  (courseRepository: courseRepository) =>async (): Promise<Course[] | null> => {
    const courses = await courseRepository.getPopularCourses();
    return courses ? courses : null;
  };