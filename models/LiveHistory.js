const mongoose = require("mongoose");

const liveHistorySchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  hostId: { type: String, required: true },
  title: { type: String, default: "" },
  isLive: { type: Boolean, default: false },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

const LiveHistory = mongoose.model("LiveHistory", liveHistorySchema);
module.exports = LiveHistory;
