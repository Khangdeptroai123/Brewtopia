const allowedOrigins = [
  "https://brewtopia-production.up.railway.app",
  "https://brewtopia-lp-git-test-nguyenminhkhoise172625s-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:4000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép không có origin (Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Cho phép gửi cookie/session
};

module.exports = { corsOptions, allowedOrigins };
