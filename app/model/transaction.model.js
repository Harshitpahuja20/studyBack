const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
    },
    addAmount: {
      type: Number,
    },
    lessAmount: {
      type: Number,
    },
    franchiseId: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
