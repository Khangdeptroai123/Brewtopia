// services/userService.js
const User = require("../models/User");

//Lấy danh sách tất cả người dùng (loại trừ trường password)
const getUsers = async () => {
  return await User.find().select("-password");
};

// Lấy thông tin người dùng theo ID (loại trừ trường password)
const getUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const getUserStatus = async (id) => {
  const user = await User.findById(id).select("isActive lastActive");
  if (!user) return null;
  return {
    isActive: user.isActive,
    lastActive: user.lastActive,
  };
};

// Lưu ý: Nếu cập nhật password, cần xử lý mã hóa trước khi lưu
const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true }).select(
    "-password"
  );
};

// Xóa người dùng theo ID
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getUsers,
  getUserById,
  getUserStatus,
  updateUser,
  deleteUser,
};
