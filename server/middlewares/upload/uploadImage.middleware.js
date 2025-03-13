const multer = require("multer");
const storagePhotos = multer.diskStorage({
  destination: "./uploads/images/",
  filename: (req, file, cb) => {
    let filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    } else if (file.mimetype === "image/png") {
      filetype = "png";
    } else if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    } else if (file.mimetype === "image/webp") {
      filetype = "webp";
    } else {
      cb(new Error("Định dạng hình ảnh chưa hỗ trợ"));
    }
    if (file.size > 1024 * 1024) {
      cb(new Error("Lỗi hình ảnh > 1MB"));
    }
    const currentDay = Date.now() + "_";
    cb(null, currentDay + file.originalname.split(".")[0] + "." + filetype);
  },
});

const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// MAX 1MB (SIZE 1024 * 1024 => 1KB)
const uploadPhoto = multer({
  storage: storagePhotos,
  limits: { fileSize: 1024 * 1024 },
  fileFilter,
});

const uploadImageMidleware = (req, res, next) => {
  uploadPhoto.single("photo")(req, res, (err) => {
    // Kiểm tra lỗi do file quá lớn
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        status: false,
        text: "Kích thước hình ảnh quá lớn (tối đa 1MB)",
      });
    }

    // Kiểm tra lỗi do sai định dạng file
    if (req.fileValidationError) {
      return res.status(400).send({
        status: false,
        text: "Định dạng hình ảnh chưa được hỗ trợ",
      });
    }

    // Kiểm tra nếu không có file
    if (!req.file) {
      return res.status(400).send({
        status: false,
        text: "Vui lòng chọn một hình ảnh hợp lệ",
      });
    }
    // Nếu không có lỗi, tiếp tục xử lý request
    next();
  });
};

module.exports = {
  uploadPhoto,
  uploadImageMidleware,
};
