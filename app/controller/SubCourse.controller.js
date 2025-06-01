const { default: mongoose } = require("mongoose");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const subCourseModel = require("../model/subCourse.model");
const mainCourseModel = require("../model/mainCourse.model");

// Add a new sub-course
exports.addSubCourse = async (req, res) => {
  try {
    const {
      mainCourseId,
      heading,
      url,
      duration,
      eligibility,
      mode,
      type,
      description,
    } = req.body;

    if (
      !mainCourseId ||
      !heading ||
      !url ||
      !duration ||
      !eligibility ||
      !mode ||
      !type ||
      !description
    ) {
      return responsestatusmessage(res, false, "All fields are required.");
    }

    const mainCourse = await mainCourseModel.findById(mainCourseId);
    if (!mainCourse) {
      return responsestatusmessage(res, false, "Main course not found!");
    }

    const newSubCourse = new subCourseModel({
      mainCourseId: new mongoose.Types.ObjectId(mainCourseId),
      heading,
      url,
      duration,
      eligibility,
      mode,
      type,
      description,
    });

    await newSubCourse.save();

    return responsestatusdata(
      res,
      true,
      "Sub-course added successfully",
      newSubCourse
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Update a sub-course
exports.updateSubCourse = async (req, res) => {
  try {
    const { id, heading, url, duration, eligibility, mode, type, description } =
      req.body;

    if (!id) {
      return responsestatusmessage(res, false, "Sub-course ID is required.");
    }

    const existingSubCourse = await subCourseModel.findById(id);
    if (!existingSubCourse) {
      return responsestatusmessage(res, false, "Sub-course not found.");
    }

    Object.assign(existingSubCourse, {
      heading,
      url,
      duration,
      eligibility,
      mode,
      type,
      description,
    });

    await existingSubCourse.save();

    return responsestatusdata(
      res,
      true,
      "Sub-course updated successfully",
      existingSubCourse
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Delete a sub-course
exports.deleteSubCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSubCourse = await subCourseModel.findByIdAndDelete(id);
    if (!deletedSubCourse) {
      return responsestatusmessage(res, false, "Sub-course not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error deleting sub-course.");
  }
};

// Get all sub-courses
exports.getSubCourses = async (req, res) => {
  try {
    const subCourses = await subCourseModel
      .find()
      .populate("mainCourseId", "heading _id streamName"); // Optional populate
    return responsestatusdata(res, true, "Fetched Successfully", subCourses);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching sub-courses.");
  }
};

// Get all sub-courses by main course id
exports.getSubCoursesbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const subCourses = await subCourseModel.find({
      mainCourseId: new mongoose.Types.ObjectId(id),
    });
    return responsestatusdata(res, true, "Fetched Successfully", subCourses);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching sub-courses.");
  }
};
