const commentService = require("../../services/commentService");

module.exports = (socket, io) => {
  socket.on("comment:create", async (data) => {
    const { targetId, targetType, content, userId } = data;
    console.log(data);

    try {
      const newComment = await commentService.createComment(
        { user: userId, targetId, targetType, content },
        io
      );

      io.emit("comment:update", {
        action: "create",
        comment: newComment,
      });
    } catch (error) {
      socket.emit("comment:error", { message: error.message });
    }
  });

  socket.on("comment:delete", async ({ commentId }) => {
    try {
      const result = await commentService.deleteComment(commentId, io);
      io.emit("comment:update", {
        action: "delete",
        commentId,
      });
    } catch (error) {
      socket.emit("comment:error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};
