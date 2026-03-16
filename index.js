const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer'); 
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

// ✨ การตั้งค่า Nodemailer (ใช้ Gmail App Password)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rattapong980@gmail.com',     // 📧 อีเมลเจ้าของรหัส App Password
        pass: 'hrlnwvdyyzcowdzm'          // 🔑 รหัส 16 หลัก (ลบช่องว่างออกให้หมด)
    }
});

// 2. API: สมัครสมาชิก
app.post('/api/register', (req, res) => {
    const { email, firstname, lastname, display_name, password } = req.body;
    const sql = "INSERT INTO users (email, firstname, lastname, display_name, password) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [email, firstname, lastname, display_name, password], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'สมัครสมาชิกสำเร็จ!' });
    });
});

// 3. API: เข้าสู่ระบบ
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, user: { display_name: results[0].display_name, email: results[0].email } });
        } else {
            res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }
    });
});

// 4. API: ดึงข้อมูลอุปกรณ์
app.get('/api/assets', (req, res) => {
    const sql = "SELECT * FROM assets";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// ✨ 5. API: บันทึกการยืม + ส่งอีเมลแจ้งเตือน
app.post('/api/borrow', (req, res) => {
    const { asset_id, borrower_name, borrow_date, return_date, reason, user_email } = req.body;
    
    const sqlInsert = "INSERT INTO borrow_logs (asset_id, borrower_name, borrow_date, return_date, reason) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlInsert, [asset_id, borrower_name, borrow_date, return_date, reason], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        db.query("UPDATE assets SET status = 'borrowing' WHERE id = ?", [asset_id], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });

            db.query("SELECT name, asset_code FROM assets WHERE id = ?", [asset_id], (err, assetResult) => {
                if (!err && assetResult.length > 0 && user_email) {
                    const asset = assetResult[0];
                    const mailOptions = {
                        from: '"Asset Flow System" <rattapong980@gmail.com>', // 📧 เมลผู้ส่งต้องตรงกับ auth.user
                        to: user_email,
                        subject: `📢 ยืนยันการยืมอุปกรณ์: ${asset.name}`,
                        text: `สวัสดีคุณ ${borrower_name}\nคุณได้ยืม ${asset.name} [${asset.asset_code}]\nกำหนดคืน: ${return_date}`
                    };

                    transporter.sendMail(mailOptions, (mailErr, info) => {
                        if (mailErr) console.error("❌ 📧 Mail Error:", mailErr.message);
                        else console.log("✅ 📧 Email sent: " + info.response);
                    });
                }
                res.json({ success: true });
            });
        });
    });
});

// API: คืนอุปกรณ์
app.post('/api/return', (req, res) => {
    const { asset_id } = req.body;
    db.query("UPDATE assets SET status = 'active' WHERE id = ?", [asset_id], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.listen(3000, () => { console.log('🚀 Server is running on http://localhost:3000'); });