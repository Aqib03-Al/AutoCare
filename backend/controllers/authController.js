const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { handleError } = require('../utils/errorHandler');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.register = async (req, res) => {
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
      role: 'customer',
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    handleError(res, error, 'Registration failed. Please try again.');
  }
};

exports.login = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    let isMatch = false;
    try {
      isMatch = await user.comparePassword(password);
    } catch {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    handleError(res, error, 'Login failed. Please try again.');
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    handleError(res, error, 'Failed to load profile.');
  }
};
