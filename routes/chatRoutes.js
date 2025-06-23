// routes/chatRoutes.js
const express = require("express");
const {
  createChatRoom,
  getChatRooms,
  sendMessage,
  getMessages,
} = require("../controllers/chatController");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

// Lấy danh sách phòng chat mà user tham gia
router.get("/", authenticateUser, getChatRooms);

// Tạo phòng chat mới (cho 1:1 hoặc group)
router.post("/room", authenticateUser, createChatRoom);

// Gửi tin nhắn trong phòng chat
router.post("/message", authenticateUser, sendMessage);

// Lấy lịch sử tin nhắn theo phòng chat
router.get("/message/:roomId", getMessages);

module.exports = router;
