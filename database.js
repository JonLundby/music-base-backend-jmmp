// database name and password to be replaced

import mysql2 from "mysql2";
import "dotenv/config";

const connection = mysql2.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE, // todo set db name
  password: process.env.MYSQL_PASSWORD, //todo set password
  multipleStatements: true,
});

export default connection;
