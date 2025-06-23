const express = require("express");
const router = express.Router();
const { getToken } = require("../controllers/agoraController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.post("/token", getToken);
module.exports = router;
