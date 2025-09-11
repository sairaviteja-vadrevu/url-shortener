// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/user");

const router = express.Router();

// Endpoint to Sign Up a new user
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to Log In a user
router.post("/login", async (req, res) => {
  const accessTokenKey = process.env.ACCESS_TOKEN;
  const refreshTokenKey = process.env.REFRESH_TOKEN;

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const accessPayload = { userId: user._id, username: user.username };
      const accessToken = jwt.sign(accessPayload, accessTokenKey, {
        expiresIn: "1h",
      });

      const refreshPayload = { userId: user._id };
      const refreshToken = jwt.sign(refreshPayload, refreshTokenKey, {
        expiresIn: "7d",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });

      res.json({ accessToken });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to Refresh Token
router.post("/refresh_token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const accessPayload = { userId: user.userId, username: user.username };
    const newAccessToken = jwt.sign(accessPayload, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    res.json({ accessToken: newAccessToken });
  });
});

module.exports = router; // Export the router
