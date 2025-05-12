const FranchiseRequestModel = require("../model/franchiseRequest.model");

const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");

exports.createFranchiseRequest = async (req, res) => {
  const {
    instituteName,
    directorName,
    state,
    city,
    address,
    phoneNumber,
    email,
  } = req.body;

  try {
    const newRequest = await FranchiseRequestModel.create({
      instituteName,
      directorName,
      state,
      city,
      address,
      phoneNumber,
      email,
    });

    return responsestatusdata(
      res,
      true,
      "Franchise Request Created Successfully",
      newRequest
    );
  } catch (error) {
    return responsestatusmessage(res, false, error.message);
  }
};

exports.deleteFranchiseRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await FranchiseRequestModel.findByIdAndDelete(id);

    if (!deletedRequest) {
      return responsestatusmessage(res, false, "Franchise request not found");
    }

    return responsestatusmessage(
      res,
      true,
      "Franchise Request Deleted Successfully"
    );
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error deleting franchise request",
      error.message
    );
  }
};

exports.getFranchiseRequests = async (req, res) => {
  try {
    const requests = await FranchiseRequestModel.find({});
    return responsestatusdata(
      res,
      true,
      "Fetched Franchise Requests Successfully",
      requests
    );
  } catch (error) {
    return responsestatusmessage(
      res,
      false,
      "Error fetching franchise requests",
      error.message
    );
  }
};
