const mysql = require('mysql2/promise');
const { relative } = require('path');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'rapido&seguro',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conectado ao MySQL');
        connection.release();
    } catch (error) {
        console.error(`Erro ao conectar com o MySQL: ${error}`);
    }
})();

module.exports = { pool };


