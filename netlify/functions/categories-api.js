// netlify/functions/categories-api.js
const requireAuth = require('./auth-middleware');
const db = require('./database');

const handler = async (event, context) => {
    const { httpMethod, queryStringParameters, body } = event;
    const id = queryStringParameters.id ? parseInt(queryStringParameters.id) : null;
    
    try {
        if (httpMethod === 'POST') { // Create
            const { name, name_en, icon, min_order_quantity, sort_order } = JSON.parse(body);
            // REMOVED: const newId = Date.now(); 
            // Let the database generate the ID itself. This assumes the 'id' column is of type SERIAL or BIGSERIAL.
            await db.query(
                'INSERT INTO categories (name, name_en, icon, min_order_quantity, per_piece_prices, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
                [name, name_en, icon, min_order_quantity, '[]', sort_order]
            );
            return { statusCode: 201, body: JSON.stringify({ message: 'Category created' }) };
        }
        
        if (httpMethod === 'PUT' && id) { // Update
            const { name, name_en, icon, min_order_quantity, per_piece_prices, sort_order } = JSON.parse(body);
            await db.query(
                'UPDATE categories SET name=$1, name_en=$2, icon=$3, min_order_quantity=$4, per_piece_prices=$5, sort_order=$6 WHERE id=$7',
                [name, name_en, icon, min_order_quantity, JSON.stringify(per_piece_prices || []), sort_order, id]
            );
            return { statusCode: 200, body: JSON.stringify({ message: 'Category updated' }) };
        }
        
        if (httpMethod === 'DELETE' && id) { // Delete
            // The ON DELETE CASCADE in the products table will handle deleting associated products.
            await db.query('DELETE FROM categories WHERE id=$1', [id]);
            return { statusCode: 200, body: JSON.stringify({ message: 'Category and its products deleted' }) };
        }

        return { statusCode: 405, body: 'Method Not Allowed' };

    } catch (error) {
        console.error(`Error in categories-api (${httpMethod}):`, error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Database operation failed.' }) };
    }
};

exports.handler = requireAuth(handler);
