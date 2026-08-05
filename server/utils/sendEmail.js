const nodemailer = require("nodemailer");
require("dotenv").config()

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    // user: "richardthed3veloper@gmail.com",
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_TRANSPORTER_MAIL,
      to: to,
      subject: subject,
      text: text,
    });

    console.log("Email sent");
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
}

module.exports = { sendEmail };
