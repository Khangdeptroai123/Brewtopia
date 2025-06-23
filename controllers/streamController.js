const {
  startLive,
  getHistorys,
  endLive,
} = require("../services/streamService");

// Bắt đầu live
const startLives = async (req, res) => {
  try {
    const { channelId, hostId, title } = req.body;
    const live = await startLive(channelId, hostId, title);
    res.status(200).json({ message: "Bắt đầu live thành công", data: live });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Kết thúc live
const endLives = async (req, res) => {
  try {
    const { channelId } = req.body;
    const live = await endLive(channelId);
    res.status(200).json({ message: "Kết thúc live thành công", data: live });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
const getHistory = async (req, res) => {
  try {
    const all = await getHistorys();
    res.status(200).json({ message: "tìm thấy thành công", data: all });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports = { startLives, getHistory, endLives };
