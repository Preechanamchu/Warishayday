// netlify/functions/auth-middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// This is not a handler, but a helper function to be used by other handlers.
const requireAuth = (handler) => {
  return async (event, context) => {
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Authentication token required.' }),
      };
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Attach user information to the event object for the handler to use
      event.user = decoded;
      return handler(event, context);
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Invalid or expired token.' }),
      };
    }
  };
};

module.exports = requireAuth;
