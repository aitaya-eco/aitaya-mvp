const crypto = require("crypto");

const generateOtp = async (length = 6) => {
  const otp = Array.from({ length }, () => crypto.randomInt(0, 10)).join("");

  return otp;
};

module.exports = { generateOtp };
