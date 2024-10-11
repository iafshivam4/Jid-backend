const jwt = require('jsonwebtoken');


const SECRET_KEY = 'your_secret_key';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
