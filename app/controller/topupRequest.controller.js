const mongoose = require("mongoose");
const topUpRequestModel = require("../model/topUpRequest.model");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const transactionModel = require("../model/transaction.model");

// Create a new Top-Up Request
exports.addTopUpRequest = async (req, res) => {
  try {
    const { walletId, amount, description, method, date } = req.body;
    console.log(walletId, amount, description, method, date);

    if (!walletId || !amount || !description || !method || !date) {
      return responsestatusmessage(res, false, "All fields are required.");
    }

    const topUpRequest = new topUpRequestModel({
      walletId,
      amount,
      description,
      method,
      date,
      franchiseId: new mongoose.Types.ObjectId(req.user?._id),
    });

    await topUpRequest.save();

    return responsestatusdata(
      res,
      true,
      "Top-up request submitted",
      topUpRequest
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error submitting request.");
  }
};

// Update Top-Up Request Status
exports.updateTopUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return responsestatusmessage(res, false, "ID and status are required.");
    }

    const updatedRequest = await topUpRequestModel.findOneAndUpdate(
      { _id: id, franchiseId: req.user?._id }, // Ensuring only the franchise can update their own requests
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return responsestatusmessage(
        res,
        false,
        "Request not found or unauthorized."
      );
    }

    return responsestatusdata(res, true, "Status updated", updatedRequest);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Failed to update status.");
  }
};

// Get Top-Up Requests for Franchise
exports.getTopUpRequestsByFranchise = async (req, res) => {
  try {
    const franchiseId = req.user?._id;

    const requests = await topUpRequestModel.find({
      franchiseId: mongoose.Types.ObjectId(franchiseId),
    });

    return responsestatusdata(res, true, "Requests fetched", requests);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Failed to fetch requests.");
  }
};

// Get all Top-Up Requests (Admin Access)
exports.getAllTopUpRequests = async (req, res) => {
  try {
    const requests = await topUpRequestModel.find({
      status: { $ne: "pending" },
    });

    return responsestatusdata(res, true, "Requests fetched", requests);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Failed to fetch requests.");
  }
};

// Get Franchise Stats (Balance and Transactions Count)
exports.getFranchiseStats = async (req, res) => {
  const franchiseId = req.user?._id;

  // Getting balance from the user model (assuming it's stored there)
  const balance = req.user.balance || 0;

  const transactionsCount =
    (await transactionModel.countDocuments({ franchiseId })) || 0;

  return responsestatusdata(res, true, "Fetched successfully", {
    balance,
    transactionsCount,
  });
};

// Get Franchise Transactions
exports.getAllTransactions = async (req, res) => {
  const user = req.user;

  const transactions = await transactionModel.find({
    franchiseId: new mongoose.Types.ObjectId(user?._id),
  });

  return responsestatusdata(
    res,
    true,
    "Transactions fetched successfully",
    transactions || []
  );
};
