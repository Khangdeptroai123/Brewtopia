// models/Menu.js
const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    cafe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: true,
      index: true,
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
    itemCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

// Middleware để cập nhật itemCount
MenuSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    if (update.$push && update.$push.items) {
      this.set({ $inc: { itemCount: 1 } });
    } else if (update.$pull && update.$pull.items) {
      this.set({ $inc: { itemCount: -1 } });
    } else if (update.$set && update.$set.items) {
      this.set({ itemCount: update.$set.items.length });
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware để kiểm tra và sửa itemCount sau khi cập nhật
MenuSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    const updatedMenu = await this.model.findById(doc._id);
    if (updatedMenu.items.length !== updatedMenu.itemCount) {
      updatedMenu.itemCount = updatedMenu.items.length;
      await updatedMenu.save();
    }
  }
});

const Menu = mongoose.model("Menu", MenuSchema);
module.exports = Menu;
