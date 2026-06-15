const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { handleError } = require('../utils/errorHandler');
const { isValidObjectId, invalidIdResponse } = require('../utils/objectId');

const populateBooking = (query) =>
  query
    .populate('customerId', 'name email phone')
    .populate('serviceId', 'name price duration')
    .populate('staffId', 'name email');

exports.createBooking = async (req, res) => {
  try {
    const service = await Service.findById(req.body.serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or is no longer available.' });
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      serviceId: service._id,
      vehicle: req.body.vehicle,
      preferredDate: req.body.preferredDate || '',
      preferredTime: req.body.preferredTime || '',
      totalPrice: service.price,
      notes: req.body.notes || '',
    });

    const populated = await populateBooking(Booking.findById(booking._id));
    res.status(201).json(await populated);
  } catch (error) {
    handleError(res, error, 'Failed to create booking.');
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await populateBooking(
      Booking.find({ customerId: req.user._id }).sort({ createdAt: -1 })
    );
    res.json(await bookings);
  } catch (error) {
    handleError(res, error, 'Failed to load bookings.');
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await populateBooking(
      Booking.find(filter).sort({ createdAt: -1 })
    );
    res.json(await bookings);
  } catch (error) {
    handleError(res, error, 'Failed to load bookings.');
  }
};

exports.getBookingById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const bookingDoc = await populateBooking(Booking.findById(req.params.id));

    if (!bookingDoc) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const isOwner = bookingDoc.customerId._id.toString() === req.user._id.toString();
    const isStaffOrAdmin = ['staff', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json(bookingDoc);
  } catch (error) {
    handleError(res, error, 'Failed to load booking.');
  }
};

exports.approveBooking = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be approved.' });
    }

    booking.status = 'approved';
    booking.assignedDate = req.body.assignedDate;
    booking.assignedTime = req.body.assignedTime;
    booking.staffId = req.user._id;
    await booking.save();

    const populated = await populateBooking(Booking.findById(booking._id));
    res.json(await populated);
  } catch (error) {
    handleError(res, error, 'Failed to approve booking.');
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be rejected.' });
    }

    booking.status = 'rejected';
    booking.rejectionReason = req.body.rejectionReason || '';
    booking.staffId = req.user._id;
    await booking.save();

    const populated = await populateBooking(Booking.findById(booking._id));
    res.json(await populated);
  } catch (error) {
    handleError(res, error, 'Failed to reject booking.');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const { status } = req.body;
    const allowed = ['in_progress', 'completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (status === 'in_progress' && booking.status !== 'approved') {
      return res.status(400).json({ message: 'Booking must be approved first.' });
    }

    if (status === 'completed' && booking.status !== 'in_progress') {
      return res.status(400).json({ message: 'Booking must be in progress first.' });
    }

    booking.status = status;
    if (!booking.staffId) booking.staffId = req.user._id;
    await booking.save();

    const populated = await populateBooking(Booking.findById(booking._id));
    res.json(await populated);
  } catch (error) {
    handleError(res, error, 'Failed to update booking status.');
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const populated = await populateBooking(Booking.findById(booking._id));
    res.json(await populated);
  } catch (error) {
    handleError(res, error, 'Failed to cancel booking.');
  }
};
