const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." }); // Use JSON response
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 - salt
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message }); // Send error message
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." }); // More generic message
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." }); // More generic message
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key from .env
      { expiresIn: "1h" } // Expiration time
    );

    // Send the token back to the client
    res.status(200).json({
      message: "Logged in successfully!",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
