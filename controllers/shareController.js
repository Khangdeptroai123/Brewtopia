const shareService = require("../services/shareService");

const shareContent = async (req, res) => {
  try {
    const { targetId, targetModel, platform } = req.body;
    const userId = req.user.id;
    const io = req.app.get("socketio");

    if (!targetId || !targetModel || !platform) {
      return res.status(400).json({
        success: false,
        message: "Thiếu targetId, targetModel hoặc platform",
      });
    }

    const result = await shareService.shareContent(
      userId,
      targetId,
      targetModel,
      platform,
      io
    );
    console.log(userId, targetId, targetModel, platform, io);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi chia sẻ",
      error: error.message,
    });
  }
};

const unshareContent = async (req, res) => {
  try {
    const { targetId, targetModel } = req.body;
    const userId = req.user.id;
    const io = req.app.get("socketio");

    if (!targetId || !targetModel) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu targetId hoặc targetModel" });
    }

    const result = await shareService.unshareContent(
      userId,
      targetId,
      targetModel,
      io
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi hủy chia sẻ",
      error: error.message,
    });
  }
};

const getShares = async (req, res) => {
  try {
    const { targetId, targetModel } = req.query;

    if (!targetId || !targetModel) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu targetId hoặc targetModel" });
    }

    const shareCount = await shareService.getSharesCount(targetId, targetModel);

    return res.status(200).json({ success: true, shareCount });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin chia sẻ",
      error: error.message,
    });
  }
};

module.exports = { shareContent, unshareContent, getShares };
