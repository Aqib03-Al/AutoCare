const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const validate = require('../middleware/validate');
const { mongoIdParam, mongoIdBody, vehicleRules, bookingStatusQuery } = require('../utils/validators');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  roleCheck('customer'),
  [
    mongoIdBody('serviceId'),
    ...vehicleRules,
    body('preferredDate').optional({ values: 'falsy' }).trim(),
    body('preferredTime').optional({ values: 'falsy' }).trim(),
    body('notes').optional({ values: 'falsy' }).trim().isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters.'),
  ],
  validate,
  bookingController.createBooking
);

router.get('/my', roleCheck('customer'), bookingController.getMyBookings);
router.get('/', roleCheck('staff', 'admin'), bookingStatusQuery, validate, bookingController.getAllBookings);
router.get('/:id', mongoIdParam(), validate, bookingController.getBookingById);

router.patch(
  '/:id/approve',
  roleCheck('staff', 'admin'),
  [
    mongoIdParam(),
    body('assignedDate').trim().notEmpty().withMessage('Assigned date is required.'),
    body('assignedTime').trim().notEmpty().withMessage('Assigned time is required.'),
  ],
  validate,
  bookingController.approveBooking
);

router.patch(
  '/:id/reject',
  roleCheck('staff', 'admin'),
  [
    mongoIdParam(),
    body('rejectionReason')
      .trim()
      .notEmpty()
      .withMessage('Rejection reason is required.')
      .isLength({ min: 3, max: 500 })
      .withMessage('Rejection reason must be between 3 and 500 characters.'),
  ],
  validate,
  bookingController.rejectBooking
);

router.patch(
  '/:id/status',
  roleCheck('staff', 'admin'),
  [
    mongoIdParam(),
    body('status')
      .notEmpty()
      .withMessage('Status is required.')
      .isIn(['in_progress', 'completed'])
      .withMessage('Status must be either in_progress or completed.'),
  ],
  validate,
  bookingController.updateStatus
);

router.patch('/:id/cancel', roleCheck('customer'), mongoIdParam(), validate, bookingController.cancelBooking);

module.exports = router;
