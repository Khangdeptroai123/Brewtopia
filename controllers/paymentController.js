const { log } = require("winston");
const payment = require("../models/Payment");
const {
  createPayOsLink,
  handlePayOSWebhook,
  getPayOsInfo,
  createZaloPay,
  handleZaloWebhook,
  getZaloPayInfo,
} = require("../services/paymentService");
const paginate = require("../utils/paginate");

const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { results, total, totalPages } = await paginate(
      payment,
      {},
      page,
      limit
    );
    res.status(200).json({
      message: "Lấy danh sách giao dịch thành công",
      data: results,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getHisPayments = async (req, res) => {
  try {
    const paymentLink = await payment.find({ user: req.user.id });
    res.status(200).json({
      message: "PayOs link created successfully",
      data: paymentLink,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const findOrderCode = async (req, res) => {
  try {
    const { code } = req.params;
    const paymentLink = await payment.find({ orderCode: code });
    res.status(200).json({
      message: "PayOs link created successfully",
      data: paymentLink,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createPayos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, targetModel } = req.body;

    if (!amount || !targetModel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const paymentLink = await createPayOsLink({
      userId,
      amount,
      targetModel,
    });

    res.status(200).json({
      message: "PayOs link created successfully",
      data: paymentLink,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const handlePayOshook = async (req, res) => {
  try {
    const webhookData = req.query;
    const payment = await handlePayOSWebhook(webhookData);
    res.status(200).json({
      message: "Webhook processed successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPaymentInfo = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const payment = await getPayOsInfo(orderCode);
    res.status(200).json({
      message: "Payment info retrieved successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//================================ZALO PAY================================
// ZaloPay Controllers
const createZaloPayPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const paymentLink = await createZaloPay({
      userId,
      amount,
    });
    res.status(200).json({
      message: "ZaloPay link created successfully",
      data: paymentLink,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleZaloPayWebhook = async (req, res) => {
  try {
    const webhookData = req.body; // ZaloPay sends webhook data in body
    const payment = await handleZaloWebhook(webhookData);
    res.status(200).json({
      message: "ZaloPay webhook processed successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getZaloPayPaymentInfo = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const payment = await getZaloPayInfo(orderCode);
    res.status(200).json({
      message: "ZaloPay payment info retrieved successfully",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayos,
  handlePayOshook,
  getPaymentInfo,
  getHisPayments,
  findOrderCode,
  createZaloPayPayment,
  handleZaloPayWebhook,
  getZaloPayPaymentInfo,
  getAllPayments,
};
