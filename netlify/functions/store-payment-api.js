// netlify/functions/store-payment-api.js
// API สำหรับร้านค้าลูกในการจัดการ Payment
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

    // ตรวจสอบว่าเป็น Store Owner หรือไม่
    const storeId = user?.storeId;
    if (!storeId && !user?.isSuperAdmin) {
        return { statusCode: 403, body: JSON.stringify({ error: 'Store access required' }) };
    }

    const client = await pool.connect();

    try {
        // --- GET METHODS ---
        if (httpMethod === 'GET') {
            const action = queryStringParameters?.action;

            // 1. ดึงรายการคำขอชำระเงินที่เจ้าของระบบส่งมา
            if (action === 'get_payment_requests') {
                const result = await client.query(`
          SELECT pr.*, pc.channel_name, pc.channel_type, pc.account_number, pc.account_name
          FROM payment_requests pr
          LEFT JOIN payment_channels pc ON pc.is_active = true
          WHERE pr.store_id = $1
          ORDER BY pr.created_at DESC
        `, [storeId]);
                return { statusCode: 200, body: JSON.stringify(result.rows) };
            }

            // 2. ดึงประวัติการชำระเงิน
            if (action === 'get_payment_history') {
                const result = await client.query(`
          SELECT * FROM payment_history
          WHERE store_id = $1
          ORDER BY submitted_at DESC
          LIMIT 50
        `, [storeId]);
                return { statusCode: 200, body: JSON.stringify(result.rows) };
            }

            // 3. ดึงช่องทางชำระเงินจากเจ้าของระบบ
            if (action === 'get_payment_channels') {
                const result = await client.query(`
          SELECT * FROM payment_channels
          WHERE is_active = true
          ORDER BY display_order ASC
        `);
                return { statusCode: 200, body: JSON.stringify(result.rows) };
            }

            // 4. ดึงสถานะร้านค้า (เวลาคงเหลือ, สถานะการล็อค)
            if (action === 'get_store_status') {
                const result = await client.query(`
          SELECT id, shop_name, expiry_date, status, is_locked, package_type
          FROM stores WHERE id = $1
        `, [storeId]);

                if (result.rows.length === 0) {
                    return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
                }

                const store = result.rows[0];
                const now = new Date();
                const expiryDate = new Date(store.expiry_date);
                const isExpired = expiryDate < now;
                const remainingMs = expiryDate - now;

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        ...store,
                        isExpired,
                        remainingMs: remainingMs > 0 ? remainingMs : 0,
                        needsPayment: isExpired || store.is_locked
                    })
                };
            }

            // 5. ดึงข้อมูลทั้งหมดสำหรับหน้า Payment
            if (action === 'get_all_payment_data') {
                const [requests, history, channels, store] = await Promise.all([
                    client.query(`SELECT * FROM payment_requests WHERE store_id = $1 AND status = 'pending' ORDER BY created_at DESC`, [storeId]),
                    client.query(`SELECT * FROM payment_history WHERE store_id = $1 ORDER BY submitted_at DESC LIMIT 20`, [storeId]),
                    client.query(`SELECT * FROM payment_channels WHERE is_active = true ORDER BY display_order ASC`),
                    client.query(`SELECT id, shop_name, expiry_date, status, is_locked, package_type FROM stores WHERE id = $1`, [storeId])
                ]);

                const storeData = store.rows[0] || {};
                const expiryDate = new Date(storeData.expiry_date);
                const now = new Date();

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        requests: requests.rows,
                        history: history.rows,
                        channels: channels.rows,
                        store: {
                            ...storeData,
                            isExpired: expiryDate < now,
                            remainingMs: Math.max(0, expiryDate - now)
                        }
                    })
                };
            }
        }

        // --- POST METHODS ---
        if (httpMethod === 'POST') {
            const data = JSON.parse(body);
            const action = data.action;

            // 1. ส่งหลักฐานการชำระเงิน
            if (action === 'submit_payment') {
                const { requestId, amount, paymentMethod, proofImage, transactionRef, notes } = data;

                if (!amount || amount <= 0) {
                    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
                }

                // บันทึกหลักฐานการชำระเงิน
                const result = await client.query(`
          INSERT INTO payment_history (store_id, amount, payment_method, proof_image, transaction_ref, notes)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [storeId, amount, paymentMethod || null, proofImage || null, transactionRef || null, notes || null]);

                // อัพเดทสถานะคำขอชำระเงิน (ถ้ามี)
                if (requestId) {
                    await client.query(`
            UPDATE payment_requests SET status = 'responded', responded_at = NOW()
            WHERE id = $1 AND store_id = $2
          `, [requestId, storeId]);
                }

                return {
                    statusCode: 201,
                    body: JSON.stringify({
                        message: 'Payment proof submitted successfully',
                        payment: result.rows[0]
                    })
                };
            }

            // 2. ตรวจสอบและอัพเดทสถานะร้านค้า (ถ้าหมดอายุ)
            if (action === 'check_and_lock_expired') {
                const storeResult = await client.query(`
          SELECT id, expiry_date, status FROM stores WHERE id = $1
        `, [storeId]);

                if (storeResult.rows.length === 0) {
                    return { statusCode: 404, body: JSON.stringify({ error: 'Store not found' }) };
                }

                const store = storeResult.rows[0];
                const now = new Date();
                const expiryDate = new Date(store.expiry_date);

                if (expiryDate < now && store.status !== 'expired') {
                    await client.query(`
            UPDATE stores SET status = 'expired', is_locked = true WHERE id = $1
          `, [storeId]);

                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Store expired and locked', isLocked: true })
                    };
                }

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Store status checked', isLocked: store.status === 'expired' })
                };
            }
        }

        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid Action' }) };

    } catch (error) {
        console.error('Store Payment API Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
    } finally {
        client.release();
    }
};

exports.handler = requireAuth(handler);
