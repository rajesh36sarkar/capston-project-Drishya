import jwt from 'jsonwebtoken';

/**
 * Global authorization interceptor to guard secure data endpoints.
 * Validates request header Bearer tokens.
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Missing token headers.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    // Verify token validity against runtime configuration keys
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Bind payload data safely to the current execution thread context
    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    return next();
  } catch (err) {
    console.error('Authorization Middleware Exception:', err.message);
    const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({ message: 'Authentication handshake collapsed.', code });
  }
};