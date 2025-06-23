const express = require("express");
const {
  createCafe,
  getCafes,
  getCafeById,
  updateCafe,
  deleteCafe,
} = require("../controllers/cafeController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { uploadFields } = require("../middlewares/upload"); // Import uploadFields

const router = express.Router();

router.get("/:id", getCafeById);
router.get("/", getCafes);
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  uploadFields("cafe-images", [
    { name: "image", maxCount: 1 }, // Hình chính
    { name: "citizenIdImage", maxCount: 1 }, // Hình CMND/CCCD
  ]),
  createCafe
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  uploadFields("cafe-images", [
    { name: "image", maxCount: 1 },
    { name: "citizenIdImage", maxCount: 1 },
  ]),
  updateCafe
);
router.delete("/:id", authenticateUser, authorizeRoles(["admin"]), deleteCafe);

module.exports = router;
