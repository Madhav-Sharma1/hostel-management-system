const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

pool.getConnection()
    .then(conn => {
        console.log('Database connected successfully');
        conn.release();
    })
    .catch(err => console.error('Database connection failed:', err));

module.exports = pool;