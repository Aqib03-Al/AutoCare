const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { nameRule, emailRule, passwordRule, phoneRule, mongoIdParam, roleQuery } = require('../utils/validators');

const router = express.Router();

router.use(auth, roleCheck('admin'));

router.get('/', roleQuery, validate, userController.getUsers);

router.post(
  '/staff',
  [nameRule(), emailRule(), passwordRule(), phoneRule()],
  validate,
  userController.createStaff
);

router.put(
  '/:id',
  [
    mongoIdParam(),
    body('name')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be between 2 and 80 characters.'),
    phoneRule(),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value.'),
  ],
  validate,
  userController.updateUser
);

router.patch('/:id/deactivate', mongoIdParam(), validate, userController.deactivateUser);

module.exports = router;
