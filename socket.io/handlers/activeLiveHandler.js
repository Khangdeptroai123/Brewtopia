const LiveHistory = require("../../models/LiveHistory");
const ChatStream = require("../../models/ChatStream");
const ChatMessage = require("../../models/ChatMessage");
const User = require("../../models/User");

module.exports = (socket, io) => {
  // Khi host bắt đầu live

  socket.on("live:start", async ({ channelId, hostId, title }) => {
    const host = await User.findById(hostId);
    console.log(host);
    socket.join(channelId);
    if (host) {
      await LiveHistory.create({ channelId, hostId, title, isLive: true });
    }
    io.emit("live:update", { channelId, isLive: true, hostId, title });
  });

  // Gửi tin nhắn chat trong live
  socket.on("live:chat", async ({ channelId, senderId, message }) => {
    const chat = await ChatStream.create({ channelId, senderId, message });
    console.log(chat);
    io.to(channelId).emit("live:chat", chat);
  });

  // Kết thúc live
  socket.on("live:end", async ({ channelId }) => {
    await LiveHistory.findOneAndUpdate(
      { channelId, isLive: true },
      { isLive: false, endedAt: new Date() }
    );
    io.emit("live:update", { channelId, isLive: false });
  });

  // Lấy danh sách kênh đang live
  socket.on("live:getOnline", async () => {
    const liveChannels = await LiveHistory.find({ isLive: true });
    socket.emit("live:onlineChannels", liveChannels);
  });

  // Lấy lịch sử stream của 1 kênh
  socket.on("live:getHistory", async ({ channelId }) => {
    const history = await LiveHistory.find({ channelId }).sort({
      startedAt: -1,
    });
    socket.emit("live:history", history);
  });

  // Lấy chat lịch sử
  socket.on("live:getChat", async ({ channelId }) => {
    const messages = await ChatMessage.find({ channelId }).sort({ sentAt: 1 });
    socket.emit("live:chatHistory", messages);
  });
};
