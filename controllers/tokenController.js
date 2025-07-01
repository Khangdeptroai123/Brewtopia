const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const { appId, appCertificate, tokenExpireTime } = require("../config/agora");

const generateToken = (req, res) => {
  const { channelName, uid = 0, role = "publisher" } = req.body;

  if (!channelName)
    return res.status(400).json({ error: "channelName is required" });

  const privilegeExpireTime = Math.floor(Date.now() / 1000) + tokenExpireTime;
  const userRole =
    role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    userRole,
    privilegeExpireTime
  );

  return res.json({ token });
};

module.exports = { generateToken };
