const jwt = require("jsonwebtoken");
const { responsestatusmessage } = require("./responses");
const franchiseModel = require("../model/franchise.model");

const jwt_secret = process.env.JWT_SECRET || "SUPER_SECRET";

exports.getUser = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) return responsestatusmessage(res, false, "Token not found");

    const decoded = jwt.verify(token, jwt_secret);
    console.log(decoded)
    const user = await franchiseModel
      .findById(decoded.id)
      .select("-password -__v");

    if (!user) {
      return responsestatusmessage(res, false, "Unauthorized User");
    }

    req.user = user;
    next();
  } catch (err) {
    return responsestatusmessage(res, false, "Invalid token");
  }
};

exports.authAdmin = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) return responsestatusmessage(res, false, "Token not found");

    const decoded = jwt.verify(token, jwt_secret);
    const user = await franchiseModel.findById(decoded.id).select("-otp -__v");

    if (!user || user.role !== "admin") {
      return responsestatusmessage(res, false, "Unauthorized Admin");
    }

    req.user = user;
    next();
  } catch (err) {
    return responsestatusmessage(res, false, "Invalid token");
  }
};

exports.authFranchise = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) return responsestatusmessage(res, false, "Token not found");

    const decoded = jwt.verify(token, jwt_secret);
    const user = await franchiseModel.findById(decoded.id).select("-otp -__v");

    if (!user || user.role !== "franchise") {
      return responsestatusmessage(res, false, "Unauthorized Admin");
    }

    req.user = user;
    next();
  } catch (err) {
    return responsestatusmessage(res, false, "Invalid token");
  }
};

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token) return responsestatusmessage(res, false, "Token not found");

    const decoded = jwt.verify(token, jwt_secret);
    const user = await franchiseModel.findById(decoded.id).select("-otp -__v");

    console.log(user);
    if (!user || (user.role !== "franchise" && user.role !== "admin")) {
      return responsestatusmessage(res, false, "Unauthorized Admin");
    }

    req.user = user;
    next();
  } catch (err) {
    return responsestatusmessage(res, false, "Invalid token");
  }
};
