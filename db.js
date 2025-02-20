// db.js
const mysql = require('mysql2/promise'); // Using promise-based API
const dbConfig = require('./db.config');

const pool = mysql.createPool(dbConfig); // Create a connection pool for efficiency

const getConnection = async () => {
    return await pool.getConnection();
};

const query = async (sql, values) => {
    const connection = await getConnection();
    try {
        const [rows, fields] = await connection.execute(sql, values);
        return rows;
    } finally {
        connection.release(); // Release the connection back to the pool
    }
};

module.exports = {
    query
};