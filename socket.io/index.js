const { Server } = require("socket.io");
const ChatCallHandler = require("./handlers/ChatCallHandler");
const likeHandler = require("./handlers/likeHandler");
const shareHandler = require("./handlers/shareHandler");
const chatHandler = require("./handlers/chatHandler");
const commentHandler = require("./handlers/commentHandler");
const followEventHandler = require("./handlers/followEventHandler");
const videoHandler = require("./handlers/videoHandler");
const corsOptions = require("../middlewares/corsOptions");

module.exports = (server) => {
  const io = new Server(server, {
    cors: corsOptions,
  });

  // 🔌 Khi có client kết nối
  io.on("connection", (socket) => {
    console.log("🔗 Client connected:", socket.id);

    followEventHandler(socket, io);
    ChatCallHandler(socket, io);
    chatHandler(socket, io);
    commentHandler(socket, io);
    likeHandler(socket, io);
    shareHandler(socket, io);
    videoHandler(socket, io);

    socket.on("disconnect", () => {
      console.log("🔌 Client disconnected:", socket.id);
    });
  });

  return io;
};
