import jwt from 'jsonwebtoken';

// Function to generate JWT token
export function generateToken(userId, email) {
  const payload = { userId, email };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
}

// Function to verify JWT token
export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Middleware to authenticate JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if Authorization header is present
  // If not, return 401 Unauthorized
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  // Check if token is present
  // If not, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};