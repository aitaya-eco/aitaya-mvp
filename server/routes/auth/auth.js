const express = require("express");
const {
  registerUserEmail,
  confirmOTP,
  createPassword,
  loginUser,
} = require("../../controller/auth/authController");
const authMiddle = require("../../middleware/authMiddle");
const auth_router = express.Router();

// This is the route for user registration
auth_router.post("/register", registerUserEmail);
auth_router.post("/confirm-otp", authMiddle, confirmOTP);
auth_router.post("/create-password", authMiddle, createPassword);

// This is the route for user login
auth_router.post("/login", loginUser);

module.exports = { auth_router };
