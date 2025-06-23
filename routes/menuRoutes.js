const express = require("express");
const router = express.Router();
const { getMenu, deleteMenu } = require("../controllers/menuController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get("/:cafeId", getMenu);
// Xoá Menu
router.delete("/:id", authenticateUser, authorizeRoles(["admin"]), deleteMenu);

module.exports = router;
