const express = require("express");
const {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewById,
  updateReview,
  getReviewsByCafe,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { uploadFields } = require("../middlewares/upload");

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post(
  "/",
  authenticateUser,
  uploadFields("reviews-images", [{ name: "images", maxCount: 2 }]),
  createReview
);
router.put(
  "/:id",
  authenticateUser,
  uploadFields("reviews-images", [{ name: "images", maxCount: 2 }]),
  updateReview
);
router.delete("/:id", authenticateUser, deleteReview);
router.post("/cafe/:cafeId", getReviewsByCafe);

module.exports = router;
