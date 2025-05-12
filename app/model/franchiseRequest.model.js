const mongoose = require("mongoose");

const franchiseRequestSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
    },
    directorName: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const franchiseRequestModel = mongoose.model(
  "franchiseRequest",
  franchiseRequestSchema
);

module.exports = franchiseRequestModel;
