const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, index: true },
    password: { type: String },
    avatar: { type: String, default: false },
    verificationCode: String,
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    AccStatus: { type: String, default: false },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    isActive: { type: Boolean, default: false },
    lastActive: { type: Date },
    points: {
      type: Number,
      default: 0,
      min: [0, "Points must be non-negative"],
    },
  },
  { timestamps: true, versionKey: false }
);

// Đảm bảo index cho email
UserSchema.index({ email: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = User;
