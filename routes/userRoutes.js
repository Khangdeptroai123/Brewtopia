const express = require("express");
const {
  getUsers,
  getUserById,
  updateProfileUser,
  deleteUser,
  getUserStatus,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/status", getUserStatus);
router.put("/:id", updateProfileUser);
router.delete("/:id", deleteUser);

module.exports = router;
