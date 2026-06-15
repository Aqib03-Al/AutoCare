const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { nameRule, emailRule, passwordRule, phoneRule } = require('../utils/validators');

const router = express.Router();

router.post(
  '/register',
  [nameRule(), emailRule(), passwordRule(), phoneRule()],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  authController.login
);

router.get('/me', auth, authController.getMe);

module.exports = router;
