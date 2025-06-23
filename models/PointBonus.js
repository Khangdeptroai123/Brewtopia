const mongoose = require("mongoose");

const PointBonusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["daily", "event", "referral", "manual", "task"],
      required: true,
      default: "manual", //mặc định là thủ công
    },
    note: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  { timestamps: true, versionKey: false }
);
const PointBonus = mongoose.model("PointBonus", PointBonusSchema);
module.exports = PointBonus;
