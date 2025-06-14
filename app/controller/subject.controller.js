const mongoose = require("mongoose");
const SubjectModel = require("../model/subject.model");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const studentModel = require("../model/studentsSchema");

// Add a new subject
exports.addSubject = async (req, res) => {
  try {
    const {
      subjectName,
      theoryMax,
      theoryMin,
      practicalMax,
      practicalMin,
      vocationalCourseId,
    } = req.body;

    if (
      !subjectName ||
      !theoryMax ||
      !theoryMin ||
      !practicalMax ||
      !practicalMin ||
      !vocationalCourseId
    ) {
      return responsestatusmessage(res, false, "All fields are required.");
    }

    const newSubject = new SubjectModel({
      subjectName,
      theoryMax,
      theoryMin,
      practicalMax,
      practicalMin,
      vocationalCourseId: new mongoose.Types.ObjectId(vocationalCourseId),
    });

    await newSubject.save();

    return responsestatusdata(
      res,
      true,
      "Subject added successfully",
      newSubject
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Get all subjects for a vocational course
exports.getSubjectsByCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const subjects = await SubjectModel.find({
      vocationalCourseId: new mongoose.Types.ObjectId(id),
    });
    return responsestatusdata(
      res,
      true,
      "Subjects fetched successfully",
      subjects
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching subjects.");
  }
};

exports.getStudentwithSubjects = async (req, res) => {
  const { id, studentId } = req.params;
  try {
    const subjects = await SubjectModel.find({
      vocationalCourseId: new mongoose.Types.ObjectId(id),
    });
    const student = await studentModel
      .findById(studentId)
      .populate("course", "_id name duration amount");
    return responsestatusdata(res, true, "Subjects fetched successfully", {
      subjects,
      student,
    });
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching subjects.");
  }
};

// Get single subject
exports.getSingleSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await SubjectModel.findById(id);
    if (!subject) {
      return responsestatusmessage(res, false, "Subject not found.");
    }
    return responsestatusdata(
      res,
      true,
      "Subject fetched successfully",
      subject
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching subject.");
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const {
      id,
      subjectName,
      theoryMax,
      theoryMin,
      practicalMax,
      practicalMin,
    } = req.body;

    if (!id) {
      return responsestatusmessage(res, false, "Subject ID is required.");
    }

    const subject = await SubjectModel.findById(id);
    if (!subject) {
      return responsestatusmessage(res, false, "Subject not found.");
    }

    Object.assign(subject, {
      subjectName,
      theoryMax,
      theoryMin,
      practicalMax,
      practicalMin,
    });

    await subject.save();

    return responsestatusdata(
      res,
      true,
      "Subject updated successfully",
      subject
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await SubjectModel.findByIdAndDelete(id);
    if (!deleted) {
      return responsestatusmessage(res, false, "Subject not found.");
    }
    return responsestatusmessage(res, true, "Subject deleted successfully.");
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error deleting subject.");
  }
};
