const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const franchiseSchema = new mongoose.Schema(
  {
    franchiseName: {
      type: String,
    },
    userName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    franchiseCode: {
      type: String,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
    },
    image: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    balance: {
      type: Number,
      default : 0
    },
    role: {
      type: String,
      default : 'franchise'
    },
  },
  { timestamps: true }
);

franchiseSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
  
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
    next();
  });
  
  // Compare the password in login
  franchiseSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  

const franchiseModel = mongoose.model("franchise", franchiseSchema);

module.exports = franchiseModel;
