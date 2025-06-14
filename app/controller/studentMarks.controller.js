const { default: mongoose } = require("mongoose");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const studentMarksModel = require("../model/studentMarks.model");
const subjectModel = require("../model/subject.model");
const studentModel = require("../model/studentsSchema");

exports.addMarks = async (req, res) => {
  const user = req.user;
  const { courseId, duration, studentId, marks, issueDate } = req.body;
  if (!courseId || !studentId || !marks || !issueDate || !duration) {
    return responsestatusmessage(res, false, "All Fields are required");
  }
  const realMarks = JSON.parse(marks);
  const student = await studentModel.findById(studentId);
  const studentMarks = await studentMarksModel.create({
    courseId,
    studentId,
    marks: realMarks,
    issueDate: new Date(issueDate),
    duration: duration,
    franchiseId: new mongoose.Types.ObjectId(user?._id),
  });

  if (!studentMarks) {
    return responsestatusmessage(res, false, "Something went wrong!");
  }

  student.result = "done";
  await student.save();

  return responsestatusdata(
    res,
    true,
    "Marks Added Successfylly",
    studentMarks
  );
};

exports.getAllResults = async (req, res) => {
  const results = await studentMarksModel
    .find()
    .populate("franchiseId", "franchiseName _id")
    .populate("studentId", "studentName image enrollmentId _id")
    .populate("courseId", "name duration code");

  if (!results) {
    return responsestatusmessage(res, false, "Something went wrong");
  }

  return responsestatusdata(res, true, "Results fetched successfully", results);
};

exports.getResultById = async (req, res) => {
  const { id } = req.params;
  const result = await studentMarksModel.findById(id);
  return responsestatusdata(res, true, "Result fetched", result);
};

exports.deleteResult = async (req, res) => {
  const { id } = req.params;

  try {
    // First, get the result
    const result = await studentMarksModel.findById(id); // Check if result exists

    if (!result) {
      return responsestatusmessage(res, false, "Result not found!");
    } // Get the associated student

    const student = await studentModel.findById(result.studentId); // Delete the result

    await studentMarksModel.deleteOne({ _id: id }); // Update the student if found

    if (student) {
      student.result = "apply";
      await student.save();
    }

    return responsestatusmessage(
      res,
      true,
      "Result Deleted Successfully",
      result
    );
  } catch (error) {
    console.error("Error deleting result:", error);
    return responsestatusmessage(res, false, "Something went wrong!");
  }
};

exports.updateMarks = async (req, res) => {
  const user = req.user;
  const { id, marks, issueDate } = req.body;

  if (!id || !marks || !issueDate) {
    return responsestatusmessage(res, false, "All fields are required");
  }

  try {
    const realMarks = JSON.parse(marks);

    const updated = await studentMarksModel.findOneAndUpdate(
      { _id: id, franchiseId: user?._id }, // Secure: user can only update their own record
      {
        marks: realMarks,
        issueDate: new Date(issueDate),
      },
      { new: true } // Return updated document
    );

    if (!updated) {
      return responsestatusmessage(
        res,
        false,
        "Marks record not found or unauthorized"
      );
    }

    return responsestatusdata(res, true, "Marks updated successfully", updated);
  } catch (error) {
    console.error("Update Error:", error);
    return responsestatusmessage(
      res,
      false,
      "Server error while updating marks"
    );
  }
};
