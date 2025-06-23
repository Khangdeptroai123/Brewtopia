const { generateToken } = require("../services/agoraService");

const getToken = (req, res) => {
  const { channelName, uid = 0, role = "publisher" } = req.body;
  if (!channelName) {
    return res.status(400).json({ error: "channelName is required" });
  }
  try {
    const token = generateToken(channelName, uid, role);
    return res.json({ appId: process.env.AGORA_APP_ID, token, uid });
  } catch (err) {
    console.error("Agora token generation error:", err);
    return res.status(500).json({ error: "Token generation failed" });
  }
};
module.exports = { getToken };
