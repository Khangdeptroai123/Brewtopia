const Item = require("../models/Item");
const Menu = require("../models/Menu");

const getItem = async (menuId) => {
  if (!menuId) throw new Error("ID menu không được để trống");
  const item = await Item.find({ menuId: menuId });
  return item;
};
const additem = async (menuId, itemData) => {
  if (
    !menuId ||
    !itemData.name ||
    !itemData.price ||
    !itemData.category ||
    !itemData.image
  ) {
    throw new Error(
      "Thiếu thông tin: menuId, tên món, giá, danh mục và ảnh không được để trống"
    );
  }

  const newItemData = {
    menuId,
    name: itemData.name,
    price: Number(itemData.price),
    category: itemData.category,
    image: itemData.image,
    bestSeller: itemData.bestSeller || false,
  };

  const newItem = await Item.create(newItemData);
  await Menu.findByIdAndUpdate(
    menuId,
    {
      $push: { items: newItem._id },
      $inc: { itemCount: 1 },
    },
    { new: true }
  );

  return newItem;
};

const updateitem = async (itemId, updateData) => {
  if (!itemId) throw new Error("ID món không được để trống");
  const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedItem) throw new Error("Không tìm thấy món ăn để cập nhật");
  return updatedItem;
};

const deleteitem = async (itemId) => {
  console.log(itemId);

  if (!itemId) throw new Error("ID món không được để trống");
  const deletedItem = await Item.findByIdAndDelete(itemId);
  if (!deletedItem) throw new Error("Không tìm thấy món ăn để xóa");
  return deletedItem;
};

module.exports = {
  additem,
  updateitem,
  deleteitem,
  getItem,
};
