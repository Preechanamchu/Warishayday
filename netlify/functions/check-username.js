const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username } = JSON.parse(event.body);
    
    if (!username) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Username is required' }) };
    }

    const client = await pool.connect();
    try {
        // เช็คว่ามีตารางหรือไม่ก่อน query เพื่อกัน Error 500 กรณีเพิ่งเริ่มระบบ
        // แต่ในที่นี้จะใช้ try-catch จัดการ error table not found แทน
        
        const res = await client.query('SELECT 1 FROM store_registrations WHERE owner_name = $1', [username]);
        
        // ถ้าไม่เจอ row แปลว่าว่าง (Available)
        const isAvailable = res.rowCount === 0;

        return {
            statusCode: 200,
            body: JSON.stringify({ available: isAvailable }),
        };
    } finally {
        client.release();
    }
  } catch (error) {
    console.error('Check Username Error:', error);
    
    // Error code 42P01 คือ undefined_table (ยังไม่มีตาราง)
    // ให้ถือว่า Username ว่างไปก่อน เพราะยังไม่มีใครสมัคร
    if (error.code === '42P01') {
         return { statusCode: 200, body: JSON.stringify({ available: true }) };
    }

    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database check failed' }),
    };
  }
};