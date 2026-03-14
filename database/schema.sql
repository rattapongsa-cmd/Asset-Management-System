-- ปิดระบบตรวจสอบความสัมพันธ์ (เพื่อให้ลบตารางที่มี Foreign Key ติดอยู่ได้)
SET FOREIGN_KEY_CHECKS = 0;

-- ลบตารางเก่าที่โครงสร้างผิดออกให้เกลี้ยง
DROP TABLE IF EXISTS borrow_logs;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS assets;
DROP TABLE IF EXISTS users;

-- สร้างตาราง Users ใหม่ (โครงสร้างตรงกับโค้ด JavaScript)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    display_name VARCHAR(200),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง Assets ใหม่
CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    status ENUM('active', 'repair', 'broken', 'borrowing') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- สร้างตาราง Borrow Logs ใหม่
CREATE TABLE borrow_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT,
    borrower_name VARCHAR(100),
    borrow_date DATE,
    return_date DATE,
    reason TEXT,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- เพิ่มข้อมูลสำหรับทดสอบ Login (Email: test@email.com / Pass: 123456)
INSERT INTO users (email, firstname, lastname, display_name, password) 
VALUES ('test@email.com', 'Admin', 'AssetFlow', 'แอดมินระบบ', '123456');

-- เพิ่มอุปกรณ์ตัวอย่าง
INSERT INTO assets (asset_code, name, status) VALUES 
('IT-001', 'MacBook Pro M3', 'active'),
('IT-002', 'iPad Pro 11"', 'active'),
('IT-003', 'Monitor Dell 27"', 'active');

-- เปิดระบบตรวจสอบความสัมพันธ์กลับคืนมา
SET FOREIGN_KEY_CHECKS = 1;