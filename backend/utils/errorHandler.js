const handleError = (res, error, fallback = 'An unexpected error occurred. Please try again.') => {
  if (error.name === 'CastError' || error.name === 'BSONError') {
    return res.status(400).json({ message: 'Invalid ID format provided.' });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    if (field === 'email') {
      return res.status(400).json({ message: 'Email already registered.' });
    }
    return res.status(400).json({ message: 'A record with this value already exists.' });
  }

  if (error.name === 'ValidationError') {
    const first = Object.values(error.errors || {})[0];
    return res.status(400).json({ message: first?.message || 'Validation failed.' });
  }

  console.error(error);
  return res.status(500).json({ message: fallback });
};

module.exports = { handleError };
