// netlify/functions/orders-api.js
const db = require('./database');

exports.handler = async (event, context) => {
  const { httpMethod } = event;
  const queryParams = event.queryStringParameters || {};
  const id = queryParams.id;

  // Common headers เพื่อรองรับ CORS (ให้ยิงมาจากหน้าเว็บได้โดยไม่ติด permission)
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // รองรับ Preflight request
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    switch (httpMethod) {
      case 'POST':
        // สร้างออเดอร์ใหม่ (ลูกค้าทั่วไปใช้ได้ ไม่ต้องล็อกอิน)
        return await createOrder(JSON.parse(event.body), headers);
      
      case 'PUT':
        // อัพเดทสถานะ (เช่น กดยืนยัน หรือ ยกเลิก)
        if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Order ID is required for updates.' }) };
        return await updateOrder(id, JSON.parse(event.body), headers);

      case 'DELETE':
        // ลบออเดอร์
        if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Order ID is required for deletion.' }) };
        return await deleteOrder(id, headers);

      default:
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }
  } catch (error) {
    console.error('Error in orders-api function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `An internal server error occurred: ${error.message}` }),
    };
  }
};

// --- ฟังก์ชันสร้างออเดอร์ใหม่ (พร้อมระบบ Retry ป้องกันเลขซ้ำ) ---
async function createOrder(orderData, headers) {
  // ตรวจสอบข้อมูลเบื้องต้น
  if (!orderData || !orderData.id || !orderData.items || typeof orderData.total === 'undefined') {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid order data provided.' }) };
  }

  const client = await db.pool.connect();
  
  try {
    // ฟังก์ชันย่อยสำหรับบันทึกลงฐานข้อมูล
    const tryInsert = async (orderIdToUse) => {
      const insertOrderQuery = `
        INSERT INTO orders (order_id, timestamp, total, items, status, promo_applied)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      
      // แปลงข้อมูลเป็น JSON string ถ้าจำเป็น (ป้องกัน error กับฐานข้อมูลบางประเภท)
      const itemsJson = typeof orderData.items === 'object' ? JSON.stringify(orderData.items) : orderData.items;
      const promoJson = orderData.promoApplied ? (typeof orderData.promoApplied === 'object' ? JSON.stringify(orderData.promoApplied) : orderData.promoApplied) : null;

      await client.query(insertOrderQuery, [
        orderIdToUse,
        orderData.timestamp,
        orderData.total,
        itemsJson,
        'new', // สถานะเริ่มต้นคือ 'new' เสมอ
        promoJson
      ]);
    };

    // --- RETRY LOGIC (หัวใจสำคัญ) ---
    // พยายามบันทึก ถ้าเจอเลขซ้ำ (Error Code 23505) ให้เติมเลขสุ่มต่อท้ายแล้วลองใหม่
    let attempts = 0;
    const maxAttempts = 5;
    let currentId = orderData.id;
    let success = false;

    while (attempts < maxAttempts && !success) {
      try {
        await tryInsert(currentId);
        success = true; // ถ้าบันทึกผ่าน บรรทัดนี้จะทำงานและหลุด loop
      } catch (err) {
        // เช็ค error code '23505' (Unique Violation / Duplicate Key) ของ PostgreSQL
        if (err.code === '23505') {
          attempts++;
          console.warn(`Duplicate Order ID: ${currentId}. Retrying attempt ${attempts}...`);
          
          // สร้าง ID ใหม่โดยการเติมตัวเลขสุ่ม เช่น จาก WHD.../8888 เป็น WHD.../8888-123
          // เพื่อให้บันทึกได้แน่นอน ไม่ต้องให้ลูกค้ากดใหม่
          const randomSuffix = Math.floor(Math.random() * 1000);
          currentId = `${orderData.id}-${randomSuffix}`; 
        } else {
          throw err; // ถ้าเป็น error อื่น (เช่น ต่อ DB ไม่ได้) ให้โยน error ออกไปปกติ
        }
      }
    }

    if (!success) {
      throw new Error('Failed to generate a unique Order ID after multiple attempts.');
    }
    // --- จบ RETRY LOGIC ---

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        message: 'Order created successfully.',
        orderId: currentId // ส่งเลข Order จริงที่บันทึกได้กลับไป
      }),
    };

  } catch (err) {
    console.error('Create Order Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save order: ' + err.message }) };
  } finally {
    client.release();
  }
}

// --- ฟังก์ชันอัพเดทสถานะออเดอร์ ---
async function updateOrder(orderId, updateData, headers) {
  const { status } = updateData;
  if (!status) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Status is required for update.' }) };
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // ล็อกแถวข้อมูลเพื่อป้องกันการอัพเดทชนกัน
    const { rows } = await client.query('SELECT status, items FROM orders WHERE order_id = $1 FOR UPDATE', [orderId]);
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order not found.' }) };
    }

    const currentStatus = rows[0].status;
    
    let items = rows[0].items;
    if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch(e) {}
    }

    // ตัดสต็อกเฉพาะเมื่อเปลี่ยนสถานะจาก 'new' -> 'active' (ยืนยันออเดอร์)
    if (currentStatus === 'new' && status === 'active') {
      for (const productId in items) {
        const quantity = items[productId];
        if (quantity > 0) {
          const updateStockQuery = `
            UPDATE products 
            SET stock = stock - $1 
            WHERE id = $2 AND stock != -1
          `;
          await client.query(updateStockQuery, [quantity, parseInt(productId)]);
        }
      }
    }
    
    const updateStatusQuery = 'UPDATE orders SET status = $1 WHERE order_id = $2';
    await client.query(updateStatusQuery, [status, orderId]);

    await client.query('COMMIT');
    return { statusCode: 200, headers, body: JSON.stringify({ message: `Order ${orderId} status updated to ${status}.` }) };

  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Update Order Error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to update order: ' + e.message }) };
  } finally {
    client.release();
  }
}

// --- ฟังก์ชันลบออเดอร์ ---
async function deleteOrder(orderId, headers) {
  const client = await db.pool.connect();
  try {
    const result = await client.query('DELETE FROM orders WHERE order_id = $1', [orderId]);
    if (result.rowCount === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Order not found.' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ message: `Order ${orderId} deleted.` }) };
  } catch (err) {
    console.error('Delete Order Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to delete order: ' + err.message }) };
  } finally {
    client.release();
  }
}
