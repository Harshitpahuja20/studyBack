const mongoose = require("mongoose");

const InstituteSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      trim: true,
    },
    instituteUrl: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    instituteType: {
      type: String,
      enum: [
        "Central University",
        "State Government University",
        "Deemed University",
        "Private University",
        "Government College",
        "Private College",
        "Self-Financed College",
        "Government ITI",
        "Private ITI",
      ],
    },
    instituteLogo: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    approvedBy: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    role: {
      type: String, // New field for the role (e.g. Admin, Teacher, etc.)
      trim: true,
      enum: ["Collage", "ITI", "University"], // Default to "Admin" for the role
    },
  },
  { timestamps: true }
);

// Create model
const InstituteModel = mongoose.model("Institute", InstituteSchema);

module.exports = InstituteModel;
