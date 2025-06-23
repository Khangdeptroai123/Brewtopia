const PayOS = require("@payos/node");
const { clientId, apiKey, checksumKey } = require("../config/payos");
const { appId, key1, key2, endpoint } = require("../config/zalopay");
const Payment = require("../models/Payment");
const User = require("../models/User");
const payos = new PayOS(clientId, apiKey, checksumKey);

// 🏡 Tạo quán cafe mới

const createPayOsLink = async (orderData) => {
  const { userId, amount, targetModel } = orderData;

  const orderCodeGene = Math.floor(Date.now() / 10000);
  const description = `Order ID ${orderCodeGene}`;

  const payment = new Payment({
    user: userId,
    amount,
    orderCode: orderCodeGene,
    description,
    targetModel, // <- quan trọng!
  });

  const paymentData = {
    amount,
    orderCode: orderCodeGene,
    description: description,
    returnUrl: process.env.PAYOS_WEBHOOK_URL,
    cancelUrl: process.env.PAYOS_WEBHOOK_URL,
  };

  const paymentLink = await payos.createPaymentLink(paymentData);
  payment.paymentLinkId = paymentLink.paymentLinkId;
  await payment.save();
  return paymentLink;
};
const upgradeHandlers = {
  UpgradePremium: async (userId) => {
    await User.findByIdAndUpdate(userId, { AccStatus: "Premium" });
  },
  UpgradeVIP: async (userId) => {
    await User.findByIdAndUpdate(userId, { AccStatus: "VIP" });
  },
  PointPurchase: async (userId, payment) => {
    await User.findByIdAndUpdate(userId, { $inc: { points: payment.amount } });
  },
  // ...add more as you wish
};
const confirmWebhook = async (webhookUrl) => {
  return await payos.confirmWebhook(webhookUrl);
};
const handlePayOSWebhook = async (webhookData) => {
  const { orderCode, status } = webhookData;
  const payment = await Payment.findOne({ orderCode });
  if (!payment) throw new Error("Payment not found");

  payment.status = status === "PAID" ? "PAID" : "CANCELLED";
  await payment.save();

  if (payment.status === "PAID") {
    // Tìm handler tương ứng
    const handler = upgradeHandlers[payment.targetModel];
    if (handler) {
      await handler(payment.user, payment); // truyền userId, payment object
    }
  }

  return payment;
};
const getPayOsInfo = async (orderCode) => {
  const payment = await Payment.findOne({ orderCode });
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};

//====================Zalo Pay==========================================

const createZaloPay = async (orderData) => {
  const { userId, amount } = orderData;

  const orderCodeGene = Math.floor(Date.now() / 10000);
  const description = `Order ID ${orderCodeGene}`;
  const appTransId = `${orderCodeGene}-zalopay`;

  const payment = new Payment({
    user: userId,
    amount,
    orderCode: orderCodeGene,
    Provider: "ZaloPay",
    description: description,
    currency: "VND",
  });

  const embedData = {
    redirecturl:
      process.env.PAYOS_WEBHOOK_URL ||
      "https://d3af-183-80-94-157.ngrok-free.app/api/payments/webhook/ZaloPay",
  };

  const items = []; // Bạn có thể thêm thông tin sản phẩm nếu cần
  const transId = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: appId,
    app_trans_id: appTransId,
    app_user: userId.toString(),
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embedData),
    amount: amount,
    description: description,
    bank_code: "", // Có thể để trống hoặc chỉ định ngân hàng
    callback_url:
      process.env.PAYOS_WEBHOOK_URL ||
      "https://d3af-183-80-94-157.ngrok-free.app/api/payments/webhook/ZaloPay",
  };

  // Create signature
  const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
  order.mac = crypto.createHmac("sha256", key1).update(data).digest("hex");
  try {
    const response = await axios.post(endpoint, order);
    payment.paymentLinkId = response.data.order_url;
    await payment.save();
    return response.data;
  } catch (error) {
    throw new Error("Failed to create ZaloPay payment link: " + error.message);
  }
};

const handleZaloWebhook = async (webhookData) => {
  if (!webhookData.data || !webhookData.mac) {
    throw new Error("Invalid ZaloPay webhook data");
  }

  const { data, mac } = webhookData;
  const parsedData = JSON.parse(data);
  const { app_trans_id, status } = parsedData;

  // Xác thực chữ ký webhook của ZaloPay
  const computedMac = crypto
    .createHmac("sha256", key2)
    .update(data)
    .digest("hex");
  if (computedMac !== mac) {
    throw new Error("Invalid ZaloPay webhook signature");
  }

  const orderCode = app_trans_id.split("-")[0]; // Lấy orderCode từ appTransId
  const payment = await Payment.findOne({ orderCode: orderCode });
  if (!payment) {
    throw new Error("Payment not found");
  }

  // Cập nhật trạng thái
  payment.status = status === 1 ? "PAID" : "CANCELLED"; // status 1 là thành công trong ZaloPay
  await payment.save();
  return payment;
};
const getZaloPayInfo = async (orderCode) => {
  const payment = await Payment.findOne({ orderCode });
  if (!payment) {
    throw new Error("Payment not found");
  }
  return payment;
};

module.exports = {
  // confirmWebhook,
  createPayOsLink,
  handlePayOSWebhook,
  getPayOsInfo,
  createZaloPay,
  handleZaloWebhook,
  getZaloPayInfo,
};
