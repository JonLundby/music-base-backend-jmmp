// database name and password to be replaced

import mysql2 from "mysql2";

const connection = mysql2.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "artists_db", // todo set db name
  password: "@S4t4nT4ng0Z#85", //todo set password
  multipleStatements: true,
});

export default connection;