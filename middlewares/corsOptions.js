const allowedOrigins = [
  "https://brewtopia-lp-git-test-nguyenminhkhoise172625s-projects.vercel.app",
  "https://brewtopia-production.up.railway.app",
  "http://localhost:5173",
  "http://localhost:4000",
];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
