const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const subCourseModel = require("../model/subCourse.model");
const mainCourseModel = require("../model/mainCourse.model");
const studentQueryModel = require("../model/studentQuery.model");

exports.createStudentQuery = async (req, res) => {
  const { fullName, subjectId, phoneNumber, courseId } = req.body; // Adjust to match your schema

  try {
    const courseData = await mainCourseModel.findById(courseId);
    const subjectData = await subCourseModel.findById(subjectId);
    console.log(courseData)
    console.log(subjectData)
    const newStudentQuery = await studentQueryModel.create({
      fullName,
      subjectName : subjectData?.heading,
      phoneNumber,
      courseName : courseData?.heading,
      subjectId,
      courseId,
    });

    return responsestatusdata(
      res,
      true,
      "Created Successfully",
      newStudentQuery
    );
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Something went wrong"
    );
  }
};

exports.deleteStudentQuery = async (req, res) => {
  const { id } = req.params; // Use `req.params.id` to get the id from URL parameters

  try {
    const deletedStudentQuery = await studentQueryModel.findByIdAndDelete(id);

    if (!deletedStudentQuery) {
      return responsestatusmessage(res, false, "Student Query not found");
    }

    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error deleting footer",
      error.message
    );
  }
};

exports.getStudentQuery = async (req, res) => {
  try {
    const studentQueries = await studentQueryModel.find({});
    return responsestatusdata(
      res,
      true,
      "Fetched Successfully",
      studentQueries
    );
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error fetching studentQueries",
      error.message
    );
  }
};
