const express = require("express");
const { likeOrUnlikes, getLikes } = require("../controllers/likeController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:id", getLikes);
router.post("/", authenticateUser, likeOrUnlikes);

module.exports = router;
