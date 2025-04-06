const { sendEmail } = require("../utils/emailUtils");

const submitFeedback = async (req, res) => {
  const { experience, feedbackType, issues, suggestions, recommendation } =
    req.body;

  const subject = "New Feedback Submission";
  const feedbackHtml = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #6b6c66; /* Grey background for the whole email */
          padding: 20px;
          color: #333;
        }
        h1, h2 {
          color: #3f72af; /* Header color */
        }
        p {
          background: #ffffff; /* White background for paragraphs */
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          margin-bottom: 15px; /* Add space between paragraphs */
        }
        strong {
          color: #000; /* Black color for strong tags */
        }
      </style>
    </head>
    <body>
      <h1>New Feedback Received</h1>
      <h2>Type: ${feedbackType}</h2>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Issues:</strong><br>${issues}</p>
      <p><strong>Suggestions:</strong><br>${suggestions}</p>
      <p><strong>Recommendation:</strong> ${recommendation} / 5</p>
    </body>
  </html>
  `;

  await sendEmail(subject, feedbackHtml, true); // the `true` tells it to send HTML

  res.status(200).json({ message: "Feedback submitted successfully" });
};

module.exports = { submitFeedback };
