const userLessonModel = require("../models/userLessonModel");
const moment = require("moment");

exports.getUserLessons = async (userId) => {
  const lessons = await userLessonModel.getUserLessons(userId);

  if (lessons.length === 0) {
    throw new Error("No completed lessons found for this user");
  }

  return lessons;
};

exports.getAllLessons = async (userId) => {
  const lessons = await userLessonModel.getAllLessons(userId);

  if (lessons.length === 0) {
    throw new Error("No lessons found for this user");
  }

  return lessons;
};

exports.getSubLessons = async (lessonId) => {
  return await userLessonModel.getSubLessons(lessonId);
};

exports.getUserProgress = async (userId) => {
  if (!userId) {
    return res.status(400).json({ error: "Missing 'userId' parameter." });
  }

  const userProgress = await userLessonModel.getUserProgress(userId);
  return userProgress;
};

exports.trackUserProgress = async (userId, individualLessonId, accuracy) => {
  if (!userId || !individualLessonId || accuracy === undefined) {
    throw new Error("Missing required parameters.");
  }

  await userLessonModel.updateUserProgress(
    userId,
    individualLessonId,
    accuracy
  );
  return { message: "User progress updated successfully." };
};
