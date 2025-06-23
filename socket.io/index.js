const { Server } = require("socket.io");
const likeHandler = require("./handlers/likeHandler");
const shareHandler = require("./handlers/shareHandler");
const chatHandler = require("./handlers/chatHandler");
const activeLiveHandler = require("./handlers/activeLiveHandler");
const commentHandler = require("./handlers/commentHandler");
const followEventHandler = require("./handlers/followEventHandler");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      // origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 🔌 Khi có client kết nối
  io.on("connection", (socket) => {
    console.log("🔗 Client connected:", socket.id);
    activeLiveHandler(socket, io);
    followEventHandler(socket, io);
    chatHandler(socket, io);
    commentHandler(socket, io);
    likeHandler(socket, io);
    shareHandler(socket, io);

    socket.on("disconnect", () => {
      console.log("🔌 Client disconnected:", socket.id);
    });
  });

  return io; // Trả về io để sử dụng tiếp trong app
};
