require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const rateLimit = require('express-rate-limit');

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

// ตั้งค่า rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 100, // จำกัดที่ 100 requests ต่อ 15 นาที ต่อ IP
  message: 'You have made too many requests. Please try again later.',
  standardHeaders: true, // แสดงข้อมูล rate limit ใน headers
  legacyHeaders: false, // ปิด headers เก่าที่ไม่จำเป็น
});

// ใช้ rate limiter กับทุก request
app.use(limiter);

// API ทดสอบ
app.get('/', (req, res) => {
  res.send('Hello from Production Express & MySQL using Docker!');
});

// API ดึงข้อมูลจาก MySQL
app.get('/users',  (req, res) => {
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
