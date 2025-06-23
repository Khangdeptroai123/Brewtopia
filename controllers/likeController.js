const { likeOrUnlike, getLikesCount } = require("../services/likeService");

const likeOrUnlikes = async (req, res) => {
  try {
    const { targetId, targetModel } = req.body;
    const userId = req.user.id;

    if (!targetId || !targetModel) {
      return res
        .status(400)
        .json({ message: "Thiếu targetId hoặc targetModel" });
    }

    const result = await likeOrUnlike(userId, targetId, targetModel, req.io);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi like/unlike",
      error: error.message,
    });
  }
};

const getLikes = async (req, res) => {
  try {
    const { id: targetId } = req.params;
    const { targetModel } = req.body;

    if (!targetModel) {
      return res.status(400).json({ message: "Thiếu targetModel" });
    }

    const count = await getLikesCount(targetId, targetModel);
    res.status(200).json({ likeCount: count });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy số lượt like",
      error: error.message,
    });
  }
};

module.exports = { getLikes, likeOrUnlikes };
