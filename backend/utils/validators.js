const { body, param, query } = require('express-validator');

const mongoIdParam = (name = 'id') =>
  param(name).isMongoId().withMessage(`Invalid ${name} format.`);

const nameRule = (field = 'name') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters.');

const emailRule = (field = 'email') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail();

const passwordRule = (field = 'password') =>
  body(field)
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6, max: 64 })
    .withMessage('Password must be between 6 and 64 characters.');

const phoneRule = (field = 'phone') =>
  body(field)
    .optional({ values: 'falsy' })
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Please enter a valid phone number.');

const serviceNameRule = body('name')
  .trim()
  .notEmpty()
  .withMessage('Service name is required.')
  .isLength({ min: 2, max: 100 })
  .withMessage('Service name must be between 2 and 100 characters.');

const servicePriceRule = body('price')
  .notEmpty()
  .withMessage('Price is required.')
  .isFloat({ min: 0 })
  .withMessage('Price must be a valid number greater than or equal to 0.');

const serviceDurationRule = body('duration')
  .notEmpty()
  .withMessage('Duration is required.')
  .isInt({ min: 1, max: 480 })
  .withMessage('Duration must be between 1 and 480 minutes.');

const serviceDescriptionRule = body('description')
  .optional({ values: 'falsy' })
  .trim()
  .isLength({ max: 500 })
  .withMessage('Description must not exceed 500 characters.');

const mongoIdBody = (field) =>
  body(field).notEmpty().withMessage(`${field} is required.`).isMongoId().withMessage(`Invalid ${field} format.`);

const vehicleRules = [
  body('vehicle.make')
    .trim()
    .notEmpty()
    .withMessage('Vehicle make is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle make must be between 2 and 50 characters.'),
  body('vehicle.model')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required.')
    .isLength({ min: 1, max: 50 })
    .withMessage('Vehicle model must be between 1 and 50 characters.'),
  body('vehicle.plateNumber')
    .trim()
    .notEmpty()
    .withMessage('Plate number is required.')
    .isLength({ min: 3, max: 20 })
    .withMessage('Plate number must be between 3 and 20 characters.'),
  body('vehicle.year')
    .notEmpty()
    .withMessage('Vehicle year is required.')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Vehicle year must be between 1900 and ${new Date().getFullYear() + 1}.`),
];

const bookingStatusQuery = query('status')
  .optional()
  .isIn(['pending', 'approved', 'rejected', 'cancelled', 'in_progress', 'completed'])
  .withMessage('Invalid booking status filter.');

const roleQuery = query('role')
  .optional()
  .isIn(['customer', 'staff', 'admin'])
  .withMessage('Invalid role filter. Use customer, staff, or admin.');

module.exports = {
  mongoIdParam,
  mongoIdBody,
  nameRule,
  emailRule,
  passwordRule,
  phoneRule,
  serviceNameRule,
  servicePriceRule,
  serviceDurationRule,
  serviceDescriptionRule,
  vehicleRules,
  bookingStatusQuery,
  roleQuery,
};
