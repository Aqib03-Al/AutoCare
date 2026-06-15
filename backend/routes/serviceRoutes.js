const express = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const {
  mongoIdParam,
  serviceNameRule,
  servicePriceRule,
  serviceDurationRule,
  serviceDescriptionRule,
} = require('../utils/validators');

const router = express.Router();

router.use(auth);

router.get('/', serviceController.getServices);

router.post(
  '/',
  roleCheck('admin'),
  [serviceNameRule, servicePriceRule, serviceDurationRule, serviceDescriptionRule],
  validate,
  serviceController.createService
);

router.put(
  '/:id',
  roleCheck('admin'),
  [
    mongoIdParam(),
    body('name')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Service name must be between 2 and 100 characters.'),
    body('price')
      .optional({ values: 'falsy' })
      .isFloat({ min: 0 })
      .withMessage('Price must be a valid number greater than or equal to 0.'),
    body('duration')
      .optional({ values: 'falsy' })
      .isInt({ min: 1, max: 480 })
      .withMessage('Duration must be between 1 and 480 minutes.'),
    serviceDescriptionRule,
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean value.'),
  ],
  validate,
  serviceController.updateService
);

router.delete('/:id', roleCheck('admin'), mongoIdParam(), validate, serviceController.deleteService);

module.exports = router;
