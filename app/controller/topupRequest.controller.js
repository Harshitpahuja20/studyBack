const mongoose = require("mongoose");
const topUpRequestModel = require("../model/topUpRequest.model");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");

// Create a new Top-Up Request
exports.addTopUpRequest = async (req, res) => {
  try {
    const { transactionDate, Amount, description } = req.body;

    if (!transactionDate || !Amount || !description) {
      return responsestatusmessage(res, false, "All fields are required.");
    }

    const topUpRequest = new topUpRequestModel({
      transactionDate,
      Amount,
      description,
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

    const updatedRequest = await topUpRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return responsestatusmessage(res, false, "Request not found.");
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

exports.getAllTopUpRequests = async (req, res) => {
  try {
    const requests = await topUpRequestModel.find({});

    return responsestatusdata(res, true, "Requests fetched", requests);
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Failed to fetch requests.");
  }
};

exports.getFranchiseStats = async (req, res) => {
  const balance = req.user.balance || 0;
  const franchiseId = new mongoose.Types.ObjectId(req.user._id);

  const transactionsCount =
    (await topUpRequestModel.countDocuments({ franchiseId })) || 0;

    return responsestatusdata(res , true , "Fetched successfully" , {
        balance , transactionsCount
    }) 
};
