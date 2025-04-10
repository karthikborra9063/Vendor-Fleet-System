const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  console.log(ext);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.pdf') {
    return cb(new Error('Only images and PDF files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
