const { supabase } = require("../../config/supabase");

const registerUser = (req, res) => {
  // Logic for registering a user goes here
  const { email, password, confirmPassword } = req.body;

  // This checks for empty fields and returns an error message if any of the required fields are missing.
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // This compares the password and confirmPassword fields to ensure they match. If they don't match, it returns an error message indicating that the passwords do not match.
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  res.json({ message: `${email.split("@")[0]} registered successfully` });
};

const loginUser = (req, res) => {
  // This is the logic for Logging in a user goes here
};

module.exports = { registerUser, loginUser };
