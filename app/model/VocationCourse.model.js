const mongoose = require("mongoose");

const VocationalCourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      enum: ["45 DAYS" , "1 MONTH", "3 MONTH", "6 MONTH", "1 YEAR", "2 YEAR", "3 YEAR", "4 YEAR"],
    },
    mode: {
      type: Number,
      min: 1,
    },
    code: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      min: 0,
    },
    franchiseId: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const VocationalCourseModel = mongoose.model(
  "VocationalCourse",
  VocationalCourseSchema
);

module.exports = VocationalCourseModel;
