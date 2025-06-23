// services/MenuService.js
const MenuItem = require("../models/Item");
const Menu = require("../models/Menu");

const getMenuItem = async (cafeId) => {
  if (!cafeId) throw new Error("ID quán cafe không được để trống");
  const menu = await Menu.find({ cafe: cafeId }).populate("items");
  return menu;
};

const deleteMenuItem = async (itemId) => {
  if (!itemId) throw new Error("ID món không được để trống");

  const deletedItem = await MenuItem.findByIdAndDelete(itemId);
  if (!deletedItem) throw new Error("Không tìm thấy món ăn để xóa");

  // Middleware trong MenuItem sẽ tự động cập nhật Menu.items và itemCount
  return deletedItem;
};

module.exports = {
  getMenuItem,
  deleteMenuItem,
};
