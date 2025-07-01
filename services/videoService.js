const CallSession = require("../models/CallSession");
const ChatCall = require("../models/ChatCall");

const fetchActiveCalls = async () => {
  return await CallSession.find({ isCompleted: false });
};

const fetchChannelMessages = async (channelId) => {
  return await ChatCall.find({ channelId }).sort({ sentAt: 1 });
};

const join = (name, channel) => {
  // Business logic giả lập
  return {
    success: true,
    message: `${name} đã tham gia phòng "${channel}"`,
  };
};

const leave = (name, channel) => {
  // Business logic giả lập
  return {
    success: true,
    message: `${name} đã rời phòng "${channel}"`,
  };
};

module.exports = { join, leave, fetchActiveCalls, fetchChannelMessages };
