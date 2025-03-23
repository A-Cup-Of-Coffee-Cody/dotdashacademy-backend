const userService = require("../services/userService");

exports.updateProfile = async (req, res) => {
  try {
    const { userId, username, /* email, */ password, call_sign } = req.body;
    const message = await userService.updateProfile(
      userId,
      username,
      // email, // Commented out but kept for future use
      password,
      call_sign
    );
    res.status(200).json({ message });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: `${err.message}` });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: `${err.message}` });
  }
};

exports.checkStreak = async (req, res) => {
  const { userId } = req.body;

  try {
    const loginStreak = await userService.checkAndUpdateStreak(userId);
    res.status(200).json({ message: "Streak checked", loginStreak });
  } catch (err) {
    console.error("Error checking streak:", err);
    res.status(500).json({ message: err.message || `${err.message}` });
  }
};
