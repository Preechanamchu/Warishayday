// netlify/functions/manager-store-api.js
const requireAuth = require('./auth-middleware'); // ใช้ Middleware ตัวเดิมของคุณได้
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const handler = async (event, context) => {
  const { httpMethod, queryStringParameters, body } = event;
  const user = event.user; // จาก auth-middleware

  // Security Check: เฉพาะ Super Admin เท่านั้นที่ใช้งาน API นี้ได้
  // คุณต้องมั่นใจว่า token ของคุณมี field isSuperAdmin หรือตรวจสอบสิทธิ์ที่นี่
  // if (!user.isSuperAdmin) return { statusCode: 403, body: JSON.stringify({ error: 'Access Denied' }) };

  const client = await pool.connect();

  try {
    // --- GET METHODS (ดึงข้อมูล) ---
    if (httpMethod === 'GET') {
      const action = queryStringParameters.action;

      if (action === 'get_registrations') {
        // ดึงร้านค้าที่รออนุมัติ
        const result = await client.query("SELECT * FROM stores WHERE status = 'pending' ORDER BY registered_at DESC");
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }
      
      if (action === 'get_active_stores') {
        // ดึงร้านค้าที่เปิดใช้งานแล้ว (รวมที่หมดอายุหรือระงับ)
        const result = await client.query("SELECT id, shop_name, username, package_type, status, expiry_date, serial_key FROM stores WHERE status IN ('active', 'paused', 'expired') ORDER BY opened_at DESC");
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      if (action === 'get_serial_keys') {
        // ดึง Serial Keys
        const result = await client.query("SELECT * FROM serial_keys ORDER BY created_at DESC");
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }
    }

    // --- POST METHODS (การกระทำต่างๆ) ---
    if (httpMethod === 'POST') {
      const data = JSON.parse(body);
      const action = data.action;

      // 1. สร้าง Serial Key
      if (action === 'create_serial_key') {
        const { key, duration } = data;
        await client.query(
          "INSERT INTO serial_keys (key_code, duration_days, status) VALUES ($1, $2, 'unused')",
          [key, duration]
        );
        return { statusCode: 201, body: JSON.stringify({ message: 'Serial Key created' }) };
      }

      // 2. อนุมัติร้านค้า (Approve Registration)
      if (action === 'approve_store') {
        const { storeId, packageType } = data;
        await client.query(
          "UPDATE stores SET status = 'approved', package_type = $1, approved_at = NOW() WHERE id = $2",
          [packageType, storeId]
        );
        return { statusCode: 200, body: JSON.stringify({ message: 'Store approved' }) };
      }

      // 3. ปฏิเสธร้านค้า (Reject)
      if (action === 'reject_store') {
        const { storeId } = data;
        await client.query("UPDATE stores SET status = 'rejected' WHERE id = $1", [storeId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store rejected' }) };
      }

      // 4. เปิดร้านค้าใหม่ (Open Store & Assign Serial)
      if (action === 'open_store') {
        const { storeId, serialKeyId } = data;
        
        // ตรวจสอบ Serial Key
        const keyRes = await client.query("SELECT * FROM serial_keys WHERE id = $1 AND status = 'unused'", [serialKeyId]);
        if (keyRes.rows.length === 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or used Serial Key' }) };
        }
        const keyData = keyRes.rows[0];

        // คำนวณวันหมดอายุ
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + keyData.duration_days);

        await client.query('BEGIN');
        try {
          // อัปเดตร้านค้า
          await client.query(
            "UPDATE stores SET status = 'active', serial_key = $1, opened_at = NOW(), expiry_date = $2 WHERE id = $3",
            [keyData.key_code, expiryDate, storeId]
          );
          // อัปเดต Serial Key ว่าถูกใช้แล้ว
          await client.query(
            "UPDATE serial_keys SET status = 'used', used_at = NOW(), used_by_store_id = $1 WHERE id = $2",
            [storeId, serialKeyId]
          );
          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Store opened successfully' }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }
      
      // 5. ระงับ/เปิดใช้งานร้านค้า (Pause/Resume)
      if (action === 'update_store_status') {
        const { storeId, status } = data; // status: 'active' or 'paused'
        await client.query("UPDATE stores SET status = $1 WHERE id = $2", [status, storeId]);
        return { statusCode: 200, body: JSON.stringify({ message: `Store status updated to ${status}` }) };
      }
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid Action' }) };

  } catch (error) {
    console.error('Manager API Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
  } finally {
    client.release();
  }
};

exports.handler = requireAuth(handler);