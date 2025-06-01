const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    franchiseId: {
      type: mongoose.Types.ObjectId,
      ref: "franchise",
    },
    studentName: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    motherName: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },
    mobile: {
      type: String,
    },
    category: {
      type: String,
    },
    email: {
      type: String,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref : "VocationalCourse"
    },
    session: {
      type: String,
    },
    registrationYear: {
      type: String,
    },
    address: {
      type: String,
    },
    image: {
      type: String, // store image filename or path; use Buffer if storing image as binary
    },
    enrollmentId: {
      type: Number, // store image filename or path; use Buffer if storing image as binary
    },
  },
  { timestamps: true }
);

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;
