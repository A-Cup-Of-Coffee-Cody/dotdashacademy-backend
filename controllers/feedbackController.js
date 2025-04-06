const fs = require("fs");
const path = require("path");
const { sendEmail } = require("../utils/emailUtils");

const submitFeedback = async (req, res) => {
  const { experience, feedbackType, issues, suggestions, recommendation } =
    req.body;

  // Read the feedback template from the 'public' folder
  const templatePath = path.join(__dirname, "../public/feedbackTemplate.html");

  try {
    const feedbackHtml = fs.readFileSync(templatePath, "utf-8");
    const feedbackTypeCapitalized =
      feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1);

    // Replace placeholders with the actual feedback data
    const populatedHtml = feedbackHtml
      .replace("{{feedbackType}}", feedbackTypeCapitalized)
      .replace("{{experience}}", experience)
      .replace("{{issues}}", issues)
      .replace("{{suggestions}}", suggestions)
      .replace("{{recommendation}}", recommendation);

    // Send the email with the populated HTML content
    const subject = "New Feedback Submission";
    await sendEmail(subject, populatedHtml, true); // true tells to send HTML email

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error reading the HTML template:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
};

module.exports = { submitFeedback };
