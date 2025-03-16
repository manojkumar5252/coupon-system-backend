const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // ✅ Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access Denied: No token provided' });
  }

  // ✅ Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // ✅ Verify token using the secret from .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ You can attach the verified user (or admin) to the request object
    req.admin = verified;

    next(); // ✅ Pass control to next middleware/route
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
}

module.exports = authMiddleware;
