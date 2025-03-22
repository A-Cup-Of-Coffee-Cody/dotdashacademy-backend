const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const message = await authService.signup(username, password, email);
    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `${err.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: `${err.message}` });
  }
};
