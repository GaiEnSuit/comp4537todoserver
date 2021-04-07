/**
 * Database Configuration.
 */

const mysql = require("mysql");

const dbconnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
});

try {
    dbconnection.connect();
    console.log("Connection to database successfull");
} catch (error) {
    console.log(error.message);
}

module.exports = dbconnection;
