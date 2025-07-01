const mongoose = require("mongoose");

const CallSessionSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["streamer", "viewer"],
      required: true,
    },
    tokenUsed: {
      type: String,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
      type: Date,
    },
    durationInSeconds: {
      type: Number,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CallSession", CallSessionSchema);
