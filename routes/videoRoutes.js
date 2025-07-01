const express = require("express");
const router = express.Router();
const {
  joinRoom,
  leaveRoom,
  getChannelMessages,
  getActiveCalls,
} = require("../controllers/videoController");
const path = require("path");

// Giao diện HTML
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});
router.get("/active", getActiveCalls);
router.get("/chat/:channelId", getChannelMessages);
// API xử lý logic
router.post("/join", joinRoom);
router.post("/leave", leaveRoom);

module.exports = router;
