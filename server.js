require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// ปิด header ที่ไม่จำเป็น
app.disable('x-powered-by');

// ใช้ connection pool แทน เพื่อ performance ที่ดีขึ้น
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// API ทดสอบ
app.get('/', (req, res) => {
  res.send('Hello from Production Express & MySQL using Docker!');
});

// API ดึงข้อมูลจาก MySQL
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
