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
    port: 8820,
    user: 'root',
    password: '123456',
    database: 'webdb'
});

db.connect(err => {
    if (err) { console.error('❌ DB Error: ' + err.stack); return; }
    console.log('✅ Connected to MySQL');
});

// 2. ตั้งค่าการส่งเมล
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'rattapong980@gmail.com', pass: 'hrlnwvdyyzcowdzm' }
});

// --- API ทั้งหมด ---
app.get('/api/assets', (req, res) => {
    db.query("SELECT * FROM assets", (err, result) => res.json(result));
});

app.post('/api/borrow', (req, res) => {
    const { asset_id, borrower_name, borrow_date, return_date, reason, user_email } = req.body;
    db.query("INSERT INTO borrow_logs (asset_id, borrower_name, borrow_date, return_date, reason) VALUES (?, ?, ?, ?, ?)", 
    [asset_id, borrower_name, borrow_date, return_date, reason], (err) => {
        if (err) return res.status(500).json({ success: false });
        db.query("UPDATE assets SET status = 'borrowing' WHERE id = ?", [asset_id], () => res.json({ success: true }));
    });
});

app.post('/api/return', (req, res) => {
    const { asset_id } = req.body;
    db.query("UPDATE assets SET status = 'active' WHERE id = ?", [asset_id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.post('/api/repair', (req, res) => {
    const { asset_id, reporter_name, description, location } = req.body;
    db.query("INSERT INTO repair_logs (asset_id, reporter_name, description, location, report_date, repair_status) VALUES (?, ?, ?, ?, CURDATE(), 'pending')", 
    [asset_id, reporter_name, description, location], (err) => {
        if (err) return res.status(500).json({ success: false });
        db.query("UPDATE assets SET status = 'repair' WHERE id = ?", [asset_id], () => res.json({ success: true }));
    });
});

app.get('/api/repair-list', (req, res) => {
    const sql = "SELECT r.*, a.name as asset_name FROM repair_logs r JOIN assets a ON r.asset_id = a.id ORDER BY r.id DESC";
    db.query(sql, (err, results) => res.json(results));
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [username, password], (err, results) => {
        if (results.length > 0) res.json({ success: true, user: { display_name: results[0].display_name, email: results[0].email } });
        else res.status(401).json({ success: false });
    });
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));