const mongoose = require("mongoose");

const studentQuerySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    subject: {
      type: String,
    },
    course: {
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
