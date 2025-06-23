// models/ChatRoom.js
const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  name: { type: String, default: null }, // Dùng cho group chat
  isGroupChat: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
