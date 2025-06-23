// PointPurchase.js
const mongoose = require("mongoose");

const PointPurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: [0, "Points must be non-negative"],
    },
    type: {
      type: String,
      enum: ["package", "promotion", "manual"],
      required: true,
      default: "package",
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

PointPurchaseSchema.index({ user: 1, status: 1 });
const PointPurchase = mongoose.model("PointPurchase", PointPurchaseSchema);
module.exports = PointPurchase;
