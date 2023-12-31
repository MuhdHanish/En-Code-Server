import mongoose from "mongoose";
import { Course } from "../../domain/models/Course";
import { User } from "../../domain/models/User";
import { MongoDBCourse } from "../database/models/courseModel";

export type courseRepository = {
  getPopularCourses: () => Promise<Course[] | null>;
  getTutorCourses: (tutorId: string) => Promise<Course[] | null>;
  getCourses: () => Promise<Course[] | null>;
  getCourseById: (courseId: string) => Promise<Course | null>;
  changeReview: (course: mongoose.Types.ObjectId, rating: number, count: number) => Promise<Course | null>;
  getCoursesCount: () => Promise<number | null>;
  updateCoursesLanguageName: (oldName: string,newName: string) => Promise<boolean | null>;
  listCourse: (courseId: string, tutorId: string) => Promise<Course | null>;
  unListCourse: (courseId: string, tutorId: string) => Promise<Course | null>;
  postCourse: (course: Course) => Promise<Course | null>;
  updateCourse: (course: Course, _id: string) => Promise<Course | null>;
  setSelectedCourse: (courseId: string,userId: string ) => Promise<Course | null>;
  getCourseStudents: (courseId: string) => Promise<User[] | null>;
  getCoursesByLanguageName: (languageName: string) => Promise<Course[] | null>;
  getCourseDetailsDashborad: () => Promise<{ _id: string; total: number }[] | null>;
  getCourseDetailsTutorDashborad: (toturId: string) => Promise<{ _id: string; total: number }[] | null>;
  getCoursesCountByLanguageName: (languageName: string) => Promise<number | null>;
  getStudentCourses: (studentId: string) => Promise<Course[] | null>;
  getTutorPopularCourses: (tutorId: string) => Promise<Course[] | null>;
  removeStudentCourse: (courseId: string,studentId: string) => Promise<Course | null>;
};

export const courseRepositoryEmpl = (courseModel: MongoDBCourse): courseRepository => {

  const getPopularCourses = async (): Promise<Course[] | null> => {
  try {
  const courses = await courseModel
    .aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "tutor",
          foreignField: "_id",
          as: "tutorInfo",
        },
      },
      {
        $match: {
          "tutorInfo.status": { $ne: false },
        },
      },
      { $sort: { rating: -1 } },
    ])
    .exec();
  
  return courses.length > 0 ? courses : null;
  } catch (error) {
  console.error("Error popular getting courses:", error);
  return null;
  }
  };

  const changeReview = async (course: mongoose.Types.ObjectId, rating: number, count: number): Promise<Course | null> => {
    console.log(rating,count)
    const changeCourse = await courseModel.findById(course);
    if (changeCourse) {
      const oldRating = changeCourse?.rating as number;
      const newRating = (oldRating + rating) / count;
      const updatedCourse = await courseModel.findByIdAndUpdate(course, {$set:{rating:newRating}});
      return updatedCourse; 
    } else {
      return null;
    }
  };

  const getTutorCourses = async (tutorId:string): Promise<Course[] | null> => {
    try {
      const courses = await courseModel.find({tutor:tutorId}).sort({_id:-1}).exec();
      return courses.length > 0 ? courses : null;
    } catch (error) {
      console.error("Error getting courses:", error);
      return null;
    }
  };

  const getTutorPopularCourses = async (tutorId:string): Promise<Course[] | null> => {
    try {
      const courses = await courseModel.find({tutor:tutorId}).sort({rating:-1}).limit(4).exec();
      return courses.length > 0 ? courses : null;
    } catch (error) {
      console.error("Error getting courses:", error);
      return null;
    }
  };

  const getStudentCourses = async (studentId: string): Promise<Course[] | null> => {
      try {
       const courses = await courseModel.aggregate([
         {
           $match: {
             students: {
               $elemMatch: {
                 $eq: studentId,
               },
             },
           },
         },
         {
           $project: {
             purchaseHistory: 0
           },
         },
       ]);
        return courses.length > 0 ? courses : null;
      } catch (error) {
        console.error("Error getting by student id courses:", error);
        return null;
      }
  }

  const removeStudentCourse = async (courseId: string, studentId: string): Promise<Course | null> => {
    try {
      const course = await courseModel.findByIdAndUpdate(courseId, { $pull: { students: studentId } }, { new: true });
       if (!course) {
         console.error("Course not found");
         return null;
       }
       return course;
    } catch (error) {
      console.error("Error removing the student in course:", error);
      return null;
    }
  }

  const getCourseStudents = async (courseId: string): Promise<User[] | null> => {
    try {
    const enrolledStudents = await courseModel
      .aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
        {
          $lookup: {
            from: "users",
            let: {
              studentIds: {
                $map: {
                  input: "$students",
                  as: "id",
                  in: { $toObjectId: "$$id" },
                },
              },
            },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$studentIds"] } } },
              { $project: { password: 0 } },
            ],
            as: "enrolledStudents",
          },
        },
        {
          $unwind: "$enrolledStudents",
        },
        {
          $project: {
            _id: 0,
            enrolledStudents: 1,
          },
        },
      ])
      .exec();
      
    return enrolledStudents.length > 0
      ? enrolledStudents.map((course) => course.enrolledStudents)
      : null;
    } catch (error) {
    console.error("Error getting students from course:", error);
    return null;
    }
  };

  const getCoursesCount = async (): Promise<number| null> => {
    try {
            const courses = await courseModel
              .aggregate([
                {
                  $lookup: {
                    from: "users",
                    localField: "tutor",
                    foreignField: "_id",
                    as: "tutorInfo",
                  },
                },
                {
                  $match: {
                    "tutorInfo.status": { $ne: false },
                  },
                },
              ])
              .exec();

            return courses.length > 0 ? courses.length : null;
    } catch (error) {
      console.error("Error getting courses:", error);
      return null;
    }
  };

  const getCourses = async (): Promise<Course[] | null> => {
    try {
      const courses = await courseModel
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "tutor",
              foreignField: "_id",
              as: "tutorInfo",
            },
          },
          {
            $match: {
              "tutorInfo.status": { $ne: false },
            },
          }
        ])
        .exec();

      return courses.length > 0 ? courses : null;
    } catch (error) {
      console.error("Error getting courses:", error);
      return null;
    }
  };

  const getCourseById = async (courseId: string): Promise<Course | null> => {
    try {
      const course = await courseModel
        .findById(courseId)
        .populate({
          path: "tutor",
          select: "-password -isGoogle -followers -following -__v -status -role"
        })
        .exec();

      return course !== null ? course.toObject() : null;
    } catch (error) {
      console.error("Error getting course by ID:", error);
      return null;
    }
  };

  const updateCoursesLanguageName = async (oldName: string, newName: string): Promise<boolean | null> => {
    try {
      const courses = await courseModel.updateMany({ language: oldName }, { $set: { language: newName } }); 
      if (courses) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating courses by langugage:", error);
      return null;
    }
  }

  const getCoursesByLanguageName = async (languageName: string): Promise<Course[] | null> => {
  try {
    const courses = await courseModel.aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "tutor",
          foreignField: "_id",
          as: "tutorInfo",
        },
      },
      {
        $match: {
          "tutorInfo.status": { $ne: false },
          language: languageName,

        },
      },
    ]).exec();
    return courses.length > 0 ? courses : null;
  } catch (error) {
    console.error("Error on fetching course by language name:", error);
    return null;
  }
  };

  const getCoursesCountByLanguageName = async (languageName: string): Promise<number | null> => {
    try {
      const courses = await courseModel
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "tutor",
              foreignField: "_id",
              as: "tutorInfo",
            },
          },
          {
            $match: {
              "tutorInfo.status": { $ne: false },
              language: languageName,
            },
          },
        ])
        .exec();

      return courses.length > 0 ? courses.length : null;
    } catch (error) {
      console.error("Error on fetching course by language name:", error);
      return null;
    }
  };

  const listCourse = async (courseId: string, tutorId:string): Promise<Course | null> => {
    try {
      const course = await courseModel.findOneAndUpdate({_id:courseId, tutor: tutorId}, { $set: { status: true } }, { new: true });
      if (course) {
        return course;
      }
      return null;
    } catch (error) {
      console.error("Error on listing course:", error);
      return null;
    }
  }
  
  const setSelectedCourse = async (courseId: string,userId:string): Promise<Course | null> => {
    try {
      const prev = await courseModel.findById(courseId);
      const course = await courseModel.findByIdAndUpdate(
        courseId,
        {
          $push: {
            students: userId,
            purchaseHistory: {
              studentId: userId,
              date: new Date(),
              price: prev?.price,
              month: new Date().toLocaleString('default',{month:'long'}),
            },
          },
        },
        { new: true }
      );
      if (course) {
        return course;
      }
      return null;
    } catch (error) {
      console.error("Error adding course user:", error);
      return null;
    }
  }

  const getCourseDetailsDashborad = async (): Promise<{ _id: string, total:number}[]|null> => {
    try {
     const details = await courseModel.aggregate([
       {
         $unwind: "$purchaseHistory",
       },
       {
         $group: {
           _id: "$purchaseHistory.month",
           total: { $sum: { $multiply: ["$purchaseHistory.price", 0.05] } },
         },
       },
       {
         $sort: {_id:-1}
       }
     ]);
     return details;
    } catch (error) {
      console.log("error on getting data to dashboard", error);
      return null;
    }
  }

  const getCourseDetailsTutorDashborad = async (tutorId:string): Promise<{ _id: string, total:number}[]|null> => {
    try {
      const details = await courseModel.aggregate([
        {
          $match: {
            tutor: new mongoose.Types.ObjectId(tutorId),
          },
        },
        {
          $unwind: "$purchaseHistory",
        },
        {
          $group: {
            _id: "$purchaseHistory.month",
            total: { $sum: { $multiply: ["$purchaseHistory.price", 0.95] } },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
     return details;
    } catch (error) {
      console.log("error on getting data to dashboard", error);
      return null;
    }
  }

  const unListCourse = async (courseId: string, tutorId:string): Promise<Course | null> => {
    try {
      const course = await courseModel.findOneAndUpdate({_id:courseId, tutor: tutorId}, { $set: { status: false } }, { new: true });
      if (course) {
        return course;
      }
      return null;
    } catch (error) {
      console.error("Error on un lsit course:", error);
      return null;
    }
  }

  const postCourse = async (courseData: Course): Promise<Course | null> => {
    try {
      const createdCourse = await courseModel.create(courseData);
      return createdCourse !== null ? createdCourse.toObject() : null;
    } catch (error) {
      console.error("Error creating course:", error);
      return null;
    }
  };

  const updateCourse = async (CourseDetails: Course,_id:string): Promise<Course | null> => {
    try {
      const updatedCourse = await courseModel
        .findByIdAndUpdate(_id,  CourseDetails , { new: true })
        .exec();
      return updatedCourse !== null ? updatedCourse.toObject() : null;
    } catch (error) {
      console.error("Error editing course:", error);
      return null;
    }
  };

  return {
    getPopularCourses,
    getCourses,
    listCourse,
    getCoursesCount,
    getCourseStudents,
    unListCourse,
    changeReview,
    updateCoursesLanguageName,
    getTutorCourses,
    getCoursesByLanguageName,
    getCoursesCountByLanguageName,
    getCourseById,
    getCourseDetailsDashborad,
    getCourseDetailsTutorDashborad,
    getTutorPopularCourses,
    postCourse,
    updateCourse,
    getStudentCourses,
    setSelectedCourse,
    removeStudentCourse
  };
};