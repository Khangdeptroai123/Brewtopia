const allowedOrigins = [
  "https://brewtopia-lp-git-test-nguyenminhkhoise172625s-projects.vercel.app",
  "https://brewtopia-production.up.railway.app",
  "http://localhost:5173",
  "http://localhost:4000",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🟡 CORS Origin:", origin); // Log để debug

    // Cho phép nếu origin hợp lệ hoặc undefined (WebSocket không gửi origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🔴 Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // BẮT BUỘC nếu dùng cookie, session, passport
};

module.exports = corsOptions;
