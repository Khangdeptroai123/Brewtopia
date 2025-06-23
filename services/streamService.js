// services/userService.js
const LiveHistory = require("../models/LiveHistory");

const startLive = async (channelId, hostId, title = "") => {
  // Kiểm tra nếu đã có live cùng channelId & isLive
  let existing = await LiveHistory.findOne({ channelId, isLive: true });
  if (existing) return existing;

  const live = await LiveHistory.create({
    channelId,
    hostId,
    title,
    isLive: true,
    startedAt: new Date(),
  });
  return live;
};

// Kết thúc live
const endLive = async (channelId) => {
  const live = await LiveHistory.findOneAndUpdate(
    { channelId, isLive: true },
    { isLive: false, endedAt: new Date() },
    { new: true }
  );
  return live;
};
const getHistorys = async () => {
  const all = await LiveHistory.find({ isLive: false });
  return all;
};
module.exports = { startLive, endLive, getHistorys };
