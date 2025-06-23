const eventService = require("../../services/eventService");

module.exports = (socket, io) => {
  socket.on("followOrUnfollow", async ({ eventId, userId }) => {
    try {
      const event = await eventService.toggleFollowEvent(eventId, userId);

      // Kiểm tra trạng thái sau khi toggle
      const isFollowing = event.followers
        .map((id) => id.toString())
        .includes(userId);

      // Gửi cập nhật số lượng follower cho tất cả client
      io.emit("follow:update", {
        eventId,
        followChange: isFollowing ? 1 : -1, // Nếu là follow thì +1, unfollow thì -1
        followersCount: event.followers.length,
      });

      // Gửi thông báo riêng cho client đã thực hiện hành động
      socket.emit("follow:response", {
        message: isFollowing ? "Đã follow" : "Đã unfollow",
        eventId,
        followersCount: event.followers.length,
      });
    } catch (error) {
      console.error("❌ Lỗi trong followOrUnfollow:", error.message);
      socket.emit("follow:error", { message: error.message });
    }
  });
};
