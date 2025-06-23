const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    images: [String],
    likeCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

PostSchema.index({ user: 1 });
PostSchema.index({ createdAt: -1 });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
