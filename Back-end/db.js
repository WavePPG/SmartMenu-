const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME,
  port     : process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล: ' + err.stack);
    return;
  }
  console.log('เชื่อมต่อกับฐานข้อมูลสำเร็จ! ID การเชื่อมต่อ: ' + connection.threadId);
});

module.exports = connection;
