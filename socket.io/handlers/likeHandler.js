const likeService = require("../../services/likeService");

module.exports = (socket, io) => {
  socket.on("likeOrUnlike", async ({ targetId, userId, targetModel }) => {
    console.log("🟢 Đã nhận event likeOrUnlike:", {
      targetId,
      userId,
      targetModel,
    });

    try {
      const result = await likeService.likeOrUnlike(
        userId,
        targetId,
        targetModel,
        io
      );

      io.emit("like:update", {
        targetId,
        likeChange: result.message.includes("Unlike") ? -1 : 1,
        targetModel,
      });

      socket.emit("like:response", result);
    } catch (error) {
      console.error("❌ Lỗi trong likeOrUnlike:", error.message);
      socket.emit("like:error", { message: error.message });
    }
  });
};
