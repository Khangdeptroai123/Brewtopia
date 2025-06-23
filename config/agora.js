require("dotenv").config();

module.exports = {
  appId: process.env.AGORA_APP_ID,
  appCertificate: process.env.AGORA_APP_CERTIFICATE,
  tokenExpiry: 3600, // 1 giờ
};
