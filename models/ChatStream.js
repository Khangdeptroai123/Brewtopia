const mongoose = require("mongoose");

const chatStreamSchema = new mongoose.Schema({
  channelId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

const chatMessageSchema = mongoose.model("ChatStream", chatStreamSchema);
module.exports = chatMessageSchema;
