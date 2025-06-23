const Like = require("../models/Like");
const Review = require("../models/Review");
const Post = require("../models/Post");

const likeOrUnlike = async (userId, targetId, targetModel, io) => {
  if (!targetId || !targetModel) {
    throw new Error("targetId hoặc targetModel bị thiếu");
  }

  const existingLike = await Like.findOne({
    user: userId,
    target: targetId,
    targetModel,
  });
  // console.log(existingLike);

  if (existingLike) {
    // Nếu đã like thì unlike (xóa like)
    await Like.findByIdAndDelete(existingLike._id);

    const target = await (targetModel === "Post" ? Post : Review).findById(
      targetId
    );
    if (target && target.likeCount > 0) {
      await target.updateOne({ $inc: { likeCount: -1 } });
    }

    io.emit("like:update", { targetId, likeChange: -1, targetModel });

    return { success: true, message: "Unlike thành công" };
  }

  // Nếu chưa like thì thêm like mới
  await Like.create({ user: userId, target: targetId, targetModel });

  await (targetModel === "Post" ? Post : Review).findByIdAndUpdate(targetId, {
    $inc: { likeCount: 1 },
  });

  io.emit("like:update", { targetId, likeChange: 1, targetModel });

  return { success: true, message: "Like thành công" };
};

// Lấy số lượng likes của Post hoặc Review
const getLikesCount = async (targetId, targetModel) => {
  try {
    const Model = targetModel === "Post" ? Post : Review;
    const target = await Model.findById(targetId);
    return target ? target.likeCount : 0;
  } catch (error) {
    console.error(`Lỗi khi lấy số lượt like ${targetModel}:`, error);
    throw new Error(`Không thể lấy số lượt like`);
  }
};

module.exports = { likeOrUnlike, getLikesCount };
