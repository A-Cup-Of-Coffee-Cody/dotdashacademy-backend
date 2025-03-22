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
