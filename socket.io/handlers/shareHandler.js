const Share = require("../../models/Share");
const shareService = require("../../services/shareService");

module.exports = (socket, io) => {
  socket.on("shareToggle", async (data) => {
    const { targetId, userId, targetModel, platform } = data;
    try {
      const existingShare = await Share.findOne({
        user: userId,
        target: targetId,
        targetModel,
      });

      let result;
      if (existingShare) {
        result = await shareService.unshareContent(
          userId,
          targetId,
          targetModel,
          io
        );
      } else {
        result = await shareService.shareContent(
          userId,
          targetId,
          targetModel,
          platform,
          io
        );
      }
      console.log("🟢 Đã nhận event sharehandler:", {
        targetId,
        userId,
        targetModel,
        platform,
      });
      // Phát sự kiện cập nhật share cho tất cả client
      const shareChange = result.message.includes("Hủy") ? -1 : 1;
      io.emit("share:update", { targetId, shareChange, targetModel });

      socket.emit("share:response", result);
    } catch (error) {
      console.error("❌ Lỗi trong shareToggle:", error.message);
      socket.emit("share:error", { message: error.message });
    }
  });
};
