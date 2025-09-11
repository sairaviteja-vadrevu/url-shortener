// Import Libraries
const express = require("express");
const cookieParser = require("cookie-parser");
// Import routes
const urlsRouter = require("./routes/urls");
const authRouter = require("./routes/auth");

require("dotenv").config();

const app = express(); // Initialize the app

// Middleware to tell Express to parse JSON request bodies
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());

app.set("trust proxy", true); // Trust first proxy

// Connect to MongoDB
require("./config/db")();

const PORT = process.env.PORT || 3535; // Assign a port

// Root endpoint
app.get("/", (req, res) => {
  res.send("URL Shortener API is running!");
});

// Use the imported routes
app.use("/urls", urlsRouter);
app.use("/auth", authRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
