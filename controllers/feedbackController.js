const { sendEmail } = require("../utils/emailUtils");

const submitFeedback = async (req, res) => {
  const { experience, feedbackType, issues, suggestions, recommendation } =
    req.body;

  const subject = "New Feedback Submission";
  const feedbackHtml = `
    <h2>New Feedback Received</h2>
    <p><strong>Experience:</strong> ${experience}</p>
    <p><strong>Type:</strong> ${feedbackType}</p>
    <p><strong>Issues:</strong><br>${issues}</p>
    <p><strong>Suggestions:</strong><br>${suggestions}</p>
    <p><strong>Recommendation:</strong> ${recommendation} / 5</p>
  `;

  await sendEmail(subject, feedbackHtml, true); // the `true` tells it to send HTML

  res.status(200).json({ message: "Feedback submitted successfully" });
};

module.exports = { submitFeedback };
