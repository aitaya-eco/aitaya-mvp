const jwt = require("jsonwebtoken");

const generateRegToken = async (payload) => {
  const tokenPayload =
    typeof payload === "string"
      ? { email: payload, purpose: "registration" }
      : {
          email: payload.email,
          purpose: payload.purpose || "registration",
          step: payload.step || "email_pending",
        };

  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "15m" };

  return jwt.sign(tokenPayload, secret, options);
};

module.exports = { generateRegToken };
