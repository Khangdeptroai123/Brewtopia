require("dotenv").config();
module.exports = {
  appId: process.env.ZALOPAY_APP_ID || "your_partner_code",
  key1: process.env.ZALOPAY_KEY1 || "your_access_key",
  key2: process.env.ZALOPAY_KEY2 || "your_secret_key",
  endpoint:
    process.env.MOMO_ENDPOINT ||
    "https://d3af-183-80-94-157.ngrok-free.app/api/payments/createZaloPay",
};
