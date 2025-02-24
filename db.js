// db.js
const mysql = require('mysql2/promise');
const dbConfig = require('./db.config');

const pool = mysql.createPool(dbConfig);

const getConnection = async () => {
    return await pool.getConnection();
};

const query = async (sql, values) => {
    const connection = await getConnection();
    try {
        const [rows, fields] = await connection.execute(sql, values);
        return rows;
    }
    finally {
        connection.release();
    }
};

module.exports = {
    query
};