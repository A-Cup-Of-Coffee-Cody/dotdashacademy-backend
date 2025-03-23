const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../models/userModel");

exports.updateProfile = async (
  userId,
  username /*, email */,
  password,
  callSign
) => {
  // Check if username / email / callsign exists
  const currentUser = await userModel.getUserById(userId);

  if (currentUser.username !== username) {
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) throw new Error("Username already taken");
  }

  // if (currentUser.email !== email) { // Commented out but kept for future use
  //   const existingEmail = await userModel.getUserByEmail(email);
  //   if (existingEmail) throw new Error("Email already registered");
  // }

  if (currentUser.callSign !== callSign) {
    if (callSign !== "") {
      const existingCallSign = await userModel.getUserByCallSign(callSign);
      if (existingCallSign) throw new Error("CallSign already registered");
    }
  }

  let hashedPassword = null;
  if (password) {
    // Only hash the password if it's provided
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  await userModel.updateUserProfile(
    userId,
    username,
    // email, // Commented out but kept for future use
    callSign,
    hashedPassword
  );
  return "Profile updated successfully";
};

exports.getUserProfile = async (userId) => {
  const userGet = await userModel.getUserById(userId);
  if (!userGet) throw new Error("User not found");

  return {
    user_id: userGet.user_id,
    username: userGet.username,
    // email: userGet.email, // Commented out but kept for future use
    call_sign: userGet.call_sign,
    login_streak: userGet.login_streak,
  };
};

exports.checkAndUpdateStreak = async (userId) => {
  const userStreak = await userModel.getUserById(userId);

  if (userStreak.length === 0) {
    throw new Error("User not found");
  }

  const lastLogin = moment(userStreak.last_login);
  const now = moment();
  let loginStreak = userStreak.login_streak;

  if (!lastLogin.isSame(now, "day")) {
    if (lastLogin.isSame(now.clone().subtract(1, "days"), "day")) {
      loginStreak++; // Increment streak if logged in yesterday
    } else {
      loginStreak = 1; // Reset streak if missed more than one day
    }

    await userModel.updateUserStreak(userId, loginStreak);
  }

  return loginStreak;
};
