const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to MongoDB", e);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
