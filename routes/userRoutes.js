const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.put("/update-profile", userController.updateProfile);
router.get("/user-profile/:id", userController.getUserProfile);
router.post("/check-streak", userController.checkStreak);

module.exports = router;
