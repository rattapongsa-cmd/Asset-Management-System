const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. เชื่อมต่อฐานข้อมูล webdb
const db = mysql.createConnection({
    host: 'localhost',
    port: 8820,
    user: 'root',
    password: '123456',
    database: 'webdb'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database Connection Failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL (webdb) Successfully!');
});

// 2. API: สมัครสมาชิก (Register) - บันทึกข้อมูลลงตาราง users
app.post('/api/register', (req, res) => {
    const { email, firstname, lastname, display_name, password } = req.body;

    // ตรวจสอบว่าค่าที่รับมามีตัวตนไหม (กัน Error ค่าว่าง)
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    // แก้ชื่อคอลัมน์ให้ตรงตาม Structure ใน phpMyAdmin (firstname, lastname ตัวเล็กหมด)
    const sql = "INSERT INTO users (email, firstname, lastname, display_name, password) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [email, firstname, lastname, display_name, password], (err, result) => {
        if (err) {
            console.error("❌ SQL Error:", err); // ดูที่ Terminal จะเห็นสาเหตุจริง

            // ถ้า Error Code คือ ER_DUP_ENTRY แสดงว่าเมลซ้ำจริง
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(500).json({ success: false, message: 'อีเมลนี้ถูกใช้งานไปแล้ว' });
            }

            // ถ้า Error อื่นๆ (เช่น คอลัมน์ไม่ครบ) ให้ส่งบอกว่าเป็นปัญหาที่ระบบ
            return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดที่ระบบฐานข้อมูล: ' + err.message });
        }
        res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ!' });
    });
});

// 3. API: เข้าสู่ระบบ (Login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, user: { display_name: results[0].display_name } });
        } else {
            res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
    });
});

// 4. API: ดึงข้อมูลอุปกรณ์
app.get('/api/assets', (req, res) => {
    // ดึงข้อมูลทั้งหมดมาทำ Dashboard
    const sql = "SELECT * FROM assets";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// 5. API: บันทึกการยืม
app.post('/api/borrow', (req, res) => {
    const { asset_id, borrower_name, borrow_date, return_date, reason } = req.body;
    const sqlInsert = "INSERT INTO borrow_logs (asset_id, borrower_name, borrow_date, return_date, reason) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlInsert, [asset_id, borrower_name, borrow_date, return_date, reason], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query("UPDATE assets SET status = 'borrowing' WHERE id = ?", [asset_id], () => {
            res.json({ success: true });
        });
    });
});
// 6. API: ดึงประวัติการยืมของผู้ใช้ (My History)
app.get('/api/my-history', (req, res) => {
    const userName = req.query.user; // รับชื่อผู้ใช้จากหน้าบ้าน

    // SQL Join เพื่อดึงข้อมูลชื่ออุปกรณ์มาโชว์ด้วย
    const sql = `
        SELECT b.id, a.asset_code, a.name as asset_name, b.borrow_date, b.return_date, b.reason 
        FROM borrow_logs b
        JOIN assets a ON b.asset_id = a.id
        WHERE b.borrower_name = ?
        ORDER BY b.id DESC`;

    db.query(sql, [userName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});