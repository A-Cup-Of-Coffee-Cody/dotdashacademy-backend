const express = require("express");
const lessonController = require("../controllers/lessonController");

const router = express.Router();

router.get("/user-lessons/:id", lessonController.getUserLessons);
router.get("/all-lessons/:id", lessonController.getAllLessons);
router.get("/sub-lessons/:id", lessonController.getSubLessons);
router.post("/user-progress", lessonController.getUserProgress);
router.post("/update-user-progress", lessonController.updateUserProgress);

module.exports = router;
