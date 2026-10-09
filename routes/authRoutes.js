const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  loginUser
);

router.get('/me', protect, getMe);

module.exports = router;
