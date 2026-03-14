const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // ต้องมีตัวนี้เพื่อแก้ปัญหา Error การเชื่อมต่อ
const app = express();

app.use(cors()); // อนุญาตให้ Frontend เชื่อมต่อได้
app.use(express.json());

// เชื่อมต่อฐานข้อมูล webdb
const db = mysql.createConnection({
    host: 'localhost',
    port: 8820,
    user: 'root',
    password: '123456', 
    database: 'webdb' // เปลี่ยนเป็น webdb ตามที่คุณย้ายข้อมูลไป
});

db.connect(err => {
    if (err) {
        console.error('❌ Database Connection Failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL (webdb) Successfully!');
});

// API 1: ตรวจสอบการเข้าสู่ระบบ
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
    });
});

// API 2: ดึงข้อมูลอุปกรณ์ (เฉพาะสถานะ active)
app.get('/api/assets', (req, res) => {
    const sql = "SELECT id, asset_code, name, status FROM assets";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// API 3: บันทึกการยืมและอัปเดตสถานะ
app.post('/api/borrow', (req, res) => {
    const { asset_id, borrower_name, borrow_date, return_date, reason } = req.body;
    const sqlInsert = "INSERT INTO borrow_logs (asset_id, borrower_name, borrow_date, return_date, reason) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sqlInsert, [asset_id, borrower_name, borrow_date, return_date, reason], (err) => {
        if (err) return res.status(500).json({ error: err.message });
    });
  });