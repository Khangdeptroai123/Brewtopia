const videoService = require("../services/videoService");
const getActiveCalls = async (req, res) => {
  try {
    const result = await videoService.fetchActiveCalls();
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi khi lấy active calls:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
const getChannelMessages = async (req, res) => {
  try {
    const channelId = req.params.channelId;
    console.log(channelId);

    const result = await videoService.fetchChannelMessages(channelId);
    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chat messages:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};
const joinRoom = async (req, res) => {
  const { name, channel } = req.body;

  const result = videoService.join(name, channel);
  res.status(200).json(result);
};
const leaveRoom = (req, res) => {
  const { name, channel } = req.body;
  const result = videoService.leave(name, channel);
  res.status(200).json(result);
};
module.exports = { joinRoom, leaveRoom, getActiveCalls, getChannelMessages };
