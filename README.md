-----

````markdown
# 📦 Asset Flow - Asset Management System

ระบบจัดการครุภัณฑ์และทรัพย์สิน (Asset Management System) แบบ Full-stack ที่ช่วยให้การ **ยืม-คืน**, **แจ้งซ่อม**, และ **ติดตามสถานะอุปกรณ์** เป็นเรื่องง่าย พร้อมระบบส่งอีเมลแจ้งเตือนอัตโนมัติ

---

## ✨ คุณสมบัติหลัก (Features)
* 🔐 **ระบบ Login:** เข้าสู่ระบบเพื่อแยกผู้ใช้งาน
* 📊 **Dashboard:** แสดงสถานะภาพรวมของครุภัณฑ์ทั้งหมด (พร้อมใช้งาน, กำลังถูกยืม, ชำรุด)
* 📝 **ระบบยืม-คืน:** ทำรายการยืมพร้อมระบุเหตุผล และกดคืนได้ทันที
* 📧 **Email Notification:** ส่งอีเมลยืนยันการยืมไปยังผู้ใช้โดยอัตโนมัติ (Nodemailer)
* 🛠️ **ระบบแจ้งซ่อม:** บันทึกอาการเสียและสถานที่ของอุปกรณ์ที่ชำรุด
* 📜 **ประวัติการยืม:** ดูรายการย้อนหลังของตนเองและพิมพ์รายงานเป็น PDF ได้
* 📱 **Responsive Design:** ใช้งานได้ทั้งบนคอมพิวเตอร์และแท็บเล็ต (Bootstrap 5)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

**Frontend:**
* HTML5, CSS3 (Custom Styles + Google Fonts)
* JavaScript (Vanilla JS + Fetch API)
* [Bootstrap 5](https://getbootstrap.com/) - UI Framework
* [Font Awesome](https://fontawesome.com/) - Icons

**Backend:**
* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) - Web Server
* [MySQL](https://www.mysql.com/) - Database Management
* [Nodemailer](https://nodemailer.com/) - Email Service

---

## 🚀 การติดตั้งและเริ่มใช้งาน (Setup Instructions)

### 1. สภาพแวดล้อมที่ต้องมี (Prerequisites)
* ติดตั้ง [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน LTS)
* ติดตั้ง MySQL Server (แนะนำผ่าน XAMPP หรือ MySQL Installer)

### 2. การเตรียมฐานข้อมูล
1. เข้าไปที่ **phpMyAdmin** หรือ MySQL Tool ของคุณ
2. สร้างฐานข้อมูลชื่อ `webdb`
3. รันคำสั่ง SQL จากไฟล์ `database.sql` (หรือสร้างตารางตามโครงสร้างที่ระบุไว้)

### 3. การติดตั้ง Backend
```bash
cd server
npm install
````

### 4\. การตั้งค่าการเชื่อมต่อ (Configuration)

เปิดไฟล์ `server/index.js` และแก้ไขข้อมูลให้ตรงกับเครื่องของคุณ:

  * **MySQL:** แก้ไข `user`, `password`, และ `port` (เช่น 3306 หรือ 8820)
  * **Email:** แก้ไข `user` และ `pass` (App Password 16 หลักจาก Gmail)

### 5\. เริ่มรันระบบ

```bash
# ในโฟลเดอร์ server
node index.js
```

จากนั้นเปิดไฟล์ `login.html` ผ่าน Browser หรือใช้ VS Code Live Server เพื่อเข้าสู่ระบบ

-----

## 📂 โครงสร้างโฟลเดอร์ (Project Structure)

```text
├── frontend/             # ไฟล์หน้าเว็บทั้งหมด (.html, .css)
│   ├── login.html        # หน้าเข้าสู่ระบบ
│   ├── dashboard.html    # หน้าหลัก/ยืม-คืน
│   ├── my-history.html   # หน้าประวัติส่วนตัว
│   └── repair-list.html  # หน้าแจ้งซ่อม
└── server/               # ส่วนของ API Backend
    ├── index.js          # ไฟล์หลักของ Node.js Server
    └── package.json      # รายการ Dependencies
```

-----

## 📄 โครงสร้างตาราง SQL (Schema)

เพื่อให้คนอื่นนำไปรันต่อได้ง่าย ควรเตรียม Schema ดังนี้:

```sql
-- ตารางทรัพย์สิน
CREATE TABLE assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_code VARCHAR(50),
    name VARCHAR(255),
    status ENUM('active', 'borrowing', 'repair') DEFAULT 'active'
);

-- ตารางประวัติการยืม
CREATE TABLE borrow_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT,
    borrower_name VARCHAR(255),
    borrow_date DATE,
    return_date DATE,
    reason TEXT
);

-- ตารางแจ้งซ่อม
CREATE TABLE repair_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT,
    reporter_name VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    report_date DATE,
    repair_status VARCHAR(50) DEFAULT 'pending'
);
```

-----

## 👤 ผู้พัฒนา (Developer)

  * **Name:** Rattapong Saiyaphang
  * **GitHub:** [@rattapongsa-cmd](https://www.google.com/search?q=https://github.com/rattapongsa-cmd)

<!-- end list -->

```
```
