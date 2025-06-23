const reviewService = require("../services/reviewService");
// Tạo review mới
const createReview = async (req, res) => {
  try {
    const user = req.user.id;
    const data = req.body;
    if (req.files && req.files["images"]) {
      const imageFile = req.files["images"][0];
      data.image = imageFile.path;
    }
    const review = await reviewService.createReview(data, user);

    res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy review theo ID
const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    res.status(200).json(review);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Lấy danh sách tất cả review
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật review
const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    res.status(200).json({ message: "Review được cập nhật", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa review
const deleteReview = async (req, res) => {
  try {
    const review = await reviewService.deleteReview(req.params.id);
    res.status(200).json({ message: "Đã xóa bài review", review });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Lấy review cho một quán cafe
const getReviewsByCafe = async (req, res) => {
  try {
    const { cafeId } = req.params;
    const reviews = await reviewService.getReviewsByCafe(cafeId);
    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có review nào cho quán này" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReview,
  getReviewById,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewsByCafe,
};
