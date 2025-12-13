// netlify/functions/manager-store-api.js
const requireAuth = require('./auth-middleware');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const handler = async (event, context) => {
  const { httpMethod, queryStringParameters, body } = event;
  const user = event.user;

  // Security Check: เฉพาะ Super Admin เท่านั้นที่ใช้งาน API นี้ได้
  // if (!user.isSuperAdmin) return { statusCode: 403, body: JSON.stringify({ error: 'Access Denied' }) };

  const client = await pool.connect();

  try {
    // --- GET METHODS ---
    if (httpMethod === 'GET') {
      const action = queryStringParameters?.action;

      if (action === 'get_registrations') {
        const result = await client.query("SELECT * FROM stores WHERE status = 'pending' ORDER BY registered_at DESC");
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      if (action === 'get_all_registrations') {
        const result = await client.query("SELECT * FROM stores ORDER BY registered_at DESC");
        const today = new Date().toISOString().split('T')[0];
        const pending = result.rows.filter(s => s.status === 'pending');
        const approvedToday = result.rows.filter(s => s.status === 'approved' && s.approved_at?.toISOString().startsWith(today));
        const rejectedToday = result.rows.filter(s => s.status === 'rejected');

        return {
          statusCode: 200,
          body: JSON.stringify({
            stores: result.rows,
            stats: { pending: pending.length, approvedToday: approvedToday.length, rejectedToday: rejectedToday.length }
          })
        };
      }

      if (action === 'get_pending_stores') {
        const result = await client.query("SELECT * FROM stores WHERE status = 'approved' ORDER BY approved_at DESC");
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      if (action === 'get_active_stores') {
        const result = await client.query("SELECT id, shop_name, username, package_type, status, expiry_date, serial_key, opened_at FROM stores WHERE status IN ('active', 'paused', 'expired') ORDER BY opened_at DESC");
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      if (action === 'get_serial_keys') {
        const result = await client.query("SELECT * FROM serial_keys ORDER BY created_at DESC");
        const keys = result.rows;
        return {
          statusCode: 200,
          body: JSON.stringify({
            keys,
            stats: { total: keys.length, active: keys.filter(k => k.status === 'used').length, unused: keys.filter(k => k.status === 'unused').length }
          })
        };
      }

      if (action === 'get_payment_proofs') {
        const result = await client.query(`
          SELECT ph.*, s.shop_name FROM payment_history ph 
          LEFT JOIN stores s ON ph.store_id = s.id 
          WHERE ph.status = 'pending' ORDER BY ph.submitted_at DESC
        `);
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      if (action === 'get_payment_history') {
        const result = await client.query(`
          SELECT ph.*, s.shop_name FROM payment_history ph 
          LEFT JOIN stores s ON ph.store_id = s.id 
          ORDER BY ph.submitted_at DESC LIMIT 100
        `);
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      if (action === 'get_dashboard_stats') {
        const storesResult = await client.query("SELECT status, package_type, COUNT(*) as count FROM stores WHERE status IN ('active', 'paused', 'expired') GROUP BY status, package_type");
        const revenueResult = await client.query("SELECT COALESCE(SUM(amount), 0) as total FROM payment_history WHERE status = 'approved'");

        return {
          statusCode: 200,
          body: JSON.stringify({
            storesByStatus: storesResult.rows,
            totalRevenue: parseFloat(revenueResult.rows[0].total) || 0
          })
        };
      }

      if (action === 'get_package_permissions') {
        const packageType = queryStringParameters?.packageType || 'standard';
        try {
          const result = await client.query(
            "SELECT setting_value FROM manager_settings WHERE setting_key = $1",
            [`package_permissions_${packageType}`]
          );
          const permissions = result.rows.length > 0 ? JSON.parse(result.rows[0].setting_value) : [];
          return { statusCode: 200, body: JSON.stringify({ permissions }) };
        } catch (e) {
          // Table might not exist yet, return defaults
          return { statusCode: 200, body: JSON.stringify({ permissions: ['dashboard', 'pos', 'orders', 'products', 'stock'] }) };
        }
      }

      // GET: ดึงช่องทางชำระเงิน
      if (action === 'get_payment_channels') {
        try {
          const result = await client.query("SELECT * FROM payment_channels WHERE is_active = true ORDER BY display_order ASC");
          return { statusCode: 200, body: JSON.stringify(result.rows) };
        } catch (e) {
          // Table might not exist yet
          return { statusCode: 200, body: JSON.stringify([]) };
        }
      }

      // GET: ดึงข้อมูลทั้งหมดสำหรับ Manager Store
      if (action === 'get_all_data') {
        try {
          const storesRes = await client.query("SELECT * FROM stores ORDER BY registered_at DESC");
          const keysRes = await client.query("SELECT * FROM serial_keys ORDER BY created_at DESC");
          const paymentsRes = await client.query(`
            SELECT ph.*, s.shop_name FROM payment_history ph 
            LEFT JOIN stores s ON ph.store_id = s.id 
            ORDER BY ph.submitted_at DESC LIMIT 100
          `);
          const channelsRes = await client.query("SELECT * FROM payment_channels WHERE is_active = true ORDER BY display_order ASC");

          const stores = storesRes.rows;
          const pendingRegistrations = stores.filter(s => s.status === 'pending');
          const approvedStores = stores.filter(s => s.status === 'approved');
          const activeStores = stores.filter(s => ['active', 'paused', 'expired'].includes(s.status));

          return {
            statusCode: 200,
            body: JSON.stringify({
              storeRegistrations: pendingRegistrations,
              pendingStores: approvedStores,
              activeStores: activeStores,
              serialKeys: keysRes.rows,
              paymentHistory: paymentsRes.rows,
              paymentChannels: channelsRes.rows
            })
          };
        } catch (e) {
          console.error('Get all data error:', e);
          return { statusCode: 200, body: JSON.stringify({ storeRegistrations: [], pendingStores: [], activeStores: [], serialKeys: [], paymentHistory: [], paymentChannels: [] }) };
        }
      }
    }

    // --- POST METHODS ---
    if (httpMethod === 'POST') {
      const data = JSON.parse(body);
      const action = data.action;

      // 1. สร้าง Serial Key
      if (action === 'create_serial_key') {
        const { key, duration } = data;
        await client.query("INSERT INTO serial_keys (key_code, duration_days, status) VALUES ($1, $2, 'unused')", [key, duration]);
        return { statusCode: 201, body: JSON.stringify({ message: 'Serial Key created' }) };
      }

      // 2. อนุมัติร้านค้า
      if (action === 'approve_store') {
        const { storeId, packageType } = data;
        await client.query("UPDATE stores SET status = 'approved', package_type = $1, approved_at = NOW() WHERE id = $2", [packageType, storeId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store approved' }) };
      }

      // 3. ปฏิเสธร้านค้า
      if (action === 'reject_store') {
        const { storeId } = data;
        await client.query("UPDATE stores SET status = 'rejected' WHERE id = $1", [storeId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store rejected' }) };
      }

      // 4. เปิดร้านค้าใหม่
      if (action === 'open_store') {
        const { storeId, serialKeyId } = data;
        const keyRes = await client.query("SELECT * FROM serial_keys WHERE id = $1 AND status = 'unused'", [serialKeyId]);
        if (keyRes.rows.length === 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or used Serial Key' }) };
        }
        const keyData = keyRes.rows[0];
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + keyData.duration_days);

        await client.query('BEGIN');
        try {
          await client.query("UPDATE stores SET status = 'active', serial_key = $1, opened_at = NOW(), expiry_date = $2 WHERE id = $3", [keyData.key_code, expiryDate, storeId]);
          await client.query("UPDATE serial_keys SET status = 'used', used_at = NOW(), used_by_store_id = $1 WHERE id = $2", [storeId, serialKeyId]);
          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Store opened successfully' }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }

      // 5. ระงับ/เปิดใช้งานร้านค้า
      if (action === 'update_store_status') {
        const { storeId, status } = data;
        await client.query("UPDATE stores SET status = $1 WHERE id = $2", [status, storeId]);
        return { statusCode: 200, body: JSON.stringify({ message: `Store status updated to ${status}` }) };
      }

      // 6. ตั้งค่า Username/Password
      if (action === 'set_store_credentials') {
        const { storeId, username, password } = data;
        if (!username || !password || password.length < 4) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid username or password (min 4 chars)' }) };
        }
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query("UPDATE stores SET username = $1, password_hash = $2, status = 'active', opened_at = NOW() WHERE id = $3", [username, hashedPassword, storeId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store credentials set' }) };
      }

      // 7. ต่ออายุร้านค้า
      if (action === 'extend_store') {
        const { storeId, days, paymentId, amount } = data;
        if (!storeId || !days || days < 1) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid store ID or days' }) };
        }

        await client.query('BEGIN');
        try {
          const storeRes = await client.query("SELECT expiry_date FROM stores WHERE id = $1", [storeId]);
          if (storeRes.rows.length === 0) throw new Error('Store not found');

          let newExpiryDate = new Date(storeRes.rows[0].expiry_date);
          if (newExpiryDate < new Date()) newExpiryDate = new Date();
          newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(days));

          await client.query("UPDATE stores SET expiry_date = $1, status = 'active' WHERE id = $2", [newExpiryDate, storeId]);
          if (paymentId) {
            await client.query("UPDATE payment_history SET status = 'approved', approved_at = NOW(), extended_days = $1 WHERE id = $2", [days, paymentId]);
          }
          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Store extended', newExpiryDate: newExpiryDate.toISOString() }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }

      // 8. ลบร้านค้า
      if (action === 'delete_store') {
        const { storeId } = data;
        if (!storeId) return { statusCode: 400, body: JSON.stringify({ error: 'Store ID required' }) };

        await client.query('BEGIN');
        try {
          const storeRes = await client.query("SELECT serial_key FROM stores WHERE id = $1", [storeId]);
          if (storeRes.rows.length > 0 && storeRes.rows[0].serial_key) {
            await client.query("UPDATE serial_keys SET status = 'unused', used_at = NULL, used_by_store_id = NULL WHERE key_code = $1", [storeRes.rows[0].serial_key]);
          }
          await client.query("DELETE FROM stores WHERE id = $1", [storeId]);
          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Store deleted' }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }

      // 9. ลบ Serial Key
      if (action === 'delete_serial_key') {
        const { keyId } = data;
        const result = await client.query("DELETE FROM serial_keys WHERE id = $1 AND status = 'unused' RETURNING id", [keyId]);
        if (result.rows.length === 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Cannot delete used key' }) };
        }
        return { statusCode: 200, body: JSON.stringify({ message: 'Serial Key deleted' }) };
      }

      // 10. อนุมัติการชำระเงิน
      if (action === 'approve_payment') {
        const { paymentId, storeId, days } = data;
        await client.query('BEGIN');
        try {
          const storeRes = await client.query("SELECT expiry_date FROM stores WHERE id = $1", [storeId]);
          let newExpiryDate = new Date(storeRes.rows[0]?.expiry_date || new Date());
          if (newExpiryDate < new Date()) newExpiryDate = new Date();
          newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(days));

          await client.query("UPDATE stores SET expiry_date = $1, status = 'active' WHERE id = $2", [newExpiryDate, storeId]);
          await client.query("UPDATE payment_history SET status = 'approved', approved_at = NOW(), extended_days = $1 WHERE id = $2", [days, paymentId]);
          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Payment approved', newExpiryDate: newExpiryDate.toISOString() }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }

      // 11. ปฏิเสธการชำระเงิน
      if (action === 'reject_payment') {
        const { paymentId } = data;
        await client.query("UPDATE payment_history SET status = 'rejected' WHERE id = $1", [paymentId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Payment rejected' }) };
      }

      // 12. บันทึกสิทธิ์การเข้าถึงแพ็คเกจ
      if (action === 'save_package_permissions') {
        const { packageType, permissions } = data;
        // Using UPSERT (INSERT ... ON CONFLICT) for manager_settings table
        await client.query(`
          INSERT INTO manager_settings (setting_key, setting_value, updated_at)
          VALUES ($1, $2, NOW())
          ON CONFLICT (setting_key) DO UPDATE SET setting_value = $2, updated_at = NOW()
        `, [`package_permissions_${packageType}`, JSON.stringify(permissions)]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Permissions saved' }) };
      }

      // 13. เพิ่มช่องทางชำระเงิน
      if (action === 'add_payment_channel') {
        const { channelType, channelName, accountNumber, accountName, qrCodeImage } = data;
        if (!channelType || !channelName) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Channel type and name are required' }) };
        }
        const result = await client.query(`
          INSERT INTO payment_channels (channel_type, channel_name, account_number, account_name, qr_code_image)
          VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [channelType, channelName, accountNumber || null, accountName || null, qrCodeImage || null]);
        return { statusCode: 201, body: JSON.stringify({ message: 'Payment channel added', channel: result.rows[0] }) };
      }

      // 14. ลบช่องทางชำระเงิน
      if (action === 'delete_payment_channel') {
        const { channelId } = data;
        if (!channelId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Channel ID required' }) };
        }
        await client.query("UPDATE payment_channels SET is_active = false WHERE id = $1", [channelId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Payment channel deleted' }) };
      }

      // 15. ส่งหลักฐานการชำระเงิน (สำหรับร้านค้า)
      if (action === 'submit_payment_proof') {
        const { storeId, amount, paymentMethod, proofImage, transactionRef, notes } = data;
        if (!storeId || !amount) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID and amount are required' }) };
        }
        const result = await client.query(`
          INSERT INTO payment_history (store_id, amount, payment_method, proof_image, transaction_ref, notes)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [storeId, amount, paymentMethod || null, proofImage || null, transactionRef || null, notes || null]);
        return { statusCode: 201, body: JSON.stringify({ message: 'Payment proof submitted', payment: result.rows[0] }) };
      }

      // 16. แก้ไข Serial Key (เพิ่มข้อมูล expiry_date)
      if (action === 'update_serial_key') {
        const { keyId, expiryDate } = data;
        if (!keyId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Key ID required' }) };
        }
        await client.query("UPDATE serial_keys SET expiry_date = $1 WHERE id = $2", [expiryDate, keyId]);
        return { statusCode: 200, body: JSON.stringify({ message: 'Serial key updated' }) };
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