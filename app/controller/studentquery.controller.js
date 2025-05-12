const studentQueryModel = require("../model/contact.model");

const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");

exports.createStudentQuery = async (req, res) => {
  const { fullName, subject, phoneNumber, course } = req.body; // Adjust to match your schema

  try {
    const newStudentQuery = await studentQueryModel.create({
      fullName,
      subject,
      phoneNumber,
      course,
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
      "Error creating Query option",
      error.message
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
