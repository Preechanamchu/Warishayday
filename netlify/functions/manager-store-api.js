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

      // GET: ดึงข้อมูลร้านค้าตาม ID หรือชื่อร้าน (สำหรับลูกค้าเข้าใช้งานผ่าน URL)
      if (action === 'get_store_by_name') {
        const shopName = queryStringParameters?.shopName;
        const storeId = queryStringParameters?.storeId;

        if (!shopName && !storeId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Shop name or store ID required' }) };
        }

        try {
          // รองรับหลายสถานะ: active, ready_to_open (รอเปิด), approved (อนุมัติแล้ว)
          let query = "SELECT id, shop_name, owner_name, package_type, status, serial_key, expiry_date, opened_at FROM store_registrations WHERE ";
          let params = [];

          if (storeId) {
            query += "id = $1 AND status IN ('active', 'ready_to_open', 'approved')";
            params = [parseInt(storeId)];
          } else {
            query += "shop_name = $1 AND status IN ('active', 'ready_to_open', 'approved')";
            params = [decodeURIComponent(shopName)];
          }

          console.log('🔍 Querying store with:', { storeId, shopName, query });
          const result = await client.query(query, params);
          console.log('📊 Query result rows:', result.rows.length);

          if (result.rows.length === 0) {
            console.warn('⚠️ Store not found or status not allowed');
            return { statusCode: 404, body: JSON.stringify({ error: 'Store not found or not active' }) };
          }

          const store = result.rows[0];
          console.log('✅ Store found:', store.shop_name, 'Status:', store.status);

          // ดึงการตั้งค่าของร้านค้า (ถ้ามี)
          let storeSettings = {};
          try {
            const settingsResult = await client.query(
              "SELECT setting_key, setting_value FROM store_settings WHERE store_id = $1",
              [store.id]
            );
            settingsResult.rows.forEach(row => {
              try {
                storeSettings[row.setting_key] = JSON.parse(row.setting_value);
              } catch (parseError) {
                console.warn('Failed to parse setting:', row.setting_key);
                storeSettings[row.setting_key] = row.setting_value;
              }
            });
            console.log('⚙️ Store settings loaded:', Object.keys(storeSettings).length, 'items');
          } catch (e) {
            console.log('⚠️ No store settings found or table does not exist:', e.message);
          }

          return {
            statusCode: 200,
            body: JSON.stringify({
              id: store.id,
              shopName: store.shop_name,
              ownerName: store.owner_name,
              packageType: store.package_type,
              status: store.status,
              serialKey: store.serial_key,
              expiryDate: store.expiry_date,
              openedAt: store.opened_at,
              settings: storeSettings
            })
          };
        } catch (e) {
          console.error('❌ Get store by name error:', e);
          return { statusCode: 500, body: JSON.stringify({ error: 'Database error', details: e.message }) };
        }
      }

      // GET: ดึงข้อมูลร้านค้าตาม ID (สำหรับ Store Login Modal)
      if (action === 'get_store_by_id') {
        const storeId = queryStringParameters?.storeId;
        if (!storeId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID required' }) };
        }

        try {
          const result = await client.query(
            "SELECT id, shop_name, owner_name, package_type, status FROM store_registrations WHERE id = $1",
            [parseInt(storeId)]
          );

          if (result.rows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
          }

          const store = result.rows[0];
          return {
            statusCode: 200,
            body: JSON.stringify({
              id: store.id,
              shopName: store.shop_name,
              ownerName: store.owner_name,
              packageType: store.package_type,
              status: store.status
            })
          };
        } catch (e) {
          console.error('Get store by ID error:', e);
          return { statusCode: 500, body: JSON.stringify({ error: 'Database error' }) };
        }
      }

      // GET: Store Login (Public endpoint for store authentication)
      if (action === 'store_login') {
        const storeId = queryStringParameters?.storeId;
        const username = queryStringParameters?.username;
        const password = queryStringParameters?.password;

        if (!username || !password) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Username and password required' }) };
        }

        try {
          console.log('🔐 Store login attempt for username:', username, 'storeId:', storeId);

          // ค้นหาร้านจาก username (และ storeId ถ้ามี)
          let query = "SELECT id, shop_name, owner_name, username, password, package_type, status, serial_key, expiry_date, opened_at, menu_permissions FROM store_registrations WHERE username = $1";
          let params = [username];

          if (storeId) {
            query += " AND id = $2";
            params.push(parseInt(storeId));
          }

          const storeResult = await client.query(query, params);

          if (storeResult.rows.length === 0) {
            console.warn('⚠️ Username not found:', username);
            return { statusCode: 401, body: JSON.stringify({ error: 'Invalid username or password' }) };
          }

          const store = storeResult.rows[0];

          // ตรวจสอบ password (plain text สำหรับตอนนี้ - ควร hash ในอนาคต)
          if (store.password !== password) {
            console.warn('⚠️ Invalid password for:', username);
            return { statusCode: 401, body: JSON.stringify({ error: 'Invalid username or password' }) };
          }

          // ตรวจสอบสถานะร้าน
          if (!['active', 'ready_to_open', 'approved'].includes(store.status)) {
            console.warn('⚠️ Store status not allowed:', store.status);
            return { statusCode: 403, body: JSON.stringify({ error: 'Store is not active' }) };
          }

          // ตรวจสอบว่าหมดอายุหรือไม่
          if (store.expiry_date) {
            const now = new Date();
            const expiry = new Date(store.expiry_date);
            if (now >= expiry) {
              console.warn('⚠️ Store expired');
              return { statusCode: 403, body: JSON.stringify({ error: 'Store subscription expired' }) };
            }
          }

          console.log('✅ Login successful for:', store.shop_name);

          // ดึง Permissions จากร้านก่อน ถ้าไม่มีใช้ค่า default จาก package
          let permissions = [];

          // ใช้ menu_permissions ของร้านถ้ามี (Manager กำหนดไว้ตอนเปิดร้าน)
          if (store.menu_permissions && Array.isArray(store.menu_permissions) && store.menu_permissions.length > 0) {
            permissions = store.menu_permissions;
            console.log('⚙️ Using store menu_permissions:', permissions);
          } else {
            // Fallback: ใช้ค่า default ตาม package type
            try {
              const permResult = await client.query(
                "SELECT setting_value FROM package_settings WHERE setting_key = $1",
                [`package_permissions_${store.package_type}`]
              );

              if (permResult.rows.length > 0) {
                permissions = JSON.parse(permResult.rows[0].setting_value);
                console.log('⚙️ Loaded permissions for', store.package_type, ':', permissions);
              } else {
                // Default permissions ถ้าไม่มีในฐานข้อมูล
                permissions = store.package_type === 'premium'
                  ? ['dashboard', 'pos', 'orders', 'products', 'stock', 'reports', 'settings']
                  : ['dashboard', 'pos', 'orders', 'products', 'stock'];
                console.log('⚙️ Using default permissions:', permissions);
              }
            } catch (e) {
              console.warn('⚠️ Failed to load permissions:', e.message);
              permissions = ['dashboard', 'pos', 'products']; // Minimal fallback
            }
          }

          // ส่งข้อมูลกลับ (ไม่รวม password)
          return {
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              store: {
                id: store.id,
                shopName: store.shop_name,
                ownerName: store.owner_name,
                username: store.username,
                packageType: store.package_type,
                status: store.status,
                expiryDate: store.expiry_date,
                permissions: permissions
              }
            })
          };
        } catch (e) {
          console.error('❌ Store login error:', e);
          return { statusCode: 500, body: JSON.stringify({ error: 'Login failed', details: e.message }) };
        }
      }

      // GET: ดึงข้อมูลทั้งหมดสำหรับ Manager Store
      if (action === 'get_all_data') {
        try {
          // ดึงจาก store_registrations (table ที่ signup.js ใส่ข้อมูล)
          const registrationsRes = await client.query("SELECT * FROM store_registrations ORDER BY registered_at DESC");
          const keysRes = await client.query("SELECT * FROM serial_keys ORDER BY created_at DESC");

          // Map field names ให้ตรงกับ frontend (camelCase)
          const allRegistrations = registrationsRes.rows.map(row => ({
            id: row.id,
            shopName: row.shop_name,
            shop_name: row.shop_name,
            ownerName: row.owner_name,
            owner_name: row.owner_name,
            username: row.owner_name,
            shopAge: row.shop_age,
            shopLink: row.shop_link,
            packageType: row.package_type,
            package_type: row.package_type,
            status: row.status,
            serialKey: row.serial_key,
            serial_key: row.serial_key,
            expiryDate: row.expiry_date,
            expiry_date: row.expiry_date,
            openedAt: row.opened_at,
            opened_at: row.opened_at,
            registeredAt: row.registered_at,
            registered_at: row.registered_at,
            contacts: {
              line: row.contact_line,
              facebook: row.contact_facebook,
              phone: row.contact_phone
            }
          }));

          const pendingRegistrations = allRegistrations.filter(s => s.status === 'pending');
          // รวมร้านที่ approved (รอใส่ Key) และ ready_to_open (มี Key แล้ว รอเปิด)
          const approvedStores = allRegistrations.filter(s => s.status === 'approved' || s.status === 'ready_to_open');
          const activeStores = allRegistrations.filter(s => ['active', 'paused', 'expired'].includes(s.status));

          // Try to get payments and channels (may not exist yet)
          let paymentsRows = [];
          let channelsRows = [];
          try {
            const paymentsRes = await client.query("SELECT * FROM payment_history ORDER BY submitted_at DESC LIMIT 100");
            paymentsRows = paymentsRes.rows;
          } catch (e) { /* table may not exist */ }

          try {
            const channelsRes = await client.query("SELECT * FROM payment_channels WHERE is_active = true ORDER BY display_order ASC");
            channelsRows = channelsRes.rows;
          } catch (e) { /* table may not exist */ }

          console.log('✅ get_all_data: Registrations:', pendingRegistrations.length, 'Keys:', keysRes.rows.length);

          return {
            statusCode: 200,
            body: JSON.stringify({
              storeRegistrations: pendingRegistrations,
              pendingStores: approvedStores,
              activeStores: activeStores,
              serialKeys: keysRes.rows,
              paymentHistory: paymentsRows,
              paymentChannels: channelsRows
            })
          };
        } catch (e) {
          console.error('Get all data error:', e);
          // Return error with details so frontend can show proper message
          return {
            statusCode: 500,
            body: JSON.stringify({
              error: 'Database error - tables may not exist. Please run SQL schema first.',
              details: e.message,
              storeRegistrations: [],
              pendingStores: [],
              activeStores: [],
              serialKeys: [],
              paymentHistory: [],
              paymentChannels: []
            })
          };
        }
      }
    }

    // --- POST METHODS ---
    if (httpMethod === 'POST') {
      const data = JSON.parse(body);
      const action = data.action;

      // 1. สร้าง Serial Key
      if (action === 'create_serial_key') {
        const { key, duration, durationDays } = data;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (durationDays || duration || 15));

        await client.query(
          "INSERT INTO serial_keys (key_code, duration_days, expiry_date, status) VALUES ($1, $2, $3, 'unused')",
          [key, durationDays || duration || 15, expiryDate]
        );
        return { statusCode: 201, body: JSON.stringify({ message: 'Serial Key created', key, expiryDate }) };
      }

      // 2. อนุมัติร้านค้า (ส่งไปรอใส่ Serial Key)
      if (action === 'approve_store') {
        const { storeId, packageType } = data;
        // Update store_registrations table (table ที่ signup.js ใช้)
        await client.query(
          "UPDATE store_registrations SET status = 'approved', package_type = $1 WHERE id = $2",
          [packageType || 'standard', storeId]
        );
        console.log('✅ Store approved:', storeId, 'Package:', packageType);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store approved', storeId }) };
      }

      // 3. ปฏิเสธร้านค้า (ส่งไปประวัติ)
      if (action === 'reject_store') {
        const { storeId } = data;
        // Update store_registrations table
        await client.query(
          "UPDATE store_registrations SET status = 'rejected' WHERE id = $1",
          [storeId]
        );
        console.log('❌ Store rejected:', storeId);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store rejected', storeId }) };
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

      // 6. ตั้งค่า Username/Password (สำหรับ Manager กำหนดให้ร้านค้า)
      if (action === 'set_store_credentials') {
        const { storeId, username, password } = data;
        if (!username || username.length < 4) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid username (min 4 chars)' }) };
        }
        if (!password || password.length < 6) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid password (min 6 chars)' }) };
        }

        // Generate store URL slug from username
        const storeUrlSlug = username.toLowerCase().replace(/[^a-z0-9]/g, '');

        await client.query(
          `UPDATE store_registrations 
           SET username = $1, password = $2, store_url_slug = $3, status = CASE WHEN status = 'ready_to_open' THEN 'active' ELSE status END
           WHERE id = $4`,
          [username, password, storeUrlSlug, storeId]
        );

        console.log('✅ Credentials set for store:', storeId, 'Username:', username);
        return { statusCode: 200, body: JSON.stringify({ message: 'Store credentials set', username, storeUrlSlug }) };
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

      // 17. ใส่ Serial Key ให้ร้านที่อนุมัติแล้ว และเปลี่ยนสถานะเป็น ready_to_open
      if (action === 'assign_serial_key') {
        const { storeId, serialKeyId } = data;
        if (!storeId || !serialKeyId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID and Serial Key ID required' }) };
        }

        const keyRes = await client.query("SELECT * FROM serial_keys WHERE id = $1 AND status = 'unused'", [serialKeyId]);
        if (keyRes.rows.length === 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or used Serial Key' }) };
        }

        const keyData = keyRes.rows[0];
        await client.query('BEGIN');
        try {
          // อัพเดทร้านค้าให้ใส่ Serial Key และเปลี่ยนสถานะเป็น ready_to_open
          await client.query(
            "UPDATE store_registrations SET serial_key = $1, expiry_date = $2, status = 'ready_to_open' WHERE id = $3",
            [keyData.key_code, keyData.expiry_date, storeId]
          );
          // อัพเดทสถานะ Serial Key
          await client.query(
            "UPDATE serial_keys SET status = 'assigned', used_at = NOW(), used_by_store_id = $1 WHERE id = $2",
            [storeId, serialKeyId]
          );
          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Serial Key assigned', serialKey: keyData.key_code, status: 'ready_to_open' }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }

      // 17.5 เปิดร้านค้า (Activate Store) - เปลี่ยน status เป็น active
      if (action === 'activate_store') {
        const { storeId } = data;
        if (!storeId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID required' }) };
        }

        // ตรวจสอบว่าร้านมีอยู่และมี Serial Key แล้ว
        const storeRes = await client.query(
          "SELECT * FROM store_registrations WHERE id = $1",
          [storeId]
        );
        if (storeRes.rows.length === 0) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
        }

        const store = storeRes.rows[0];
        if (!store.serial_key) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store must have Serial Key first' }) };
        }

        // อัพเดทสถานะเป็น active
        await client.query(
          "UPDATE store_registrations SET status = 'active', opened_at = NOW() WHERE id = $1",
          [storeId]
        );

        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Store activated successfully',
            status: 'active',
            storeId: storeId
          })
        };
      }

      // 18. ส่งต่อร้านค้าไปเมนู "เปิดร้านค้าใหม่"
      if (action === 'forward_to_open') {
        const { storeId } = data;
        if (!storeId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID required' }) };
        }

        // ตรวจสอบว่าร้านมี Serial Key แล้วหรือยัง
        const storeRes = await client.query("SELECT serial_key FROM stores WHERE id = $1", [storeId]);
        if (storeRes.rows.length === 0) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
        }
        if (!storeRes.rows[0].serial_key) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store must have Serial Key first' }) };
        }

        await client.query(
          "UPDATE stores SET ready_to_open = true, forwarded_at = NOW() WHERE id = $1",
          [storeId]
        );
        return { statusCode: 200, body: JSON.stringify({ message: 'Store forwarded to Open New Store' }) };
      }

      // 19. ส่งคำขอชำระเงินไปยังร้านค้า
      if (action === 'send_payment_request') {
        const { storeId, amount, message, dueDate } = data;
        if (!storeId || !amount || amount <= 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID and valid amount required' }) };
        }

        const result = await client.query(`
          INSERT INTO payment_requests (store_id, amount, message, due_date, status)
          VALUES ($1, $2, $3, $4, 'pending')
          RETURNING *
        `, [storeId, amount, message || null, dueDate || null]);

        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Payment request sent', request: result.rows[0] })
        };
      }

      // 20. ดึงร้านค้าทั้งหมดสำหรับ dropdown (Payment Stores)
      if (action === 'get_all_stores_dropdown') {
        const result = await client.query(`
          SELECT id, shop_name, package_type, status, expiry_date 
          FROM stores 
          WHERE status IN ('active', 'paused', 'expired')
          ORDER BY shop_name ASC
        `);
        return { statusCode: 200, body: JSON.stringify(result.rows) };
      }

      // 21. เปิดร้านค้าใหม่ (Final Step - เปลี่ยน status เป็น active)
      if (action === 'activate_store') {
        const { storeId } = data;
        if (!storeId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID required' }) };
        }

        const storeRes = await client.query("SELECT * FROM stores WHERE id = $1", [storeId]);
        if (storeRes.rows.length === 0) {
          return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
        }

        const store = storeRes.rows[0];
        if (!store.serial_key) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store must have Serial Key' }) };
        }

        await client.query('BEGIN');
        try {
          // เปิดร้านค้า
          await client.query(
            "UPDATE stores SET status = 'active', opened_at = NOW(), ready_to_open = false WHERE id = $1",
            [storeId]
          );

          // อัพเดท Serial Key status เป็น used
          await client.query(
            "UPDATE serial_keys SET status = 'used' WHERE key_code = $1",
            [store.serial_key]
          );

          // สร้าง default settings สำหรับร้านค้าใหม่
          const defaultSettings = [
            { key: 'shop_name', value: JSON.stringify(store.shop_name || 'ร้านค้าใหม่') },
            { key: 'shop_slogan', value: JSON.stringify('') },
            { key: 'theme', value: JSON.stringify({ primaryColor: '#8B5CF6', mode: 'dark' }) },
            { key: 'language', value: JSON.stringify('th') }
          ];

          for (const setting of defaultSettings) {
            await client.query(`
              INSERT INTO store_settings (store_id, setting_key, setting_value)
              VALUES ($1, $2, $3)
              ON CONFLICT (store_id, setting_key) DO UPDATE SET setting_value = $3
            `, [storeId, setting.key, setting.value]);
          }

          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Store activated successfully' }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
      }

      // 22. อัพเดท Serial Key ของร้านค้า (Edit)
      if (action === 'update_store_serial_key') {
        const { storeId, newSerialKeyId } = data;
        if (!storeId || !newSerialKeyId) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Store ID and new Serial Key ID required' }) };
        }

        const keyRes = await client.query("SELECT * FROM serial_keys WHERE id = $1 AND status = 'unused'", [newSerialKeyId]);
        if (keyRes.rows.length === 0) {
          return { statusCode: 400, body: JSON.stringify({ error: 'Invalid or used Serial Key' }) };
        }

        const keyData = keyRes.rows[0];
        const storeRes = await client.query("SELECT serial_key, expiry_date FROM stores WHERE id = $1", [storeId]);

        await client.query('BEGIN');
        try {
          // ปล่อย Serial Key เก่า (ถ้ามี)
          if (storeRes.rows[0]?.serial_key) {
            await client.query(
              "UPDATE serial_keys SET status = 'unused', used_at = NULL, used_by_store_id = NULL WHERE key_code = $1",
              [storeRes.rows[0].serial_key]
            );
          }

          // คำนวณ expiry_date ใหม่ (ต่อจากวันหมดอายุเดิม หรือวันนี้)
          let baseDate = new Date();
          if (storeRes.rows[0]?.expiry_date && new Date(storeRes.rows[0].expiry_date) > baseDate) {
            baseDate = new Date(storeRes.rows[0].expiry_date);
          }
          baseDate.setDate(baseDate.getDate() + keyData.duration_days);

          // อัพเดทร้านค้า
          await client.query(
            "UPDATE stores SET serial_key = $1, expiry_date = $2, status = 'active', is_locked = false WHERE id = $3",
            [keyData.key_code, baseDate, storeId]
          );

          // อัพเดท Serial Key ใหม่
          await client.query(
            "UPDATE serial_keys SET status = 'used', used_at = NOW(), used_by_store_id = $1 WHERE id = $2",
            [storeId, newSerialKeyId]
          );

          await client.query('COMMIT');
          return { statusCode: 200, body: JSON.stringify({ message: 'Store Serial Key updated', newExpiryDate: baseDate }) };
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        }
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

// Export with conditional authentication
// Allow public access to get_store_by_name (for customer store links)
// All other endpoints require authentication
exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters } = event;
  const action = queryStringParameters?.action;

  // Public endpoints (no authentication required)
  const publicActions = ['get_store_by_name', 'store_login'];

  if (httpMethod === 'GET' && publicActions.includes(action)) {
    // Execute handler directly without authentication
    return handler(event, context);
  }

  // All other requests require authentication
  return requireAuth(handler)(event, context);
};