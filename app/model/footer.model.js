const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["stream", "university", "city"],
    },
  },
  { timestamps: true }
);

const footerModel = mongoose.model("Footer", footerSchema);

module.exports = footerModel;
