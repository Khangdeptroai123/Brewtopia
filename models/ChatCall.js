const mongoose = require("mongoose");

const ChatCallSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatCall", ChatCallSchema);
