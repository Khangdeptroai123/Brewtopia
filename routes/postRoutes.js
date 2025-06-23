const express = require("express");
const {
  createPostSocial,
  getPointBonus,
  getPosts,
  getPostsByIds,
} = require("../controllers/postController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { uploadArray, handleMulterError } = require("../middlewares/upload");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  uploadArray("posts", "images", 3),
  handleMulterError,
  createPostSocial
);
// router.get("/", authenticateUser, getPosts);
router.get("/", authenticateUser, getPostsByIds);
router.get("/allPost", authenticateUser, getPosts);
router.get("/points", authenticateUser, getPointBonus);

module.exports = router;
