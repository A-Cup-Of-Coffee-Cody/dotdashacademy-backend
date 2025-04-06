const nodemailer = require("nodemailer");

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send feedback email
 * @param {string} subject - Email subject
 * @param {string} content - Email body (text or HTML)
 * @param {boolean} isHtml - Set to true if sending HTML email
 */
const sendEmail = async (subject, content, isHtml = false) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.FEEDBACK_EMAIL,
    subject,
    ...(isHtml ? { html: content } : { text: content }),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Feedback email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
