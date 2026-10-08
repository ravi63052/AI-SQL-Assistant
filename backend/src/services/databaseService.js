const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL database connected successfully.");

        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

async function executeQuery(sql, params = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}

async function getDatabaseSchema() {
    const [rows] = await pool.execute(
        `
        SELECT
            TABLE_NAME,
            COLUMN_NAME,
            DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME, ORDINAL_POSITION
        `,
        [process.env.DB_NAME]
    );

    const schema = {};

    for (const row of rows) {
        if (!schema[row.TABLE_NAME]) {
            schema[row.TABLE_NAME] = [];
        }

        schema[row.TABLE_NAME].push({
            column: row.COLUMN_NAME,
            type: row.DATA_TYPE
        });
    }

    return schema;
}

module.exports = {
    pool,
    testConnection,
    executeQuery,
    getDatabaseSchema
};