// netlify/functions/database.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool. The connection string is read from the environment variable.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon DB connections
  }
});

// Export a query function AND the pool itself to be used by other serverless functions.
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool // <-- EXPORT THE POOL HERE
};
