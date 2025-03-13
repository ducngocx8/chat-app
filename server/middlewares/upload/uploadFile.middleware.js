const multer = require("multer");
const path = require("path");

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/files/");
  },
  filename: (req, file, cb) => {
    let extname = path.extname(file.originalname);
    file.originalname = path.basename(
      Buffer.from(file.originalname, "latin1").toString("utf8"),
      extname
    );
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeFileName = file.fieldname + "-" + uniqueSuffix + extname;
    cb(null, `${Date.now()}_${safeFileName}`);
  },
});

// Kiểm tra định dạng file
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file .pdf, .doc, .docx"));
  }
};

const uploadFile = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // Giới hạn 1MB
  fileFilter,
});

// Tạo middleware upload file
const uploadFileMiddleware = (req, res, next) => {
  uploadFile.single("file")(req, res, (err) => {
    // Kiểm tra lỗi do file quá lớn
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        status: false,
        text: "Kích thước file quá lớn (tối đa 1MB)",
      });
    }

    // Kiểm tra lỗi do sai định dạng file
    if (req.fileValidationError) {
      return res.status(400).send({
        status: false,
        text: "Định dạng file chưa được hỗ trợ",
      });
    }

    // Kiểm tra nếu không có file
    if (!req.file) {
      return res.status(400).send({
        status: false,
        text: "Vui lòng chọn một file hợp lệ",
      });
    }
    // Nếu không có lỗi, tiếp tục xử lý request
    next();
  });
};

module.exports = { uploadFileMiddleware };
