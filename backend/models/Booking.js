const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    plateNumber: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicle: { type: vehicleSchema, required: true },
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, default: '' },
    assignedDate: { type: String, default: '' },
    assignedTime: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'in_progress', 'completed'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    notes: { type: String, default: '' },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
