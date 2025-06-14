const mongoose = require("mongoose");

const topUpRequestSchema = new mongoose.Schema(
  {
    transactionDate: {
      type: Date,
    },
    Amount: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    franchiseId: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const topUpRequestModel = mongoose.model("topUpRequest", topUpRequestSchema);

module.exports = topUpRequestModel;
