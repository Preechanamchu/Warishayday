// netlify/functions/package-settings-api.js
// API for Package Settings CRUD (Save to Database)

const requireAuth = require('./auth-middleware');
const db = require('./database');

const handler = async (event, context) => {
    const { user } = event;
    const method = event.httpMethod;

    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle OPTIONS for CORS
    if (method === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // ===== GET: Fetch all package settings =====
        if (method === 'GET') {
            const result = await db.query(
                'SELECT * FROM package_settings ORDER BY package_type'
            );

            const packages = {
                standard: null,
                premium: null
            };

            result.rows.forEach(row => {
                packages[row.package_type] = {
                    id: row.id,
                    name: row.name,
                    price: parseFloat(row.price),
                    details: row.details || '',
                    permissions: row.permissions || {},
                    subAdmins: row.sub_admins_limit,
                    themes: row.themes_limit,
                    effects: row.has_effects,
                    reports: row.reports_type
                };
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, packages })
            };
        }

        // ===== POST/PUT: Update package settings =====
        if (method === 'POST' || method === 'PUT') {
            // Only Super Admin can update package settings
            if (!user.isSuperAdmin) {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({ error: 'Forbidden: Only super admin can update package settings' })
                };
            }

            const data = JSON.parse(event.body);
            const { packageType, name, price, details, permissions } = data;

            if (!packageType || !['standard', 'premium'].includes(packageType)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid package type. Must be "standard" or "premium".' })
                };
            }

            // Update or Insert (Upsert)
            const result = await db.query(`
                INSERT INTO package_settings (package_type, name, price, details, permissions, updated_at)
                VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
                ON CONFLICT (package_type) 
                DO UPDATE SET 
                    name = EXCLUDED.name,
                    price = EXCLUDED.price,
                    details = EXCLUDED.details,
                    permissions = EXCLUDED.permissions,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
            `, [
                packageType,
                name || (packageType === 'premium' ? 'Premium' : 'Standard'),
                price || 0,
                details || '',
                JSON.stringify(permissions || {})
            ]);

            const updatedPackage = result.rows[0];

            console.log(`✅ Package settings updated: ${packageType}`, {
                name: updatedPackage.name,
                price: updatedPackage.price
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: `Package "${packageType}" saved successfully.`,
                    package: {
                        id: updatedPackage.id,
                        name: updatedPackage.name,
                        price: parseFloat(updatedPackage.price),
                        details: updatedPackage.details,
                        permissions: updatedPackage.permissions
                    }
                })
            };
        }

        // Method not allowed
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error in package-settings-api:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};

// Export with auth middleware for POST/PUT, but allow public GET
exports.handler = async (event, context) => {
    if (event.httpMethod === 'GET') {
        // Public GET - no auth required (for customer view)
        return handler(event, context);
    }
    // Protected POST/PUT - requires auth
    return requireAuth(handler)(event, context);
};
