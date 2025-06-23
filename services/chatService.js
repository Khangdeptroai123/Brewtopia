const ChatRoom = require("../models/ChatRoom");
const ChatMessage = require("../models/ChatMessage");

// Tạo phòng chat mới (1:1 hoặc group)
const createChatRoom = async (chatRoomData) => {
  const chatRoom = await ChatRoom.create(chatRoomData);
  return chatRoom;
};

// Lấy danh sách phòng chat mà user tham gia
const getChatRooms = async (userId) => {
  const rooms = await ChatRoom.find({ participants: userId }).populate(
    "participants",
    "name avatar"
  );
  return rooms;
};

// Gửi tin nhắn trong phòng chat
const sendMessage = async (messageData) => {
  const chatMessage = await ChatMessage.create(messageData);
  return chatMessage;
};

// Lấy danh sách tin nhắn của một phòng chat theo roomId
const getMessages = async (roomId) => {
  const messages = await ChatMessage.find({ chatRoom: roomId })
    .populate("sender", "name avatar")
    .sort({ createdAt: 1 });
  return messages;
};

const findOneToOneRoom = async (userIdA, userIdB) => {
  return await ChatRoom.findOne({
    isGroupChat: false,
    participants: { $all: [userIdA, userIdB], $size: 2 },
  });
};
module.exports = {
  createChatRoom,
  getChatRooms,
  sendMessage,
  getMessages,
  findOneToOneRoom,
};
