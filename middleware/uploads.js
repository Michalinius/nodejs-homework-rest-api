const path = require('path')
const multer = require('multer')

const UPLOAD_DIR = path.join(process.cwd(), 'tmp');
const IMAGES_DIR = path.join(process.cwd(), "public", "avatars");


const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    limits: { fileSize: 10_048_576 },
});

const upload = multer({ storage });

module.exports = { upload, UPLOAD_DIR, IMAGES_DIR };