const mongoose = require("mongoose");

const mainCourseSchema = new mongoose.Schema(
  {
    streamId: {
      type: String,
      trim: true,
    },
    streamName: {
      type: String,
      trim: true,
    },
    heading: {
      type: String,
    },
    url: {
      type: String,
    },
    shortName: {
      type: String,
    },
  },
  { timestamps: true }
);

const mainCourseModel = mongoose.model("mainCourse", mainCourseSchema);

module.exports = mainCourseModel;
