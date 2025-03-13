const BACKEND_HOME = "http://localhost:7000/";
const uploadFileWebsite = async (req, res) => {
  console.log("file_upload", req.file);
  if (!req.file) {
    return res
      .status(400)
      .send({ message: "Định dạng file chưa được hỗ trợ hoặc file > 1MB." });
  }
  return res.status(201).send({
    status: true,
    uri: BACKEND_HOME + "uploads/files/" + req.file.filename,
    detail: req.file,
    filename: req.file.originalname,
  });
};

module.exports = {
  uploadFileWebsite,
};
