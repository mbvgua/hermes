import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

import { SqlConfig } from "../api/models/db.models";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const sqlConfig: SqlConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  // from the docs
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

export const pool = mysql.createPool(sqlConfig);
