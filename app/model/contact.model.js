const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    subject: {
      type: String,
    },
    comment: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ContactModel = mongoose.model("Contact", ContactSchema);

module.exports = ContactModel;
