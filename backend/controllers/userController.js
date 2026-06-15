const User = require('../models/User');
const { handleError } = require('../utils/errorHandler');
const { isValidObjectId, invalidIdResponse } = require('../utils/objectId');

exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    handleError(res, error, 'Failed to load users.');
  }
};

exports.createStaff = async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;
    const phone = req.body.phone ? String(req.body.phone).trim() : '';

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'staff',
    });

    res.status(201).json(user);
  } catch (error) {
    handleError(res, error, 'Failed to create staff account.');
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const { name, phone, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin' && isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate an admin account.' });
    }

    if (name !== undefined) user.name = String(name).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to update user.');
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return invalidIdResponse(res);

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot deactivate an admin account.' });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: 'User account is already inactive.' });
    }

    user.isActive = false;
    await user.save();
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to deactivate user.');
  }
};
