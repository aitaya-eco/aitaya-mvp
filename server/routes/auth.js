const express = require("express");
const auth_router = express.Router();
const { registerUser } = require("../controllers/authController");

// This is the route for user registration
auth_router.post("/register", registerUser);

module.exports = { auth_router };
