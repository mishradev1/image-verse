const express = require('express');
const { uploadImage, getImages, incrementViewCount } = require('../controllers/imageController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: './uploads/', // Path where files are temporarily stored
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Ensures unique file names
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!')); // Reject if file type is not allowed
  }
};

// Init multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

// Routes for image upload, fetching, and view count increment
router.post('/upload', auth, upload.single('image'), uploadImage); // Auth middleware ensures only authenticated users can upload
router.get('/', getImages); // Public route to get all images
router.post('/:id/view', incrementViewCount); // Increment image view count

module.exports = router;
