const express = require("express");
const { registerUser } = require("../../controller/auth/authController");
const auth_router = express.Router();

// This is the route for user registration
auth_router.post("/register", registerUser);

module.exports = { auth_router  };
