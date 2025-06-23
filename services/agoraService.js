const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const { appId, appCertificate, tokenExpiry } = require("../config/agora");

const generateToken = (channelName, uid = 0, role = "publisher") => {
  const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const currentTs = Math.floor(Date.now() / 1000);
  const expireTs = currentTs + tokenExpiry;

  return RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    rtcRole,
    expireTs
  );
};
module.exports = { generateToken };
