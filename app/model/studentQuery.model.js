const mongoose = require("mongoose");

const studentQuerySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: "subCourse",
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "mainCourse",
    },
    subjectName: {
      type: String,
    },
    courseName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const studentQueryModel = mongoose.model("studentQuery", studentQuerySchema);

module.exports = studentQueryModel;
