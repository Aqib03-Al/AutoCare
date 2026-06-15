const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const invalidIdResponse = (res) =>
  res.status(400).json({ message: 'Invalid ID format provided.' });

module.exports = { isValidObjectId, invalidIdResponse };
