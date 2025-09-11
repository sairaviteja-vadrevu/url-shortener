// routes/url.js
const express = require("express");
const { nanoid } = require("nanoid");
const geoip = require("geoip-lite");
const useragent = require("useragent");

const authenticateToken = require("../middleware/auth");
const Url = require("../models/url");
const Click = require("../models/click");

const router = express.Router();

// Endpoint to create a short URL
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { longUrl } = req.body;
    const shortUrl = nanoid(8); // Generate a unique short URL
    const newUrl = new Url({
      shortUrl,
      longUrl,
    });
    await newUrl.save();
    res.status(201).json({
      shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
      longUrl,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Endpoint to redirect to the long URL
router.get("/:shortUrl", async (req, res) => {
  try {
    if (!req.params.shortUrl) {
      return res.status(400).json({ error: "Short URL is required" });
    }
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    } else {
      const agent = useragent.parse(req.headers["user-agent"]);
      const geo = geoip.lookup(req.ip);
      const clickEvents = new Click({
        urlId: url._id,
        shortUrl: url.shortUrl,
        ipAddress: req.ip,
        country: geo ? geo.country : "Unknown",
        browser: agent.family,
        os: agent.os.family,
      });

      await clickEvents.save();
      return res.status(301).redirect(url.longUrl);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; // Export the router
