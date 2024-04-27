import { JSONRPCServer } from "json-rpc-2.0";

const dispatcher = new JSONRPCServer();

dispatcher.addMethod("addCourse", ({ course }: { course: string }) => {
  console.log(`Course added: ${course}`);
  return "Course added successfully!";
});

dispatcher.addMethod("getCourse", ({ courseId }: { courseId: number }) => {
  const courseDetails = { id: courseId, name: "Sample Course" };
  return courseDetails;
});

export default dispatcher;