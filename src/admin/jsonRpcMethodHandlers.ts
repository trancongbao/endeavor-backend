import "scope-extensions-js";
import { JSONRPCServer } from "json-rpc-2.0";
import { createTeacher, readTeacher, updateTeacher, deleteTeacher } from "./teacherMethods";
import { createStudent, readStudent, updateStudent, deleteStudent } from "./studentMethods";
import {createCourse, readCourse, updateCourse, deleteCourse, publishCourse, assignCourse} from "./courseMethods";

/*
 * JSON-RPC Method Handlers
 */
export default new JSONRPCServer().apply(function () {
  //Teachers
  this.addMethod("createTeacher", createTeacher);
  this.addMethod("readTeacher", readTeacher);
  this.addMethod("updateTeacher", updateTeacher);
  this.addMethod("deleteTeacher", deleteTeacher);

  //Students
  this.addMethod("createStudent", createStudent);
  this.addMethod("readStudent", readStudent);
  this.addMethod("updateStudent", updateStudent);
  this.addMethod("deleteStudent", deleteStudent);

  //Courses
  this.addMethod("createCourse", createCourse);
  this.addMethod("readCourse", readCourse);
  this.addMethod("updateCourse", updateCourse);
  this.addMethod("deleteCourse", deleteCourse);
  this.addMethod("submitCourse", assignCourse);
  this.addMethod("submitCourse", publishCourse);
});
