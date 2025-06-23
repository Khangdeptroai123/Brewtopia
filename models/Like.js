const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: { type: String, enum: ["Post", "Review"], required: true },
  },
  { timestamps: true, versionKey: false }
);

LikeSchema.index({ user: 1 });
LikeSchema.index({ target: 1, targetModel: 1 });

const Like = mongoose.model("Like", LikeSchema);
module.exports = Like;
