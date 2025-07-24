const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const mediaController = require('../controllers/mediaController');

const router = express.Router();
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
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.get('/', mediaController.getAll);
router.get('/:id', mediaController.getById);

router.post('/',
  authenticateToken,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title required'),
    body('description').notEmpty().withMessage('Description required'),
    body('periode').notEmpty().withMessage('Period required'),
  ],
  mediaController.create
);

router.put('/:id',
  authenticateToken,
  upload.single('image'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty if provided'),
    body('periode').optional().notEmpty().withMessage('Period cannot be empty if provided'),
  ],
  mediaController.update
);

router.delete('/:id', authenticateToken, mediaController.delete);

module.exports = router; 