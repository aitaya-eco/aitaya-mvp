const bcrypt = require("bcryptjs");
const { supabase } = require("../../config/supabase");
const { generateOtp } = require("../../utils/generateOtp");
const { sendEmail } = require("../../utils/sendEmail");
const { generateRegToken } = require("../../utils/genRegToken");

const registerUserEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const otp = await generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    const { error } = await supabase.from("pending_registrations").insert({
      email: normalizedEmail,
      otp_hash: otpHash,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
      registration_step: "email_pending",
    });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    await sendEmail(
      normalizedEmail,
      "Your Attire verification code",
      `Your verification code is ${otp}. Use it to complete your registration.`,
    );

    return res.status(201).json({
      message: "Verification code sent successfully",
      temp_token: await generateRegToken({
        email: normalizedEmail,
        purpose: "registration",
        step: "email_pending",
      }),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error while registering user",
    });
  }
};

const confirmOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const { email } = req.registration;

    const { data, error } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({
        message: "OTP has expired.",
      });
    }

    const isValid = await bcrypt.compare(String(otp), data.otp_hash);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    const { error: updateError } = await supabase
      .from("pending_registrations")
      .update({
        email_verified: true,
        registration_step: "email_verified",
      })
      .eq("email", email);

    if (updateError) {
      return res.status(500).json({
        message: "Unable to update registration.",
      });
    }

    const newToken = await generateRegToken({
      email,
      purpose: "registration",
      step: "email_verified",
    });

    return res.status(200).json({
      message: "Email verified successfully.",
      temp_token: newToken,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const createPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({
        message: "Password and confirmation are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain an uppercase letter, lowercase letter, number and special character.",
      });
    }

    const { email } = req.registration;

    const { data, error } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "Registration not found.",
      });
    }

    if (!data.email_verified) {
      return res.status(403).json({
        message: "Verify your email first.",
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return res.status(400).json({
        message: authError.message,
      });
    }

    const { error: updateError } = await supabase
      .from("pending_registrations")
      .update({
        registration_step: "password_created",
      })
      .eq("email", email);

    if (updateError) {
      return res.status(500).json({
        message: "Unable to update registration.",
      });
    }

    return res.status(201).json({
      message: "Password created successfully.",
      user: authData?.user || null,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const loginUser = (req, res) => {
  // This is the logic for Logging in a user goes here
};

module.exports = { registerUserEmail, confirmOTP, createPassword, loginUser };
