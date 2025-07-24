const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const heroController = require('../controllers/heroController');

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

router.get('/', heroController.getAll);
router.get('/:id', heroController.getById);

router.post('/',
  authenticateToken,
  upload.single('image'),
  [
    body('title').notEmpty().withMessage('Title required'),
    body('description').notEmpty().withMessage('Description required'),
    body('link_button').isURL().withMessage('Valid URL required'),
  ],
  heroController.create
);

router.put('/:id',
  authenticateToken,
  upload.single('image'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty if provided'),
    body('link_button').optional().isURL().withMessage('Valid URL required if provided'),
  ],
  heroController.update
);

router.delete('/:id', authenticateToken, heroController.delete);

module.exports = router; 