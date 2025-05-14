const { default: mongoose } = require("mongoose");
const upload = require("../middleware/multer.middleware");
const {
  responsestatusmessage,
  responsestatusdata,
} = require("../middleware/responses");
const franchiseModel = require("../model/franchise.model");
const jwt = require("jsonwebtoken"); // For generating JWT tokens
const transactionModel = require("../model/transaction.model");

// Add a new franchise
exports.addFranchise = async (req, res) => {
  upload.single("franchiseProfile")(req, res, async () => {
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

exports.updateFranchise = async (req, res) => {
  upload.single("franchiseProfile")(req, res, async () => {
    try {
      const {
        id,
        franchiseName,
        fullName,
        phoneNumber,
        email,
        franchiseCode,
        password,
        address,
      } = req.body;

      if (!id) {
        return responsestatusmessage(res, false, "Franchise ID is required.");
      } // Build the update object (exclude role if present)

      const updateData = {
        ...(franchiseName && { franchiseName }),
        ...(fullName && { fullName }),
        ...(phoneNumber && { phoneNumber }),
        ...(email && { email }),
        ...(franchiseCode && { franchiseCode }),
        ...(password && { password }),
        ...(address && { address }),
      }; // Handle file upload if present

      if (req.file) {
        updateData.image = `${req.file.fieldname}/${req.file.generatedName}`;
      } // Prevent updating the role even if it comes in req.body

      if (updateData.role) {
        delete updateData.role;
      }

      const updatedFranchise = await franchiseModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedFranchise) {
        return responsestatusmessage(res, false, "Franchise not found.");
      }

      return responsestatusdata(
        res,
        true,
        "Franchise updated successfully",
        updatedFranchise
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
    const franchises = await franchiseModel.find({ role: { $ne: "admin" } });
    return responsestatusdata(res, true, "Fetched Successfully", franchises);
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching franchises");
  }
};

exports.getCurrentRole = async (req, res) => {
  try {
    const user = req.user;
    return responsestatusdata(res, true, "Fetched Successfully", user);
  } catch (error) {
    return responsestatusmessage(res, false, err?.message);
  }
};

exports.getSingleFranchise = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);

    const [franchise, transactions] = await Promise.all([
      franchiseModel.findOne({ _id: objectId, role: { $ne: "admin" } }),
      transactionModel.find({ franchiseId: objectId }).sort({ createdAt: -1 }),
    ]);

    if (!franchise) {
      return responsestatusmessage(res, false, "Franchise not found");
    }

    return responsestatusdata(res, true, "Fetched Successfully", {
      ...franchise.toObject(),
      transactions,
    });
  } catch (error) {
    return responsestatusmessage(res, false, "Error fetching franchises");
  }
};

exports.deleteFranchise = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStream = await franchiseModel.findByIdAndDelete(id);
    if (!deletedStream) {
      return responsestatusmessage(res, false, "Franchise not found.");
    }
    return responsestatusmessage(res, true, "Deleted Successfully");
  } catch (error) {
    return responsestatusmessage(res, false, "Error deleting Franchise.");
  }
};

exports.addBalance = async (req, res) => {
  try {
    const { franchiseId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(franchiseId)) {
      return responsestatusmessage(res, false, "Invalid Franchise ID.");
    }

    const franchise = await franchiseModel.findById(franchiseId);
    if (!franchise) {
      return responsestatusmessage(res, false, "Franchise not found.");
    }

    const numericAmount = Number(amount);
    const currentBalance = Number(franchise.balance) || 0;

    if (isNaN(numericAmount)) {
      return responsestatusmessage(
        res,
        false,
        "Amount must be a valid number."
      );
    }

    if (numericAmount < 0 && Math.abs(numericAmount) > currentBalance) {
      return responsestatusmessage(
        res,
        false,
        "Insufficient balance. Cannot deduct the amount."
      );
    }

    const newBalance = currentBalance + numericAmount;

    const transaction = new transactionModel({
      total: newBalance,
      addAmount: numericAmount > 0 ? numericAmount : undefined,
      lessAmount: numericAmount < 0 ? Math.abs(numericAmount) : undefined,
      franchiseId: franchise._id,
    });

    await transaction.save();

    franchise.balance = newBalance;
    await franchise.save();

    return responsestatusmessage(res, true, "Franchise updated successfully.", {
      balance: franchise.balance,
      transaction,
    });
  } catch (error) {
    console.error(error);
    return responsestatusmessage(res, false, "Something went wrong.");
  }
};
