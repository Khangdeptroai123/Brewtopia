const express = require("express");
const {
  createOrderMeetingRoom,
  getOrderMeetingRooms,
} = require("../../controllers/orderController");
const { authenticateUser } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, createOrderMeetingRoom);
router.get("/", authenticateUser, getOrderMeetingRooms);

module.exports = router;
