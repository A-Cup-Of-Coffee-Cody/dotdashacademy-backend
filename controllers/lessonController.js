const lessonService = require("../services/lessonService");

exports.getUserLessons = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const lessons = await lessonService.getUserLessons(userId);
    res.status(200).json({ lessons });
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ message: err.message || "Database error" });
  }
};

exports.getAllLessons = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const lessons = await lessonService.getAllLessons(userId);
    res.status(200).json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).json({ message: err.message || "Database error" });
  }
};

exports.getSubLessons = async (req, res) => {
  const lessonId = req.params.id;

  if (!lessonId) {
    return res.status(400).json({ message: "Lesson ID is required" });
  }

  try {
    const data = await lessonService.getSubLessons(lessonId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching sub lessons:", err);
    res.status(500).json({ message: err.message || "Database error" });
  }
};
