const express = require("express");
const router = express.Router();
const {
  startLives,
  endLives,
  getHistory,
} = require("../controllers/streamController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/start", startLives);
router.get("/history", getHistory);
router.post("/end", endLives);

module.exports = router;
