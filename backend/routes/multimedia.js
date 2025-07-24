const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const multimediaController = require('../controllers/multimediaController');

const router = express.Router();

// Configure multer for both images and videos
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
      // Preserve original filename with timestamp to avoid conflicts
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  }),
  fileFilter: function (req, file, cb) {
    // Accept image and video files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
});

// Public routes (GET)
router.get('/', multimediaController.getAll);
router.get('/:id', multimediaController.getById);

// Protected routes (POST, PUT, DELETE)
router.post('/',
  authenticateToken,
  upload.single('file'),
  [
    body('title').notEmpty().withMessage('Title required'),
  ],
  multimediaController.create
);

router.put('/:id',
  authenticateToken,
  upload.single('file'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
  ],
  multimediaController.update
);

router.delete('/:id', authenticateToken, multimediaController.delete);

module.exports = router; 