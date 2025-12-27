const { Pool } = require('pg');

// เชื่อมต่อฐานข้อมูลโดยใช้ Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // จำเป็นสำหรับ Neon.tech
    }
});

exports.handler = async (event, context) => {
    // รองรับเฉพาะ method POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const {
            shopName, shopAge, shopLink,
            username, password,
            contacts, packageType,
            registeredAt, status
        } = data;

        // ตรวจสอบข้อมูลเบื้องต้น
        if (!shopName || !username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        const client = await pool.connect();

        try {
            // 1. สร้างตารางถ้ายังไม่มี (Create Table if not exists)
            // ข้อควรระวัง: ใน Production จริง ควรทำ Migration แยกต่างหาก แต่ใส่ไว้ที่นี่เพื่อความสะดวกในการเริ่มระบบใหม่
            await client.query(`
            CREATE TABLE IF NOT EXISTS store_registrations (
                id SERIAL PRIMARY KEY,
                shop_name TEXT NOT NULL,
                shop_age TEXT,
                shop_link TEXT,
                owner_name TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                package_type TEXT,
                status TEXT DEFAULT 'pending',
                serial_key TEXT,
                expiry_date TIMESTAMPTZ,
                opened_at TIMESTAMPTZ,
                registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                contact_line TEXT,
                contact_facebook TEXT,
                contact_phone TEXT
            )
        `);

            // 2. Insert ข้อมูลลงตาราง
            const query = `
            INSERT INTO store_registrations 
            (shop_name, shop_age, shop_link, owner_name, password, package_type, status, registered_at, contact_line, contact_facebook, contact_phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `;

            const values = [
                shopName,
                shopAge,
                shopLink,
                username,
                password, // หมายเหตุ: ในระบบจริงควร Hash Password ก่อนบันทึก
                packageType,
                status || 'pending',
                registeredAt || new Date().toISOString(),
                contacts?.line || '',
                contacts?.facebook || '',
                contacts?.phone || ''
            ];

            const res = await client.query(query, values);

            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, data: res.rows[0] }),
            };

        } finally {
            client.release(); // คืน connection กลับเข้า pool
        }

    } catch (error) {
        console.error('Signup Error:', error);

        // จัดการ Error กรณี Username ซ้ำ (Unique constraint violation)
        if (error.code === '23505') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Username นี้ถูกใช้งานแล้ว' }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database error', details: error.message }),
        };
    }
};