const User = require("../models/User");
const Review = require("../models/Review");
const Cafe = require("../models/Cafe");
const Menu = require("../models/Menu");
const Event = require("../models/Event");

// 🏡 Tạo quán cafe mới
const createCafe = async (data) => {
  const cafe = await Cafe.create(data);
  // const user = await User.findById(data.user);
  const menu = await Menu.create({ cafe: cafe._id });
  cafe.menu.push(menu._id);
  await cafe.save();

  return cafe;
};
const getAllCafes = async () => {
  return await Cafe.find();
};
const getCafeByIdUser = async (id) => {
  return await Cafe.find({ owner: id });
};

const updateCafe = async (id, data) => {
  data.status = "success";
  return await Cafe.findByIdAndUpdate(id, data, {
    new: true,
  });
};

// 🗑️ Xóa quán cafe
const deleteCafe = async (id) => {
  return await Cafe.findByIdAndDelete(id);
};

// 🔎 Tìm quán cafe gần vị trí người dùng
// const getCafesNearby = async (longitude, latitude, maxDistance = 5000) => {
//   if (!longitude || !latitude) {
//     throw new Error("Thiếu tọa độ (longitude và latitude)!");
//   }
//   const lng = parseFloat(longitude);
//   const lat = parseFloat(latitude);
//   if (isNaN(lng) || isNaN(lat)) {
//     throw new Error("Tọa độ phải là số hợp lệ");
//   }
//   if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
//     throw new Error(
//       "Tọa độ không hợp lệ: lng phải trong [-180, 180] và lat trong [-90, 90]"
//     );
//   }

//   try {
//     const cafes = await Cafe.find({
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [lng, lat] },
//           $maxDistance: parseInt(maxDistance),
//         },
//       },
//     });
//     return cafes;
//   } catch (err) {
//     throw new Error("Lỗi khi tìm quán cafe gần vị trí của bạn: " + err.message);
//   }
// };
const updateCafeRating = async (cafeId) => {
  try {
    // Lấy tất cả review của quán
    const reviews = await Review.find({ cafe: cafeId }).populate("user");

    // Lọc chỉ những review từ user thường
    const validReviews = reviews.filter(
      (review) => review.user && review.user.role === "user"
    );

    const reviewCount = validReviews.length;
    const totalRating = validReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = reviewCount ? totalRating / reviewCount : 0;
    console.log(averageRating);

    // Cập nhật vào Cafe
    await Cafe.findByIdAndUpdate(cafeId, {
      rating: Number(averageRating.toFixed(1)),
      reviewCount,
      reviews: validReviews.map((r) => r._id),
    });
    // console.log("Valid Reviews:", validReviews);
    // console.log("Avg Rating:", averageRating);
  } catch (err) {
    console.error("Lỗi khi cập nhật rating:", err);
    throw new Error("Lỗi khi cập nhật rating: " + err.message);
  }
};
// const getCafeMenu = async (cafeId) => {
//   try {
//     const cafe = await Cafe.findById(cafeId).populate("menu");
//     if (!cafe) return null;
//     return cafe.menu;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

module.exports = {
  createCafe,
  getAllCafes,
  getCafeByIdUser,
  updateCafe,
  deleteCafe,
  // getCafesNearby,
  updateCafeRating,
  // getCafeMenu,
};
