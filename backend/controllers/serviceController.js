const Service = require('../models/Service');
const { handleError } = require('../utils/errorHandler');
const { isValidObjectId, invalidIdResponse } = require('../utils/objectId');

exports.getPublicServices = async (_req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    handleError(res, error, 'Failed to load services.');
  }
};

exports.getServices = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { isActive: true };
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    handleError(res, error, 'Failed to load services.');
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create({
      name: String(req.body.name).trim(),
      description: req.body.description ? String(req.body.description).trim() : '',
      price: req.body.price,
      duration: req.body.duration,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });
    res.status(201).json(service);
  } catch (error) {
    handleError(res, error, 'Failed to create service.');
  }
};

exports.updateService = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.description !== undefined) updates.description = String(req.body.description).trim();
    if (req.body.price !== undefined) updates.price = req.body.price;
    if (req.body.duration !== undefined) updates.duration = req.body.duration;
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    const service = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json(service);
  } catch (error) {
    handleError(res, error, 'Failed to update service.');
  }
};

exports.deleteService = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json({ message: 'Service deactivated successfully.', service });
  } catch (error) {
    handleError(res, error, 'Failed to deactivate service.');
  }
};
