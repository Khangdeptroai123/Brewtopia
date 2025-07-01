const ChatCall = require("../../models/ChatCall");

module.exports = (socket, io) => {
  // Gửi tin nhắn chat trong phòng gọi
  socket.on("chat-message", async ({ channel, name, message }) => {
    try {
      // Kiểm tra hợp lệ
      if (!channel || !name || !message) {
        socket.emit("chat:error", { message: "Thiếu dữ liệu bắt buộc." });
        return;
      }

      // Lưu vào DB
      const chat = await ChatCall.create({
        channelId: channel,
        userId: name,
        message,
      });
      console.log(chat.userId);

      // Phát tin nhắn cho toàn bộ phòng đó
      io.to(channel).emit("chat-message", {
        name: chat.userId,
        message: chat.message,
        createdAt: chat.createdAt,
      });
    } catch (error) {
      console.error("❌ Lỗi chat-message:", error);
      socket.emit("chat:error", { message: error.message });
    }
  });

  // Tự động tham gia phòng theo channel khi kết nối
  socket.on("join-room", ({ channel }) => {
    if (channel) {
      socket.join(channel);
      console.log(`📥 Socket ${socket.id} đã join vào phòng chat ${channel}`);
    }
  });
};
