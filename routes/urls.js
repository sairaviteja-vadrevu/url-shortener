// routes/url.js
const express = require("express");
const { nanoid } = require("nanoid");
const geoip = require("geoip-lite");
const useragent = require("useragent");

const authenticateToken = require("../middleware/auth");
const Url = require("../models/url");
const User = require("../models/user");
const Click = require("../models/click");

const router = express.Router();

// Endpoint to create a short URL
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { longUrl, username } = req.body;
    const shortCode = nanoid(8); // Generate a unique short URL
    if (!longUrl || !username) {
      return res
        .status(400)
        .json({ error: "Long URL and username are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const newUrl = new Url({
      shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/urls/${shortCode}`,
      longUrl,
      username,
    });
    await newUrl.save();
    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get("host")}/urls/${shortCode}`,
      shortCode,
      longUrl,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to redirect to the long URL
router.get("/:shortCode", async (req, res) => {
  try {
    if (!req.params.shortCode) {
      return res.status(400).json({ error: "Short Code is required" });
    }
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    } else {
      const agent = useragent.parse(req.headers["user-agent"]);
      const geo = geoip.lookup(req.ip);
      const clickEvents = new Click({
        urlId: url._id,
        shortCode: url.shortCode,
        shortUrl: url.shortUrl,
        ipAddress: req.ip,
        country: geo ? geo.country : "Unknown",
        browser: agent.family,
        os: agent.os.family,
        referer: req.headers["referer"] || "Direct",
        username: url.username,
      });

      await clickEvents.save();
      return res.status(301).redirect(url.longUrl);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoin to get all URLs for a user
router.post("/user", authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userUrls = await Url.find({ username }, { __v: 0 });
    res.status(200).json(userUrls);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // Export the router
