const express = require("express");
const {
  createPointBonus,
  getPointBonus,
} = require("../controllers/pointBonusController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createPointBonus);
router.get("/", authenticateUser, getPointBonus);

module.exports = router;
