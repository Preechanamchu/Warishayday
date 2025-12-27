const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  // API นี้ควรมีการตรวจสอบสิทธิ์ (Authentication) ของ Admin ด้วยในอนาคต
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const client = await pool.connect();
    try {
        // ดึงข้อมูลเรียงตามวันที่ล่าสุด
        const res = await client.query('SELECT * FROM store_registrations ORDER BY registered_at DESC');
        
        // แปลง format ข้อมูลจาก snake_case (Database) เป็น camelCase (Frontend)
        // เพื่อให้ตรงกับที่ script.js ของคุณคาดหวัง
        const registrations = res.rows.map(row => ({
            id: row.id,
            shopName: row.shop_name,
            shopAge: row.shop_age,
            shopLink: row.shop_link,
            ownerName: row.owner_name,
            // ไม่ส่ง password กลับไปเพื่อความปลอดภัย
            packageType: row.package_type,
            status: row.status,
            registeredAt: row.registered_at,
            contacts: {
                line: row.contact_line,
                facebook: row.contact_facebook,
                phone: row.contact_phone
            },
            // ฟิลด์เสริมสำหรับการแสดงผลในตาราง Admin
            phone: row.contact_phone || row.contact_line || row.contact_facebook || '-',
            email: '-' // ตารางเรายังไม่มี email column
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ registrations }),
        };
    } finally {
        client.release();
    }
  } catch (error) {
    console.error('Get Registrations Error:', error);
    
    // ถ้ายังไม่มีตาราง ให้คืนค่า array ว่าง
    if (error.code === '42P01') {
         return { statusCode: 200, body: JSON.stringify({ registrations: [] }) };
    }

    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database error' }),
    };
  }
};