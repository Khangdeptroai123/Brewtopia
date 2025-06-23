const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const socketHandlers = require("./socket.io/index");
const session = require("express-session");
require("./config/passport");
const passport = require("passport");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    // origin: "*",
    credentials: true, // Allow credentials
  })
);
const path = require("path");
// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const io = socketHandlers(server);
app.set("socketio", io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Cấu hình session
app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// // Import Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cafes", require("./routes/cafeRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/likes", require("./routes/likeRoutes"));
app.use("/api/shares", require("./routes/shareRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/menus", require("./routes/menuRoutes"));
app.use("/api/menu-items", require("./routes/itemRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/orderMeetingRooms", require("./routes/Orders/MeetingRoomRoutes"));
app.use("/api/point-Bonus", require("./routes/pointBonusRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/agora", require("./routes/agoraRoutes"));
app.use("/api/streams", require("./routes/streamRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // hoặc đổi thành tên file bạn đặt
});
// app.use("/api/aiChat", require("./routes/aiChatRoutes"));

// Khởi động Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
