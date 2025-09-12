// models/event.js

const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true },
  shortCode: { type: String, required: true },
  shortUrl: { type: String, required: true, index: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  country: { type: String },
  browser: { type: String },
  os: { type: String },
});

const Click = mongoose.model("Click", clickSchema);
module.exports = Click;
