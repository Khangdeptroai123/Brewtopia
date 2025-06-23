const Comment = require("../models/Comment");

const createComment = async (commentData, io) => {
  try {
    const comment = await Comment.create(commentData);
    const populatedComment = await comment.populate("user", "name avatar"); // Populate user thông tin cần thiết

    // Phát sự kiện cập nhật comment mới đến client
    io.emit("comment:update", {
      action: "create",
      comment: populatedComment,
    });

    return populatedComment;
  } catch (error) {
    throw new Error("Không thể tạo bình luận");
  }
};

const getCommentsByTarget = async (targetId, targetType) => {
  try {
    const comments = await Comment.find({ targetId, targetType }).sort({
      createdAt: -1,
    }); // Lấy comment mới nhất trước

    if (!comments.length) {
      console.log("⚠ Không có bình luận nào được tìm thấy");
    }

    return comments;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách bình luận:", error);
    throw new Error("Không thể lấy danh sách bình luận");
  }
};

const deleteComment = async (id, io) => {
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) throw new Error("Bình luận không tồn tại");

    // Phát sự kiện cập nhật xoá comment
    io.emit("comment:update", {
      action: "delete",
      commentId: id,
      targetId: comment.targetId,
    });

    return { message: "Xóa bình luận thành công", commentId: id };
  } catch (error) {
    throw new Error("Không thể xóa bình luận");
  }
};

module.exports = {
  createComment,
  getCommentsByTarget,
  deleteComment,
};
