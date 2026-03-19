

# 📦 ASSET FLOW - ระบบจัดการครุภัณฑ์และอุปกรณ์ไอที

**Asset Flow** คือเว็บแอปพลิเคชันสำหรับบริหารจัดการครุภัณฑ์ภายในองค์กรแบบครบวงจร พัฒนาขึ้นเพื่อแก้ปัญหาการติดตามสถานะอุปกรณ์ที่ยุ่งยาก ให้กลายเป็นระบบที่ใช้งานง่าย สวยงาม และตรวจสอบได้แบบ Real-time

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

---

## ✨ ฟีเจอร์เด่น (Key Features)

* **📊 Dashboard & Analytics:** สรุปภาพรวมจำนวนครุภัณฑ์ทั้งหมด, อุปกรณ์ที่พร้อมใช้งาน, กำลังถูกยืม และรายการแจ้งซ่อม พร้อมกราฟสรุปสถิติ
* **🔐 Authentication System:** ระบบเข้าสู่ระบบและสมัครสมาชิก พร้อมหน้าจอแบบ Split Screen ที่ทันสมัย
* **📑 Inventory Management:** จัดการรายการทรัพย์สินแยกตามหมวดหมู่ (IT, Furniture, Office, etc.) พร้อมระบบค้นหาอัจฉริยะ
* **🤝 Borrow & Return System:** ระบบยืม-คืนอุปกรณ์ที่ใช้งานง่าย พร้อมบันทึกประวัติการใช้งาน (Logs)
* **🛠️ Maintenance Tracking:** ระบบแจ้งซ่อมอุปกรณ์ที่ชำรุด พร้อมติดตามสถานะการซ่อมได้ทันที
* **📄 Report Generation:** ออกรายงานสรุปประจำปีในรูปแบบตารางและกราฟ รองรับการ Export เป็นไฟล์ **Excel** และ **PDF**
* **🎨 Modern UI:** ดีไซน์ด้วยโทนสี Moss Green เน้นความคลีน สบายตา และใช้ **SweetAlert2** สำหรับการแจ้งเตือนที่นุ่มนวล

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

**Frontend:**
* HTML5 / CSS3 (Custom CSS & Flexbox)
* Bootstrap 5 (UI Framework)
* JavaScript (ES6+)
* SweetAlert2 (Pop-up Notifications)
* Chart.js (Data Visualization)

**Backend:**
* Node.js & Express.js
* MySQL (Database)
* XLSX & SheetJS (Excel Export)

---

## 🚀 การติดตั้งและใช้งาน (Installation)

1. **Clone โปรเจกต์:**
   ```bash
   git clone [https://github.com/yourusername/asset-flow.git](https://github.com/yourusername/asset-flow.git)
   cd asset-flow
````

2.  **Setup Database:**

      * นำเข้าไฟล์ฐานข้อมูล (SQL) ผ่าน phpMyAdmin
      * ตั้งชื่อฐานข้อมูลว่า `webdb`

3.  **Install Dependencies:**

    ```bash
    cd server
    npm install
    ```

4.  **Start Server:**

    ```bash
    node index.js
    ```

5.  **เปิดใช้งาน:**
    เข้าใช้งานผ่าน Browser ที่ `http://localhost:5500/frontend/borrow.html` (หรือตามพอร์ตที่คุณใช้งาน)

-----

## 📸 Screenshots (ตัวอย่างหน้าจอ)

| หน้าเข้าสู่ระบบ | หน้า Dashboard |
|---|---|
|  |  |
