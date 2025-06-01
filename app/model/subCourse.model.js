const mongoose = require("mongoose");

const subCourseSchema = new mongoose.Schema(
  {
    mainCourseId: {
      type: mongoose.Types.ObjectId,
      ref: "mainCourse",
    },
    heading: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    eligibility: {
      type: String,
      trim: true,
    },
    mode: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const subCourseModel = mongoose.model("subCourse", subCourseSchema);

module.exports = subCourseModel;
