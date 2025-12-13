// netlify/functions/log-traffic.js
const db = require('./database');

exports.handler = async (event, context) => {
  // This endpoint is public and doesn't require authentication.
  // It only accepts POST requests.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const action = data.action || 'unknown_action';

    // Get client IP and User-Agent for logging
    const clientIp = event.headers['client-ip'] || 'unknown_ip';
    // We only store the IP as a simple detail.
    const details = `IP: ${clientIp}`;
    const user = 'Guest'; // All traffic logs are from anonymous guests

    // Insert the log entry into the database
    const insertLogQuery = `
      INSERT INTO logs (timestamp, user, action, details)
      VALUES (NOW(), $1, $2, $3)
    `;
    
    await db.query(insertLogQuery, [user, action, details]);

    return {
      statusCode: 201, // 201 Created
      body: JSON.stringify({ message: 'Log entry created.' }),
    };
  } catch (error) {
    console.error('Error in log-traffic function:', error);
    // Return 200 even on error to avoid breaking client-side flow.
    // The client doesn't need to know if logging failed.
    return {
      statusCode: 200, 
      body: JSON.stringify({ error: 'Failed to log traffic, but operation continues.' }),
    };
  }
};
