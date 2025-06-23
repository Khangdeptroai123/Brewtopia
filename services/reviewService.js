const Cafe = require("../models/Cafe");
const Review = require("../models/Review");
const User = require("../models/User");
const { updateCafeRating } = require("./cafeService");

const createReview = async (reviewData, userId) => {
  const user = userId;
  const { cafe, content, rating, image } = reviewData;

  // Kiểm tra thông tin bắt buộc
  if (!cafe || !content || rating == null) {
    throw new Error(
      "Thiếu thông tin: cafe, nội dung review và rating không được để trống"
    );
  }

  // Kiểm tra quán cafe có tồn tại không
  const cafeExists = await Cafe.findById(cafe);
  if (!cafeExists) {
    throw new Error("Quán cafe không tồn tại");
  }

  try {
    // Tạo review mới
    const newReview = await Review.create({
      cafe,
      content,
      rating,
      images: image,
      user, // ID của người dùng đã có từ JWT
    });

    // Cập nhật quán cafe: thêm review và cập nhật điểm rating
    await Cafe.findByIdAndUpdate(cafe, {
      $push: { reviews: newReview._id },
    });

    // Cập nhật lại điểm đánh giá trung bình
    await updateCafeRating(cafe);

    return newReview;
  } catch (err) {
    throw new Error("Lỗi khi tạo review: " + err.message);
  }
};

// Lấy review theo ID
const getReviewById = async (id) => {
  if (!id) throw new Error("ID review không được để trống");
  try {
    const review = await Review.findById(id).populate("user cafe");
    if (!review) throw new Error("Không tìm thấy review với ID: " + id);
    return review;
  } catch (err) {
    throw new Error("Lỗi khi lấy review: " + err.message);
  }
};

// Lấy danh sách tất cả review
const getAllReviews = async () => {
  // if (!cafeId) {
  //   throw new Error("Cafe ID is required");
  // }

  const reviews = await Review.find();
  return reviews;
};

// Cập nhật review
const updateReview = async (id, updateData) => {
  if (!id) throw new Error("ID review không được để trống");
  try {
    // Lấy review cũ để biết cafeId
    const oldReview = await Review.findById({ _id: id });
    const updatedReview = await Review.findByIdAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) throw new Error("Không tìm thấy review với ID: " + id);

    // Nếu rating thay đổi hoặc luôn muốn update lại
    if (oldReview.rating !== updateData.rating) {
      await updateCafeRating(oldReview.cafe);
    }

    return updatedReview;
  } catch (err) {
    throw new Error("Lỗi khi cập nhật review: " + err.message);
  }
};

// Xóa review
const deleteReview = async (id) => {
  if (!id) throw new Error("ID review không được để trống");
  try {
    // Tìm review cần xóa
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview)
      throw new Error("Không tìm thấy review để xóa với ID: " + id);

    // Kiểm tra quán cafe có tồn tại không
    const cafe = await Cafe.findById(deletedReview.cafe);
    if (cafe) {
      // Đảm bảo reviewCount không bị giảm xuống dưới 0
      const newReviewCount = Math.max(0, cafe.reviewCount - 1);

      // Cập nhật lại reviewCount
      await Cafe.findByIdAndUpdate(deletedReview.cafe, {
        reviewCount: newReviewCount,
      });

      // Cập nhật lại rating trung bình
      await updateCafeRating(deletedReview.cafe);
    }

    return deletedReview;
  } catch (err) {
    throw new Error("Lỗi khi xóa review: " + err.message);
  }
};

// Lấy danh sách review cho một quán cafe
const getReviewsByCafe = async (cafeId) => {
  if (!cafeId) throw new Error("ID quán cafe không được để trống");
  try {
    const reviews = await Review.find({ cafe: cafeId });
    return reviews;
  } catch (error) {
    throw new Error("Lỗi khi lấy review của quán cafe: " + error.message);
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
