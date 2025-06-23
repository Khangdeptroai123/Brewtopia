const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");
// const winston = require("winston");

// const logger = winston.createLogger({
//   level: process.env.NODE_ENV === "production" ? "info" : "debug",
//   transports: [new winston.transports.Console()],
// });

const getStorage = (folder) => {
  // const startTime = Date.now();
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folder || "itemMenu-images",
      format: async (req, file) => "webp",
      public_id: (req, file) => `${uuidv4()}`,
      transformation: [
        { width: 800, height: 800, crop: "limit", quality: "auto" },
      ],
    },
  });
  // const uploadTime = Date.now() - startTime;
  // logger.debug(
  //   `Initialized Cloudinary storage and upload took ${uploadTime}ms`
  // );
  return storage;
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Chỉ chấp nhận file ảnh JPG, PNG, WEBP!");
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const uploadArray = (folder, fieldName, maxCount) => {
  const upload = multer({
    storage: getStorage(folder),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
  }).array(fieldName, maxCount);
  return upload;
};

const uploadFields = (folder, fields) => {
  const upload = multer({
    storage: getStorage(folder),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
  }).fields(fields);
  return upload;
};

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File ảnh vượt quá kích thước cho phép (2MB)!" });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Vượt quá số lượng file cho phép!" });
    }
    // logger.error(`MulterError: ${err.message}`);
    return res.status(400).json({ message: `Lỗi upload: ${err.message}` });
  }
  if (err.status) {
    // logger.error(`Custom Error: ${err.message}`);
    return res.status(err.status).json({ message: err.message });
  }
  // logger.error(`Unhandled Error: ${err.message}`);
  return res.status(500).json({ message: "Lỗi server không xác định!" });
};

module.exports = {
  uploadArray,
  uploadFields,
  handleMulterError,
};
