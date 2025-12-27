// netlify/functions/save-data.js
const requireAuth = require('./auth-middleware');
const db = require('./database');
const bcrypt = require('bcryptjs');

// ===== START: HELPER FUNCTION (Deep Merge) =====
// ฟังก์ชันนี้ช่วยในการ "ผสาน" object ที่ซับซ้อน
const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const deepMerge = (target, source) => {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};
// ===== END: HELPER FUNCTION (Deep Merge) =====


const handler = async (event, context) => {
  const { user } = event; // User info from JWT

  try {
    const data = JSON.parse(event.body);

    // Using a transaction to ensure all updates succeed or none do
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // ===== START: MODIFICATION (Merge settings instead of overwrite) =====
      // 1. Update Shop Settings - Any authenticated admin can do this.
      if (data.shopSettings) {
        // 1. ดึงข้อมูลการตั้งค่าปัจจุบันจาก DB
        const result = await client.query('SELECT settings_json FROM shop_settings WHERE id = 1');
        let currentSettings = result.rows[0]?.settings_json || {};

        // 2. ผสาน (Merge) ข้อมูลใหม่ (data.shopSettings) เข้ากับข้อมูลปัจจุบัน
        const newSettings = deepMerge(currentSettings, data.shopSettings);

        // 3. บันทึกข้อมูลที่ผสานแล้วกลับไป
        await client.query('UPDATE shop_settings SET settings_json = $1 WHERE id = 1', [JSON.stringify(newSettings)]);
      }
      // ===== END: MODIFICATION =====

      // 2. Sync Sub-Admins (Only Super Admins should do this)
      if (user.isSuperAdmin && data.subAdmins) {
        for (const subAdmin of data.subAdmins) {
          const passwordHash = subAdmin.password ? await bcrypt.hash(subAdmin.password, 10) : null;
          if (subAdmin.id && subAdmin.id > 0) { // Existing user
            if (passwordHash) { // Password is being updated
              await client.query('UPDATE users SET username=$1, name=$2, pin_hash=$3, permissions=$4 WHERE id=$5',
                [subAdmin.username, subAdmin.name, passwordHash, JSON.stringify(subAdmin.permissions), subAdmin.id]);
            } else { // Password not being updated
              await client.query('UPDATE users SET username=$1, name=$2, permissions=$3 WHERE id=$4',
                [subAdmin.username, subAdmin.name, JSON.stringify(subAdmin.permissions), subAdmin.id]);
            }
          } else { // New user
            await client.query('INSERT INTO users (username, name, pin_hash, is_super_admin, permissions) VALUES ($1, $2, $3, FALSE, $4)',
              [subAdmin.username, subAdmin.name, passwordHash, JSON.stringify(subAdmin.permissions)]);
          }
        }
      }

      // 3. Update Super Admin PIN (Only a Super Admin can change their own PIN)
      if (user.isSuperAdmin && data.adminPin) {
        const newPinHash = await bcrypt.hash(data.adminPin, 10);
        await client.query('UPDATE users SET pin_hash = $1 WHERE is_super_admin = TRUE', [newPinHash]);
      }

      await client.query('COMMIT');

    } catch (e) {
      await client.query('ROLLBACK');
      throw e; // Throw error to be caught by the outer catch block
    } finally {
      client.release();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved successfully.' }),
    };
  } catch (error) {
    console.error('Error in save-data function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save data.' }),
    };
  }
};

exports.handler = requireAuth(handler);
