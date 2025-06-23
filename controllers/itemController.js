const {
  additem,
  updateitem,
  deleteitem,
  getItem,
} = require("../services/ItemService");

const getItems = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await getItem(menuId);
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const MenuId = req.params.id;
    const data = req.body;
    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      data.image = imageFile.path;
    }
    const newItemItem = await additem(MenuId, data);
    console.log("đã thêm 1 món thành công");
    res.status(201).json(newItemItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedItemItem = await updateitem(itemId, req.body);
    res.status(200).json(updatedItemItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItemItem = await deleteitem(itemId);
    res
      .status(200)
      .json({ message: "đã xóa 1 món thành công" }, deletedItemItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addItem,
  updateItem,
  deleteItem,
  getItems,
};
