const { getMenuItem, deleteMenuItem } = require("../services/MenuService");

const getMenu = async (req, res) => {
  try {
    const { cafeId } = req.params;
    const menu = await getMenuItem(cafeId);
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { itemId } = req.params; // Đổi từ Menuid thành itemId
    const deletedItem = await deleteMenuItem(itemId);
    res.status(200).json(deletedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMenu, deleteMenu };
