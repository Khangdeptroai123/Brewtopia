const Share = require("../models/Share");
const Review = require("../models/Review");
const Post = require("../models/Post");

const MAX_SHARES_PER_USER = 3;

const shareContent = async (userId, targetId, targetModel, platform, io) => {
  try {
    if (!targetId || !targetModel || !platform) {
      throw new Error("Thiếu targetId, targetModel hoặc platform");
    }

    const shareCount = await Share.countDocuments({
      user: userId,
      target: targetId,
      targetModel,
    });

    if (shareCount >= MAX_SHARES_PER_USER) {
      return {
        success: false,
        message: "Bạn đã chia sẻ bài viết này quá số lần cho phép!",
      };
    }

    await Share.create({
      user: userId,
      target: targetId,
      targetModel,
      platform,
    });

    await (targetModel === "Post" ? Post : Review).findByIdAndUpdate(targetId, {
      $inc: { shareCount: 1 },
    });

    if (io && typeof io.emit === "function") {
      io.emit("share:update", { targetId, shareChange: 1, targetModel });
    } else {
      console.warn("⚠️ io.emit không khả dụng!");
    }

    return { success: true, message: "Chia sẻ thành công" };
  } catch (error) {
    console.error("❌ Lỗi khi chia sẻ:", error.message);
    throw new Error("Lỗi khi thực hiện chia sẻ");
  }
};

const unshareContent = async (userId, targetId, targetModel, io) => {
  try {
    if (!targetId || !targetModel) {
      throw new Error("Thiếu targetId hoặc targetModel");
    }

    const Model = targetModel === "Post" ? Post : Review;

    // Kiểm tra xem người dùng có chia sẻ bài viết này không
    const existingShare = await Share.findOne({
      user: userId,
      target: targetId,
      targetModel,
    });

    if (!existingShare) {
      return { success: false, message: "Bạn chưa chia sẻ nội dung này" };
    }

    // Xóa chia sẻ
    await Share.deleteOne({ _id: existingShare._id });

    // Giảm số lượt chia sẻ của bài viết
    const updatedTarget = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { shareCount: -1 } },
      { new: true }
    );

    if (io && typeof io.emit === "function") {
      io.emit("share:update", { targetId, shareChange: -1, targetModel });
    }

    return {
      success: true,
      message: "Hủy chia sẻ thành công",
      shareCount: updatedTarget.shareCount,
    };
  } catch (error) {
    console.error("❌ Lỗi khi hủy chia sẻ:", error);
    throw new Error("Lỗi khi thực hiện hủy chia sẻ");
  }
};

const getSharesCount = async (targetId, targetModel) => {
  try {
    const Model = targetModel === "Post" ? Post : Review;
    const target = await Model.findById(targetId);
    return target ? target.shareCount : 0;
  } catch (error) {
    console.error(`Lỗi khi lấy số lượt chia sẻ ${targetModel}:`, error);
    throw new Error(`Không thể lấy số lượt chia sẻ`);
  }
};

module.exports = { shareContent, unshareContent, getSharesCount };
