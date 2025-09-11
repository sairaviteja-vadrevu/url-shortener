const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
