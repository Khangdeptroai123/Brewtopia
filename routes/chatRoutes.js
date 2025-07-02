// routes/chatRoutes.js
const express = require("express");
const {
  createChatRoom,
  getChatRooms,
  sendMessage,
  getMessages,
  uploadChatImage,
} = require("../controllers/chatController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { uploadArray, handleMulterError } = require("../middlewares/upload");

const router = express.Router();

// Lấy danh sách phòng chat mà user tham gia
router.get("/", authenticateUser, getChatRooms);

// Tạo phòng chat mới (cho 1:1 hoặc group)
router.post("/room", authenticateUser, createChatRoom);

// Gửi tin nhắn trong phòng chat
router.post("/message", authenticateUser, sendMessage);

// Lấy lịch sử tin nhắn theo phòng chat
router.get("/message/:roomId", getMessages);
// gửi ảnh theo phòng chat
router.post(
  "/upload-image",
  authenticateUser,
  uploadArray("chat-images", "images", 4),
  handleMulterError,
  uploadChatImage
);
// Lấy danh sách phòng chat mà user tham gia

module.exports = router;
