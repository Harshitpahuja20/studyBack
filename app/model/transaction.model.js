const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
    },
    enrollmentId: {
      type: String,
    },
    name: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    dob: {
      type: String,
    },
    fee: {
      type: String,
    },
    course: {
      type: String,
    },
    duration: {
      type: String,
    },
    studentId: {
      type: mongoose.Types.ObjectId,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
    },
    franchiseId: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
