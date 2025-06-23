const ChatRoom = require("../../models/ChatRoom");
const ChatMessage = require("../../models/ChatMessage");

module.exports = (socket, io) => {
  socket.on("sendMessage", async ({ chatId, senderId, message }) => {
    try {
      const chatRoom = await ChatRoom.findById(chatId);

      if (!chatRoom) {
        socket.emit("error", { message: "Phòng chat không tồn tại" });
        return;
      }
      if (!chatRoom.participants.includes(senderId)) {
        socket.emit("error", {
          message: "Bạn không có quyền gửi tin nhắn trong phòng này",
        });
        return;
      }

      // **Lưu tin nhắn vào DB**
      const chatMessage = await ChatMessage.create({
        chatRoom: chatId,
        sender: senderId,
        message,
      });

      // Gửi lại cho các client khác
      io.to(chatId).emit("receiveMessage", {
        _id: chatMessage._id,
        chatRoom: chatMessage.chatRoom,
        sender: chatMessage.sender,
        message: chatMessage.message,
      });
    } catch (error) {
      socket.emit("error", {
        message: "Lỗi gửi tin nhắn",
        error: error.message,
      });
    }
  });
  socket.on("joinRoom", async (roomId, userId) => {
    try {
      const chatRoom = await ChatRoom.findById(roomId);

      if (!chatRoom) {
        socket.emit("error", { message: "Phòng chat không tồn tại" });
        return;
      }
      if (!chatRoom.participants.includes(userId)) {
        socket.emit("error", {
          message: "Bạn không được phép tham gia phòng này",
        });
        return;
      }
      socket.join(roomId);
      console.log(`User ${userId} joined room: ${roomId}`);
      io.to(roomId).emit("systemMessage", {
        message: `Người dùng ${userId} đã tham gia phòng`,
        type: "join",
      });
    } catch (error) {
      console.log(error);
      socket.emit("error", {
        message: "Lỗi tham gia phòng",
        error: error.message,
      });
    }
  });

  socket.on("leaveRoom", async (roomId, userId) => {
    try {
      const chatRoom = await ChatRoom.findById(roomId);
      if (!chatRoom) {
        socket.emit("error", { message: "Phòng chat không tồn tại" });
        return;
      }
      socket.leave(roomId);
      console.log(`User ${userId} left room: ${roomId}`);
      io.to(roomId).emit("systemMessage", {
        message: `Người dùng ${userId} đã rời phòng`,
        type: "leave",
      });
    } catch (error) {
      socket.emit("error", { message: "Lỗi rời phòng", error: error.message });
    }
  });
};
