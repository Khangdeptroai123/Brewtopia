const express = require("express");
const {
  unshareContent,
  shareContent,
  getShares,
} = require("../controllers/shareController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getShares);
router.post("/", authenticateUser, shareContent);
router.post("/unshare", authenticateUser, unshareContent);

module.exports = router;
