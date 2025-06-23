const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderCode: { type: Number, require: true, unique: true },
  amount: { type: Number, required: true },
  description: { type: String, require: true },
  paymentLinkId: { type: String },
  targetModel: {
    type: String,
    enum: ["UpgradePremium", "UpgradeVIP", "PointPurchase"], // Có thể thêm nữa
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
    default: "PENDING",
  },
  Provider: {
    type: String,
    enum: ["Momo", "Vnpay", "Payos", "Paypal", "ZaloPay"],
    default: "Payos",
  },
  currency: {
    type: String,
    enum: ["VND", "USD"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const payment = mongoose.model("Payment", PaymentSchema);
module.exports = payment;
