const mongoose = require("mongoose");

const studentMarksSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VocationalCourse",
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "franchise",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    marks: {
      type: Array,
    },
    issueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const studentMarksModel = mongoose.model("studentMarks", studentMarksSchema);

module.exports = studentMarksModel;
