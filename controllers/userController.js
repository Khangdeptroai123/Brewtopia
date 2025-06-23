const userService = require("../services/userService");

// Controller: Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Controller: Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Controller: Lấy trạng thái người dùng
const getUserStatus = async (req, res) => {
  try {
    const status = await userService.getUserStatus(req.params.id);
    if (!status)
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Controller: Cập nhật thông tin người dùng
const updateProfileUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser)
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Controller: Xóa người dùng theo ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserStatus, // Thêm endpoint mới
  updateProfileUser,
  deleteUser,
};
