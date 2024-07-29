import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from "./config.js";

dotenv.config();

// Configuración de la conexión
const db = mysql2.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log(
    "host:",
    DB_HOST,
    "port:",
    DB_PORT,
    "user:",
    DB_USER,
    "password:",
    DB_PASSWORD,
    "database:",
    DB_NAME
);

export default db;
