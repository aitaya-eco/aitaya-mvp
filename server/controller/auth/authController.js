const { supabase } = require("../../config/supabase");
const { generateOtp } = require("../../utils/generateOtp");
const { sendEmail } = require("../../utils/sendEmail");

const registerUserEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  try {
    const otp = await generateOtp();

    await sendEmail(
      normalizedEmail,
      "Your attire verification code",
      `Your verification code is ${otp}. Use it to complete your registration.`,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: otp,
      email_confirm: true,
      user_metadata: {
        otp,
      },
    });

    if (error) {
      return res.status(400).json({
        message: error.message || "Unable to create user",
      });
    }

    return res.status(201).json({
      message: "Verification code sent successfully",
      user: data?.user || null,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error while registering user",
    });
  }
};

const loginUser = (req, res) => {
  // This is the logic for Logging in a user goes here
};

module.exports = { registerUserEmail, loginUser };
