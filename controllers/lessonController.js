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

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing 'userId' parameter." });
    }

    const response = await lessonService.getUserProgress(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserProgress = async (req, res) => {
  try {
    const { userId, individualLessonId, accuracy } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing 'userId' parameter." });
    }

    if (!individualLessonId) {
      return res
        .status(400)
        .json({ error: "Missing 'individualLessonId' parameter." });
    }

    if (accuracy === undefined) {
      return res.status(400).json({ error: "Missing 'accuracy' parameter." });
    }

    const response = await lessonService.trackUserProgress(
      userId,
      individualLessonId,
      accuracy
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
