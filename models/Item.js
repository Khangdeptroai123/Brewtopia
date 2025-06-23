// models/MenuItem.js
const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    category: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: null },
    bestSeller: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// Đảm bảo index cho menuId
MenuItemSchema.index({ menuId: 1 });

// Middleware để xóa MenuItem khỏi Menu.items và cập nhật itemCount
MenuItemSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Menu.findByIdAndUpdate(this.menuId, {
        $pull: { items: this._id },
        $inc: { itemCount: -1 },
      });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Item = mongoose.model("MenuItem", MenuItemSchema);
module.exports = Item;
