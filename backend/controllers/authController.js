const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid Credentials" });
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });
  
      // Generate Token
      const token = generateToken(user._id, user.role);
  
      // Send Response
      res.json({
        message: "Login Successful",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  const logout = (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // Set expiration to remove cookie
    });
  
    res.json({ message: "Logged out successfully" });
  };
  
  module.exports = { logout };
  
  
