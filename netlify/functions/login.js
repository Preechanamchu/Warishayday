// netlify/functions/login.js
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event, context) => {
    // เพิ่ม Header เพื่อให้รองรับ CORS ในกรณีที่จำเป็น (เผื่อไว้)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        // --- DEBUG 1: ดูข้อมูลที่ส่งเข้ามา ---
        console.log("Login Event Body:", event.body);
        const { username, password } = JSON.parse(event.body);

        console.log(`Attempting login for user: [${username}]`); // ใส่ [] เพื่อดูว่ามีช่องว่างเกินมาไหม

        if (!username || !password) {
            console.log("Missing username or password");
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Username and password are required' }) };
        }

        // ค้นหาผู้ใช้จาก 'username' ในฐานข้อมูล
        // ใช้ TRIM(username) เพื่อตัดช่องว่างที่อาจจะเผลอติดมาใน DB ออกตอนค้นหา (Optional: ถ้าอยากเคร่งครัดให้เอา TRIM ออก)
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

        // --- DEBUG 2: ดูผลลัพธ์จาก DB ---
        console.log(`DB Query found ${result.rows.length} user(s)`);

        if (result.rows.length === 0) {
            console.log(`User [${username}] not found in database.`);
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid username or password (User not found)' }) };
        }

        const user = result.rows[0];

        // --- DEBUG 3: ตรวจสอบ Hash ---
        // หมายเหตุ: อย่า Log รหัสผ่านจริง หรือ Hash ออกมาใน Production จริงๆ นะครับ อันนี้เพื่อ Debug ชั่วคราว
        console.log("User found. ID:", user.id);
        console.log("Stored Hash length:", user.pin_hash ? user.pin_hash.length : 'No hash');

        if (!user.pin_hash) {
             console.error("CRITICAL: User has no password hash in DB!");
             return { statusCode: 500, headers, body: JSON.stringify({ error: 'User account corrupted (no password set)' }) };
        }

        const match = await bcrypt.compare(password, user.pin_hash);

        // --- DEBUG 4: ผลการตรวจสอบรหัสผ่าน ---
        console.log(`Password match result for user [${username}]:`, match);

        if (!match) {
            console.log("Password did not match.");
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid username or password (Password mismatch)' }) };
        }

        // User authenticated, create JWT
        const token = jwt.sign(
            { userId: user.id, name: user.name, isSuperAdmin: user.is_super_admin, permissions: user.permissions },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        console.log("Login successful, token generated.");

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Login successful',
                token,
                user: { name: user.name, isSuperAdmin: user.is_super_admin, permissions: user.permissions }
            }),
        };

    } catch (error) {
        console.error('Login error FULL DETAILS:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'An internal server error occurred.', details: error.message }),
        };
    }
};
