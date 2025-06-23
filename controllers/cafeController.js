const cafeService = require("../services/cafeService");

const createCafe = async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user.id };
    const cafe = await cafeService.createCafe(data);

    // Optional: populate menu luôn nếu bạn muốn
    const populatedCafe = await cafe.populate("menu");
    console.log("đã tạo quán cafe");

    res.status(201).json({
      message: "Cafe created successfully with default menu",
      cafe: populatedCafe,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  const business = await businessService.createBusiness(body, user.id, files);

const getCafes = async (req, res) => {
  try {
    const cafes = await cafeService.getAllCafes();
    res.status(200).json(cafes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCafeById = async (req, res) => {
  try {
    const cafe = await cafeService.getCafeByIdUser(req.params.id);
    res.status(200).json(cafe);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const updateCafe = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      data.image = imageFile.path;
    }
    if (req.files && req.files["citizenIdImage"]) {
      const citizenIdFile = req.files["citizenIdImage"][0];
      data.identification = {
        ...data.identification,
        citizenIdImage: citizenIdFile.path, // Lưu link URL ảnh từ Cloudinary
      };
    }

    const cafe = await cafeService.updateCafe(req.params.id, data);
    if (!cafe) {
      return res.status(404).json({ error: "Cafe not found" });
    }
    res.json({ message: "Cafe updated successfully", cafe });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCafe = async (req, res) => {
  try {
    const cafe = await cafeService.deleteCafe(req.params.id);
    res.status(200).json({ message: "Đã xóa quán cafe", cafe });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// const getCafesNearby = async (req, res) => {
//   try {
//     const { longitude, latitude, maxDistance } = req.query;
//     const cafes = await cafeService.getCafesNearby(
//       longitude,
//       latitude,
//       maxDistance
//     );
//     res.status(200).json(cafes);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// const getCafeMenu = async (req, res) => {
//   try {
//     const { cafeId } = req.params;

//     const menu = await cafeService.getCafeMenu(cafeId);
//     if (!menu) {
//       return res.status(404).json({ message: "Quán cafe không tồn tại" });
//     }

//     res.status(200).json({ menu });
//   } catch (error) {
//     res.status(500).json({ message: "Lỗi server", error: error.message });
//   }
// };

module.exports = {
  createCafe,
  getCafes,
  getCafeById,
  updateCafe,
  deleteCafe,
  // getCafesNearby,
  // getCafeMenu,
};
