const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    vocationalCourseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VocationalCourse",
    },
    subjectName: {
      type: String,
      trim: true,
    },
    theoryMax: {
      type: Number,
      min: 0,
    },
    theoryMin: {
      type: Number,
      min: 0,
    },
    practicalMax: {
      type: Number,
      min: 0,
    },
    practicalMin: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

const subjectModel = mongoose.model("Subject", subjectSchema);

module.exports = subjectModel;
