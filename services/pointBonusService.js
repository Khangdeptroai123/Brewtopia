const PointBonus = require("../models/PointBonus");
const User = require("../models/User");

const handleDailyBonus = async (userId) => {
  const latest = await PointBonus.findOne({ user: userId, type: "daily" }).sort(
    { createdAt: -1 }
  );
  const now = new Date();

  if (latest && now - latest.createdAt < 24 * 60 * 60 * 1000) {
    throw new Error("Bạn đã nhận điểm daily trong vòng 24 giờ.");
  }

  return await PointBonus.create({
    user: userId,
    points: 10,
    type: "daily",
    note: "Điểm danh hằng ngày",
  });
};
const handleEventBonus = async (userId, note = "") => {
  return await PointBonus.create({
    user: userId,
    points: 50,
    type: "event",
    note: note || "Tham gia sự kiện",
  });
};

const handleReferralBonus = async (userId, note = "") => {
  return await PointBonus.create({
    user: userId,
    points: 30,
    type: "referral",
    note: note || "Mời bạn bè",
  });
};

const handleAdminBonus = async (userId, note = "") => {
  return await PointBonus.create({
    user: userId,
    points: 100,
    type: "admin",
    note: note || "Tặng điểm từ admin",
  });
};

const handleTaskBonus = async (userId, note = "") => {
  return await PointBonus.create({
    user: userId,
    points: 20,
    type: "task",
    note: note || "Hoàn thành nhiệm vụ",
  });
};

// ✅ Object Dispatcher
const bonusHandlers = {
  daily: handleDailyBonus,
  event: handleEventBonus,
  referral: handleReferralBonus,
  admin: handleAdminBonus,
  task: handleTaskBonus,
};

const createBonus = async ({ userId, type, note }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const handler = bonusHandlers[type];
  if (!handler) throw new Error("Invalid bonus type");

  return await handler(userId, note);
};

// 📥 Lấy danh sách thưởng
const getBonus = async (userId) => {
  return await PointBonus.find({ user: userId, status: "active" }).sort({
    createdAt: -1,
  });
};
module.exports = {
  createBonus,
  getBonus,
};
