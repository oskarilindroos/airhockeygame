import * as mysql from 'mysql2/promise';
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
    waitForConnections: true
});

export const modifyData = async (query: string, params:string[] = []) => {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute<ResultSetHeader>(query, params);
        connection.release();
        return results;
    } catch (error) {
        throw error;
    }
}

export const selectData = async (query: string, params:string[] = []) => {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute<RowDataPacket[]>(query, params);
        connection.release();
        return results;
    } catch (error) {
        throw error;
    }
}