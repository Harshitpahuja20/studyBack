const mongoose = require("mongoose");
const topUpRequestModel = require("../model/topUpRequest.model");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const transactionModel = require("../model/transaction.model");
const franchiseModel = require("../model/franchise.model");

// Create a new Top-Up Request
exports.addTopUpRequest = async (req, res) => {
  try {
    const { walletId, amount, description, method, date, transactionId } =
      req.body;
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
      transactionId,
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
    console.log(id)
    if (!id || !status) {
      return responsestatusmessage(res, false, "ID and status are required.");
    } // Step 1: Find the top-up request

    const topUp = await topUpRequestModel.findById(id);
    if (!topUp) {
      return responsestatusmessage(res, false, "Top-up request not found.");
    } // Step 2: If status is 'accept', update the franchise balance

    if (status === "accept") {
      const franchise = await franchiseModel.findById(topUp.franchiseId);
      if (!franchise) {
        return responsestatusmessage(res, false, "Franchise not found.");
      }

      const numericAmount = parseFloat(topUp.amount);
      franchise.balance = (
        parseFloat(franchise.balance || 0) + numericAmount
      ).toFixed(2);
      await franchise.save();
    } // Step 3: Update the top-up request status

    topUp.status = status;
    await topUp.save();

    return responsestatusdata(res, true, "Status updated", topUp);
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
      status: "pending",
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

// get All Franchise for topup
exports.getFranchisesForTopUp = async (req, res) => {
  try {
    const franchises = await franchiseModel
      .find({ role: { $ne: "admin" } })
      .select("_id balance franchiseName userName franchiseCode");
    return responsestatusdata(res, true, "Fetched Successfully", franchises);
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching franchises");
  }
};

// create TopUp by admin
// Create a new Top-Up Request
exports.adminAddTopUpRequest = async (req, res) => {
  try {
    const { walletId, amount, description, method, date, transactionId } =
      req.body;

    if (!walletId || !amount || !description || !method || !date) {
      return responsestatusmessage(res, false, "All fields are required.");
    } // Step 1: Find franchise by userName (walletId)

    const franchise = await franchiseModel.findOne({ userName: walletId });

    if (!franchise) {
      return responsestatusmessage(res, false, "Franchise not found.");
    } // Step 2: Increment franchise balance

    const numericAmount = parseFloat(amount); // Ensure it's a number
    franchise.balance = (
      parseFloat(franchise.balance || 0) + numericAmount
    ).toFixed(2);
    await franchise.save(); // Step 3: Create top-up request with status "success"

    const topUpRequest = new topUpRequestModel({
      walletId: franchise.userName,
      amount: numericAmount,
      description,
      method,
      date: new Date(date),
      status: "success",
      franchiseId: franchise._id,
      transactionId,
    });

    await topUpRequest.save();

    return responsestatusdata(
      res,
      true,
      "Top-up request submitted and processed successfully.",
      topUpRequest
    );
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Error submitting request.");
  }
};
