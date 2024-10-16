import * as mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
    waitForConnections: true
});

export const execute = async (query: string, params:string[] = []) => {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(query, params);
        connection.release();
        return results;
    } catch (error) {
        throw error;
    }
}