const { default: mongoose } = require("mongoose");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const mainCourseModel = require("../model/mainCourse.model");
const streamModel = require("../model/streams.model");

// Add a new main course
exports.addMainCourse = async (req, res) => {
  try {
    const { stream, heading, url, shortName } = req.body;

    if (!stream || !heading || !url || !shortName) {
      return responsestatusmessage(res, false, "All fields are required.");
    }

    const isStream = await streamModel.findById(stream);

    if (!isStream)
      return responsestatusmessage(res, false, "Stream not found!");

    const newCourse = new mainCourseModel({
      streamId: new mongoose.Types.ObjectId(stream),
      streamName: isStream?.title,
      heading,
      url,
      shortName,
    });

    await newCourse.save();

    return responsestatusdata(
      res,
      true,
      "Main course added successfully",
      newCourse
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Delete a main course by ID
exports.deleteMainCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await mainCourseModel.findByIdAndDelete(id);
    if (!deletedCourse) {
      return responsestatusmessage(res, false, "Main course not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error deleting main course.");
  }
};

// Get all main courses
exports.getMainCourses = async (req, res) => {
  try {
    const courses = await mainCourseModel.find();
    return responsestatusdata(res, true, "Fetched Successfully", courses);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching main courses.");
  }
};

// Update a main course
exports.updateMainCourse = async (req, res) => {
  try {
    const { stream, heading, url, shortName , id } = req.body;

    if (!id) {
      return responsestatusmessage(res, false, "Main course ID is required.");
    }

    const existingCourse = await mainCourseModel.findById(id);
    if (!existingCourse) {
      return responsestatusmessage(res, false, "Main course not found.");
    }
    const isStream = await streamModel.findById(stream);

    if (!isStream)
      return responsestatusmessage(res, false, "Stream not found!");

    Object.assign(existingCourse, {
      streamId: new mongoose.Types.ObjectId(stream),
      streamName: isStream?.title,
      heading,
      url,
      shortName,
    });

    await existingCourse.save();

    return responsestatusdata(
      res,
      true,
      "Main course updated successfully",
      existingCourse
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};
