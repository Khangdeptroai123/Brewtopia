const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    images: [String],
    likeCount: { type: Number, default: 0 }, // 🔥 Giữ lại số like trực tiếp
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const review = mongoose.model("Review", ReviewSchema);
module.exports = review;
