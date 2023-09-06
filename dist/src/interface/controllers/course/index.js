"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentCoursesController = exports.getTutorPopularCoursesController = exports.setSelectedCourseController = exports.getCoursesController = exports.updateCourseController = exports.getTutorCoursesController = exports.postCourseController = exports.getPopularCoursesController = exports.getCourseByIdController = void 0;
const getCourseByIdController_1 = __importDefault(require("./getCourseByIdController"));
exports.getCourseByIdController = getCourseByIdController_1.default;
const getTutorCoursesController_1 = require("./getTutorCoursesController");
Object.defineProperty(exports, "getTutorCoursesController", { enumerable: true, get: function () { return getTutorCoursesController_1.getTutorCoursesController; } });
Object.defineProperty(exports, "getTutorPopularCoursesController", { enumerable: true, get: function () { return getTutorCoursesController_1.getTutorPopularCoursesController; } });
const getPopularCoursesController_1 = __importDefault(require("./getPopularCoursesController"));
exports.getPopularCoursesController = getPopularCoursesController_1.default;
const getCourses_1 = __importDefault(require("./getCourses"));
exports.getCoursesController = getCourses_1.default;
const postCourseController_1 = __importDefault(require("./postCourseController"));
exports.postCourseController = postCourseController_1.default;
const updateCourseController_1 = __importDefault(require("./updateCourseController"));
exports.updateCourseController = updateCourseController_1.default;
const setSelectedCourseController_1 = __importDefault(require("./setSelectedCourseController"));
exports.setSelectedCourseController = setSelectedCourseController_1.default;
const getStudentCoursesController_1 = __importDefault(require("./getStudentCoursesController"));
exports.getStudentCoursesController = getStudentCoursesController_1.default;
