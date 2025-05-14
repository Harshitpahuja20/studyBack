const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const newsModel = mongoose.model("news", newsSchema);

module.exports = newsModel;
