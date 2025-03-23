const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const userModel = require("../models/userModel");

exports.signup = async (username, password /*, email */) => {
  // Check if username or email exists
  const existingUser = await userModel.getUserByUsername(username);
  if (existingUser) throw new Error("Username already taken");

  // const existingEmail = await userModel.getUserByEmail(email);
  // if (existingEmail) throw new Error("Email already registered");

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  // await userModel.createUser(username, hashedPassword, email);
  await userModel.createUser(username, hashedPassword);

  return "User created successfully";
};

exports.login = async (username, password) => {
  const user = await userModel.getUserByUsername(username);
  if (!user) throw new Error("Invalid username or password");

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Invalid username or password");

  const token = jwt.sign(
    {
      id: user.user_id,
      username: user.username,
      // email: user.email, // Commented out but kept for future use
      callSign: user.call_sign,
      loginStreak: user.login_streak,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};
