const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const MAX_IMAGE_UPLOAD_BYTES = Number(process.env.MAX_IMAGE_UPLOAD_BYTES || '10485760');

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    callback(null, `${file.fieldname}-${Date.now()}-${randomUUID()}${extension}`);
  },
});

function imageFileFilter(req, file, callback) {
  if (!file.mimetype.startsWith('image/')) {
    return callback(new Error('Only image uploads are allowed'));
  }
  return callback(null, true);
}

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
});

module.exports = upload;
