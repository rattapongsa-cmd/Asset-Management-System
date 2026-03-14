const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // นำเข้า CORS
const app = express();

// ตั้งค่า Middleware
app.use(cors()); // อนุญาตให้เชื่อมต่อข้าม Domain (แก้ปัญหาหน้าเว็บติดต่อ Server ไม่ได้)
app.use(express.json());

// 1. เชื่อมต่อฐานข้อมูล webdb
const db = mysql.createConnection({
    host: 'localhost',
    port: 8820,         // พอร์ตตาม Docker/MySQL ของคุณ
    user: 'root',
    password: '123456', 
    database: 'webdb'    // มั่นใจว่าเป็น webdb ที่คุณแก้ไขโครงสร้างแล้ว
});

db.connect(err => {
    if (err) {
        console.error('❌ [Database] ต่อไม่ติด: ' + err.message);
        return;
    }
    console.log('✅ [Database] เชื่อมต่อ webdb สำเร็จแล้ว!');
});

// 2. API: ตรวจสอบการเข้าสู่ระบบ (Login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // ค้นหาจากอีเมลและรหัสผ่าน (ตรงตามโครงสร้างตารางใหม่)
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length > 0) {
            res.json({ 
                success: true, 
                user: {
                    display_name: results[0].display_name,
                    email: results[0].email
                } 
            });
        } else {
            res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
    });
});

// 3. API: ดึงข้อมูลอุปกรณ์ (Assets)
app.get('/api/assets', (req, res) => {
    // ดึงเฉพาะของที่สถานะเป็น active และตัดช่องว่างส่วนเกิน
    const sql = "SELECT id, asset_code, name, TRIM(status) as status FROM assets";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// 4. API: บันทึกการยืม (Borrow)
app.post('/api/borrow', (req, res) => {
    const { asset_id, borrower_name, borrow_date, return_date, reason } = req.body;
    const sqlInsert = "INSERT INTO borrow_logs (asset_id, borrower_name, borrow_date, return_date, reason) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sqlInsert, [asset_id, borrower_name, borrow_date, return_date, reason], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // เมื่อยืมสำเร็จ ให้อัปเดตสถานะอุปกรณ์เป็น 'borrowing'
        db.query("UPDATE assets SET status = 'borrowing' WHERE id = ?", [asset_id], (upErr) => {
            if (upErr) return res.status(500).json({ error: upErr.message });
            res.json({ success: true });
        });
    });
});

// เริ่มทำงาน Server ที่ Port 3000
const PORT = 3000;
app.listen(PORT, () => 