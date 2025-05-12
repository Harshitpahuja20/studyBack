const upload = require("../middleware/multer.middleware");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const franchiseModel = require("../model/franchise.model");
const jwt = require("jsonwebtoken"); // For generating JWT tokens

// Add a new franchise
exports.addFranchise = async (req, res) => {
  upload.single("image")(req, res, async () => {
    try {
      const {
        franchiseName,
        fullName,
        phoneNumber,
        email,
        franchiseCode,
        password,
        address,
        role,
      } = req.body;

      // If role is admin, only fullName, email, and password are required
      if (role === "admin") {
        if (!fullName || !email || !password) {
          return responsestatusmessage(
            res,
            false,
            "Full name, email, and password are required for admin."
          );
        }

        // Check if the email is already taken
        const emailExists = await franchiseModel.findOne({ email });
        if (emailExists) {
          return responsestatusmessage(res, false, "Email is already in use.");
        }

        // Create a new franchise with the role as admin and only the necessary fields
        const newFranchise = new franchiseModel({
          fullName,
          email,
          password,
          role: "admin", // Set role as admin
        });

        await newFranchise.save();

        return responsestatusdata(
          res,
          true,
          "Admin franchise added successfully",
          newFranchise
        );
      }

      // If the role is 'franchise' or not provided, proceed with normal franchise creation
      if (
        !franchiseName ||
        !fullName ||
        !phoneNumber ||
        !email ||
        !franchiseCode ||
        !password ||
        !address ||
        !req.file
      ) {
        return responsestatusmessage(
          res,
          false,
          "All fields and image are required for franchise."
        );
      }

      // Check if the franchiseName already exists
      const franchiseNameExists = await franchiseModel.findOne({
        franchiseName,
      });
      if (franchiseNameExists) {
        return responsestatusmessage(
          res,
          false,
          "Franchise name is already in use."
        );
      }

      // Check if the phone number is already used
      const phoneExists = await franchiseModel.findOne({ phoneNumber });
      if (phoneExists) {
        return responsestatusmessage(
          res,
          false,
          "Phone number is already in use."
        );
      }

      // Check if the email is already taken
      const emailExists = await franchiseModel.findOne({ email });
      if (emailExists) {
        return responsestatusmessage(res, false, "Email is already in use.");
      }

      // Image path
      const imagePath = `${req.file.fieldname}/${req.file.generatedName}`;

      // Create a new franchise document
      const newFranchise = new franchiseModel({
        franchiseName,
        fullName,
        phoneNumber,
        email,
        franchiseCode,
        password,
        address,
        image: imagePath,
      });

      await newFranchise.save();

      return responsestatusdata(
        res,
        true,
        "Franchise added successfully",
        newFranchise
      );
    } catch (error) {
      console.error(error);
      return responsestatusmessage(res, false, "Something went wrong.");
    }
  });
};

// Login API for franchise
exports.loginFranchise = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if the franchise exists
    const franchise = await franchiseModel.findOne({ email, role });
    if (!franchise) {
      return responsestatusmessage(res, false, "Invalid credentials.");
    }

    // Check if the password matches
    const isMatch = await franchise.matchPassword(password);
    if (!isMatch) {
      return responsestatusmessage(res, false, "Invalid credentials.");
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: franchise._id, role: franchise.role },
      process.env.JWT_SECRET
    );

    return responsestatusdata(res, true, "Login successful", { token });
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};

// Delete a franchise by ID
exports.deleteFranchise = async (req, res) => {
  const { id } = req.body;

  try {
    const deletedFranchise = await franchiseModel.findByIdAndDelete(id);
    if (!deletedFranchise) {
      return responsestatusmessage(res, false, "Franchise not found.");
    }
    return responsestatusmessage(res, true, "Franchise deleted successfully");
  } catch (error) {
    return responsestatusmessage(res, false, "Error deleting franchise.");
  }
};

// Get all franchises
exports.getFranchises = async (req, res) => {
  try {
    const franchises = await franchiseModel.find({});
    return responsestatusdata(res, true, "Fetched Successfully", franchises);
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching franchises");
  }
};

exports.getCurrentRole = async (req, res) => {
  try {
    const user = req.user;
    console.log(user)
    return responsestatusdata(res, true, "Fetched Successfully", user);
  } catch (error) {
    return responsestatusmessage(res, false, err?.message);
  }
};
