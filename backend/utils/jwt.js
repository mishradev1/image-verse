const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
