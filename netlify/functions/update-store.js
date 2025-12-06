// Backend API สำหรับจัดการสถานะร้านค้า
// รองรับ 3 actions: approve, assign-key, open-store

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// เชื่อมต่อฐานข้อมูล Neon PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://username:password@ep-test.us-east-1.aws.neon.tech/warishayday',
    ssl: {
        rejectUnauthorized: false
    }
});

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parse request body
        const requestData = JSON.parse(event.body || '{}');
        const { action } = requestData;
        
        console.log('🔄 Update Store Action:', action, requestData);

        let result;

        switch (action) {
            case 'approve':
                result = await approveStore(requestData);
                break;
            case 'assign-key':
                result = await assignSerialKey(requestData);
                break;
            case 'open-store':
                result = await openStore(requestData);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        console.log('✅ Success:', result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `Action ${action} completed successfully`,
                data: result
            })
        };

    } catch (error) {
        console.error('❌ Error in update-store:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: error.details || null
            })
        };

    } finally {
        // Close database connection
        await pool.end();
    }
};

// ===== Action 1: Approve Store Registration =====
async function approveStore(data) {
    const { id, packageType, status } = data;
    
    if (!id || !packageType) {
        throw new Error('Missing required fields: id, packageType');
    }

    const query = `
        UPDATE store_registrations 
        SET 
            status = $1,
            package_type = $2,
            approved_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
    `;

    const values = [status || 'approved', packageType, id];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
        throw new Error(`Store registration with ID ${id} not found`);
    }

    console.log('✅ Store approved:', result.rows[0]);
    return result.rows[0];
}

// ===== Action 2: Assign Serial Key =====
async function assignSerialKey(data) {
    const { storeId, serialKeyId, serialKey, expiryDate } = data;
    
    if (!storeId || !serialKey) {
        throw new Error('Missing required fields: storeId, serialKey');
    }

    // Start transaction
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Update store registration with serial key
        const updateStoreQuery = `
            UPDATE store_registrations 
            SET 
                serial_key = $1,
                serial_key_expiry = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *;
        `;
        
        const storeResult = await client.query(updateStoreQuery, [serialKey, expiryDate, storeId]);
        
        if (storeResult.rows.length === 0) {
            throw new Error(`Store with ID ${storeId} not found`);
        }

        // Update serial key status to used (if serialKeyId provided)
        if (serialKeyId) {
            const updateKeyQuery = `
                UPDATE serial_keys 
                SET 
                    status = 'used',
                    used_by_store_id = $1,
                    used_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *;
            `;
            
            const keyResult = await client.query(updateKeyQuery, [storeId, serialKeyId]);
            
            if (keyResult.rows.length === 0) {
                throw new Error(`Serial key with ID ${serialKeyId} not found`);
            }
        }

        await client.query('COMMIT');
        
        console.log('✅ Serial key assigned:', storeResult.rows[0]);
        return storeResult.rows[0];

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// ===== Action 3: Open New Store =====
async function openStore(data) {
    const { storeId, username, password, status, openedAt } = data;
    
    if (!storeId || !username || !password) {
        throw new Error('Missing required fields: storeId, username, password');
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        UPDATE store_registrations 
        SET 
            username = $1,
            password = $2,
            status = $3,
            opened_at = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
    `;

    const values = [username, hashedPassword, status || 'active', openedAt || new Date().toISOString(), storeId];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
        throw new Error(`Store with ID ${storeId} not found`);
    }

    console.log('✅ Store opened:', result.rows[0]);
    return result.rows[0];
}