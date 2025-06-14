const mongoose = require("mongoose");

const topUpRequestSchema = new mongoose.Schema(
  {
    walletId: {
      type: Date,
    },
    amount: {
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
    date: {
      type: String,
    },
    method: {
      type: String,
    },
  },
  { timestamps: true }
);

const topUpRequestModel = mongoose.model("topUpRequest", topUpRequestSchema);

module.exports = topUpRequestModel;
