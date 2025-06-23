const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const { targetId, targetType, content } = req.body;
    const userId = req.user.id;
    const io = req.io; // Nhận io từ middleware

    if (!targetId || !targetType || !content) {
      return res.status(400).json({ message: "Thiếu thông tin bình luận" });
    }

    const newComment = await commentService.createComment(
      { user: userId, targetId, targetType, content },
      io
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { targetId, targetType } = req.body;

    if (!targetId || !targetType) {
      return res
        .status(400)
        .json({ message: "Thiếu targetId hoặc targetType" });
    }

    const comments = await commentService.getCommentsByTarget(
      targetId,
      targetType
    );
    res.json(comments);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi server khi lấy bình luận" });
  }
};

const getCmtsToPost = async (req, res) => {
  try {
    const { targetId, targetType } = req.body;

    if (!targetId || !targetType) {
      return res
        .status(400)
        .json({ message: "Thiếu targetId hoặc targetType" });
    }

    const comments = await commentService.getCommentsByTarget(
      targetId,
      targetType
    );
    res.json(comments);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi server khi lấy bình luận" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.io;

    const result = await commentService.deleteComment(id, io);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
};
