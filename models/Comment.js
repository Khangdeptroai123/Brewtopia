const mongoose = require("mongoose");
const autoPopulateUser = require("../middlewares/populateMiddleware");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ["Post", "Review"], required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, versionKey: false }
);

CommentSchema.index({ user: 1 });
CommentSchema.index({ targetId: 1, targetType: 1 });
const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
