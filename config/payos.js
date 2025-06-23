require("dotenv").config();

module.exports = {
  clientId: process.env.PAYOS_SANDBOX_CLIENT_ID,
  apiKey: process.env.PAYOS_SANDBOX_API_KEY,
  checksumKey: process.env.PAYOS_SANDBOX_CHECKSUM_KEY,
};
