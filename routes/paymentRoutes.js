const express = require("express");
const router = express.Router();
const {
  createPayos,
  handlePayOshook,
  getPaymentInfo,
  createZaloPayPayment,
  getZaloPayPaymentInfo,
  handleZaloPayWebhook,
  getAllPayments,
  getHisPayments,
  findOrderCode,
} = require("../controllers/paymentController");
const { authenticateUser } = require("../middlewares/authMiddleware");

router.get("/", getAllPayments);
router.post("/hisPayments", authenticateUser, getHisPayments);
router.get("/findOrderCode/:code", authenticateUser, findOrderCode);
router.post("/createPayos", authenticateUser, createPayos);
router.get("/webhook/PayOs", handlePayOshook);
router.get("/:orderCode", authenticateUser, getPaymentInfo);
//==========================================================
router.post("/createZaloPay", authenticateUser, createZaloPayPayment);
router.get("/webhook/ZaloPay", handleZaloPayWebhook);
router.get("/:orderCode", authenticateUser, getZaloPayPaymentInfo);

module.exports = router;
