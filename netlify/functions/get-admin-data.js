// netlify/functions/get-admin-data.js
const requireAuth = require('./auth-middleware');
const db = require('./database');

const handler = async (event, context) => {
  try {
    // Fetch all necessary data for the admin panel
    const settingsResult = await db.query('SELECT settings_json FROM shop_settings WHERE id = 1');
    const subAdminsResult = await db.query("SELECT id, username, name, permissions FROM users WHERE is_super_admin = FALSE");
    const ordersResult = await db.query('SELECT * FROM orders ORDER BY timestamp DESC');
    const logsResult = await db.query('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 200'); // Keep logs limited for performance

    // --- START: Calculate Traffic Statistics ---
    const trafficLogsResult = await db.query(`
      SELECT timestamp 
      FROM logs 
      WHERE action IN ('page_view', 'category_click', 'product_click') 
      AND timestamp >= NOW() - INTERVAL '7 day'
    `);

    const dailyTraffic = Array(7).fill(0); // Index 0 = Sunday, ..., 6 = Saturday
    const hourlyTraffic = Array(24).fill(0); // Index 0 = 00:00-00:59, ..., 23 = 23:00-23:59
    const now = new Date();
    const today = now.getDay(); // 0-6
    const currentHour = now.getHours(); // 0-23

    trafficLogsResult.rows.forEach(log => {
      const logDate = new Date(log.timestamp);
      const dayOfWeek = logDate.getDay();
      const hourOfDay = logDate.getHours();

      // Calculate daily traffic index relative to today
      const daysAgo = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < 7) {
        // Map dayOfWeek to the correct index in dailyTraffic (last 7 days ending today)
        // Example: If today is Wednesday (3), then index 6 is Wed, 5 is Tue, ..., 0 is Thu
        const dailyIndex = (6 - daysAgo + 7) % 7;
        dailyTraffic[dailyIndex]++;
      }

      // Calculate hourly traffic (last 24 hours)
      const hoursAgo = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60));
      if (hoursAgo < 24) {
        // Map hourOfDay to the correct index in hourlyTraffic (last 24 hours ending now)
        // Example: If current hour is 14 (2pm), index 23 is 14:00, 22 is 13:00, ..., 0 is 15:00 yesterday
        const hourlyIndex = (23 - hoursAgo + 24) % 24;
        hourlyTraffic[hourlyIndex]++;
      }
    });
    // --- END: Calculate Traffic Statistics ---

    // Combine into the structure the frontend expects in `appData`
    const adminData = {
      shopSettings: settingsResult.rows[0]?.settings_json || {},
      subAdmins: subAdminsResult.rows,
      analytics: {
        orders: ordersResult.rows,
        logs: logsResult.rows, // Include raw logs as before
        dailyTraffic: dailyTraffic, // Add calculated daily traffic
        hourlyTraffic: hourlyTraffic // Add calculated hourly traffic
      },
      // menuOrder is part of shopSettings, so it will be included
    };

    return {
      statusCode: 200,
      body: JSON.stringify(adminData),
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch admin data.' }),
    };
  }
};

// Wrap the handler with the authentication middleware
exports.handler = requireAuth(handler);
