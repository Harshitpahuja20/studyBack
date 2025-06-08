const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const { default: mongoose } = require("mongoose");
const VocationalCourseModel = require("../model/VocationCourse.model");

// Add a new vocational course
exports.addVocationalCourse = async (req, res) => {
  try {
    const user = req.user;
    const { name, duration, mode, code, amount } = req.body;

    if (!name || !duration || !mode || !code || !amount) {
      return responsestatusmessage(res, false, "All fields are required.");
    }

    const existing = await VocationalCourseModel.findOne({ code });
    if (existing) {
      return responsestatusmessage(res, false, "Course code already exists.");
    }

    const newCourse = new VocationalCourseModel({
      name,
      duration,
      mode,
      code,
      amount,
      franchiseId: new mongoose.Types.ObjectId(user?._id),
    });

    await newCourse.save();

    return responsestatusdata(
      res,
      true,
      "Course added successfully",
      newCourse
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Delete a vocational course by ID
exports.deleteVocationalCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCourse = await VocationalCourseModel.findByIdAndDelete(id);
    if (!deletedCourse) {
      return responsestatusmessage(res, false, "Course not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error deleting course.");
  }
};

// Get all vocational courses
exports.getVocationalCourses = async (req, res) => {
  try {
    const courses = await VocationalCourseModel.find().sort({ createdAt: -1 });
    return responsestatusdata(res, true, "Fetched Successfully", courses);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching courses.");
  }
};

// Get single course by ID
exports.getSingleVocationalCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await VocationalCourseModel.findById(id);
    if (!course) {
      return responsestatusmessage(res, false, "Course not found.");
    }
    return responsestatusdata(res, true, "Fetched Successfully", course);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching course.");
  }
};

// Get single franchise courses
exports.getFranchiseVocationalCourse = async (req, res) => {
  const user = req.user;
  try {
    const course = await VocationalCourseModel.aggregate([
      {
        $match: {
          franchiseId: new mongoose.Types.ObjectId(user?._id),
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          duration: 1,
          amount: 1,
          mode: 1,
          code: 1
        },
      },
    ]);
    if (!course) {
      return responsestatusmessage(res, false, "Courses not found.");
    }
    return responsestatusdata(res, true, "Fetched Successfully", course);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error fetching course.");
  }
};

// Update course by ID
exports.updateVocationalCourse = async (req, res) => {
  try {
    const { id, name, duration, mode, code, amount } = req.body;

    if (!id) {
      return responsestatusmessage(res, false, "Course ID is required.");
    }

    const existingCourse = await VocationalCourseModel.findById(id);
    if (!existingCourse) {
      return responsestatusmessage(res, false, "Course not found.");
    }

    Object.assign(existingCourse, {
      name,
      duration,
      mode,
      code,
      amount,
    });

    await existingCourse.save();

    return responsestatusdata(
      res,
      true,
      "Course updated successfully",
      existingCourse
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};
