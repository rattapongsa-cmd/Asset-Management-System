const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json());

// 1. เชื่อมต่อฐานข้อมูล
const db = mysql.createConnection({
    host: 'localhost',
    port: 8820,     // พอร์ตของเครื่องคุณ
    user: 'root',
    password: '123456',
    database: 'webdb'
});

db.connect(err => {
    if (err) { console.error('❌ DB Error: ' + err.stack); return; }
    console.log('✅ Connected to MySQL Database');
});

// 2. ตั้งค่าการส่งเมล (Nodemailer)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'rattapong980@gmail.com', pass: 'hrlnwvdyyzcowdzm' }
});

// ==========================================
// 📌 API Routes ทั้งหมด
// ==========================================

// [GET] ดึงทรัพย์สินทั้งหมด
app.get('/api/assets', (req, res) => {
    db.query("SELECT * FROM assets", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// [POST] เพิ่มทรัพย์สิน
app.post('/api/assets', (req, res) => {
    const { asset_code, name } = req.body;
    db.query("INSERT INTO assets (asset_code, name, status) VALUES (?, ?, 'active')", [asset_code, name], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// [POST] ยืมอุปกรณ์
app.post('/api/borrow', (req, res) => {
    const { asset_id, borrower_name, borrow_date, return_date, reason } = req.body;
    db.query("INSERT INTO borrow_logs (asset_id, borrower_name, borrow_date, return_date, reason) VALUES (?, ?, ?, ?, ?)",
        [asset_id, borrower_name, borrow_date, return_date, reason], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            db.query("UPDATE assets SET status = 'borrowing' WHERE id = ?", [asset_id], () => res.json({ success: true }));
        });
});

// [POST] คืนอุปกรณ์
app.post('/api/return', (req, res) => {
    const { asset_id } = req.body;
    db.query("UPDATE assets SET status = 'active' WHERE id = ?", [asset_id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// [POST] แจ้งซ่อม
app.post('/api/repair', (req, res) => {
    const { asset_id, reporter_name, description, location } = req.body;
    db.query("INSERT INTO repair_logs (asset_id, reporter_name, description, location, report_date, repair_status) VALUES (?, ?, ?, ?, CURDATE(), 'pending')",
        [asset_id, reporter_name, description, location], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            db.query("UPDATE assets SET status = 'repair' WHERE id = ?", [asset_id], () => res.json({ success: true }));
        });
});

// [GET] ดึงรายการแจ้งซ่อม
app.get('/api/repair-list', (req, res) => {
    const sql = "SELECT r.*, a.name as asset_name, a.asset_code FROM repair_logs r JOIN assets a ON r.asset_id = a.id ORDER BY r.id DESC"; db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ✨ [POST] อัปเดตสถานะซ่อมเสร็จ ✨
app.post('/api/repair/complete', (req, res) => {
    const { repair_id, asset_id } = req.body;

    // อัปเดตตาราง repair_logs (ใช้คำว่า done เพื่อป้องกัน Error Data truncated)
    db.query("UPDATE repair_logs SET repair_status = 'done' WHERE id = ?", [repair_id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        // คืนชีพอุปกรณ์กลับเป็น active
        db.query("UPDATE assets SET status = 'active' WHERE id = ?", [asset_id], (err2) => {
            if (err2) return res.status(500).json({ success: false, error: err2.message });
            res.json({ success: true });
        });
    });
});

// [GET] ประวัติการยืมของฉัน
app.get('/api/my-history', (req, res) => {
    const userName = req.query.user;
    const sql = `SELECT b.*, a.asset_code, a.name as asset_name, a.status as asset_status FROM borrow_logs b JOIN assets a ON b.asset_id = a.id WHERE b.borrower_name = ? ORDER BY b.id DESC`;
    db.query(sql, [userName], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// [POST] ล็อกอิน
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0) res.json({ success: true, user: { display_name: results[0].display_name, email: results[0].email } });
        else res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    });
});
// [POST] API สำหรับสมัครสมาชิกใหม่
app.post('/api/register', (req, res) => {
    const { email, firstname, lastname, password } = req.body;
    const display_name = `${firstname} ${lastname}`;
    const sql = "INSERT INTO users (email, firstname, lastname, display_name, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [email, firstname, lastname, display_name, password], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "ไม่สามารถสมัครสมาชิกได้ อีเมลนี้อาจถูกใช้งานแล้ว" });
        }
        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ!" });
    });
});

app.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});