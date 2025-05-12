const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const streamModel = mongoose.model("stream", streamSchema);

module.exports = streamModel;
