const express = require("express");
const { registerUserEmail, loginUser } = require("../../controller/auth/authController");
const auth_router = express.Router();

// This is the route for user registration
auth_router.post("/register", registerUserEmail);

// This is the route for user login
auth_router.post("/login", loginUser);

module.exports = { auth_router  };
