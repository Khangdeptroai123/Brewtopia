const CallSession = require("../../models/CallSession");

module.exports = (socket, io) => {
  // Tham gia phòng video
  socket.on("video:join", async ({ channelId, userId, role, token }) => {
    try {
      socket.join(channelId);
      console.log(`🎥 ${userId} joined channel ${channelId} as ${role}`);

      // Lưu CallSession mới
      await CallSession.create({
        channelId,
        userId,
        role,
        tokenUsed: token,
      });

      // Gửi thông báo tới các user khác
      socket.to(channelId).emit("video:status", {
        message: `${userId} đã tham gia`,
        type: "join",
        userId,
        role,
      });
    } catch (error) {
      console.error("❌ video:join error:", error.message);
      socket.emit("video:error", { message: error.message });
    }
  });

  // Rời khỏi phòng video
  socket.on("video:leave", async ({ channelId, userId }) => {
    try {
      socket.leave(channelId);
      console.log(`👋 ${userId} left channel ${channelId}`);

      const session = await CallSession.findOneAndUpdate(
        { channelId, userId, isCompleted: false },
        {
          leftAt: new Date(),
          isCompleted: true,
        },
        { new: true }
      );

      if (session && session.joinedAt) {
        session.durationInSeconds = Math.floor(
          (Date.now() - session.joinedAt.getTime()) / 1000
        );
        await session.save();
      }

      io.to(channelId).emit("video:status", {
        message: `${userId} đã rời phòng`,
        type: "leave",
        userId,
      });
    } catch (error) {
      console.error("❌ video:leave error:", error.message);
      socket.emit("video:error", { message: error.message });
    }
  });

  // Xử lý khi client socket disconnect
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected from video:", socket.id);
  });
};
