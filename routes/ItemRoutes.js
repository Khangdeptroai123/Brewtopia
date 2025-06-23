const express = require("express");
const router = express.Router();

const {
  addItem,
  updateItem,
  deleteItem,
  getItems,
} = require("../controllers/itemController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { uploadFields } = require("../middlewares/upload");

router.get("/:menuId", getItems);
// Thêm món Item
router.post(
  "/create-Item/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  uploadFields("itemMenu-images", [{ name: "image", maxCount: 1 }]),
  addItem
);

// Cập nhật Item
router.put("/:id", authenticateUser, authorizeRoles(["admin"]), updateItem);

// Xoá Item
router.delete("/:id", authenticateUser, authorizeRoles(["admin"]), deleteItem);

module.exports = router;
