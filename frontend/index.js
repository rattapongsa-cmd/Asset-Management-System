const API_URL = 'http://localhost:3000/api';
let loggedInUser = "";

// 1. จัดการ Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        const result = await res.json();

        if (res.ok && result.success) {
            loggedInUser = result.user.display_name;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('borrowFormSection').style.display = 'block';
            document.getElementById('userWelcome').innerText = `ยินดีต้อนรับ: ${loggedInUser}`;
            loadAvailableAssets();
        } else {
            alert(result.message || 'ข้อมูลไม่ถูกต้อง');
        }
    } catch (err) {
        alert('ไม่สามารถเชื่อมต่อ Server ได้ (เช็ค node index.js พอร์ต 3000)');
    }
});

// 2. โหลดรายการอุปกรณ์
async function loadAvailableAssets() {
    const select = document.getElementById('assetSelect');
    try {
        const res = await fetch(`${API_URL}/assets`);
        const assets = await res.json();
        select.innerHTML = '<option value="">-- เลือกอุปกรณ์ --</option>';

        const available = assets.filter(a =>
            a.status && a.status.toString().toLowerCase().trim() === 'active'
        );

        if (available.length === 0) {
            select.innerHTML = '<option value="">-- ไม่มีอุปกรณ์ว่าง --</option>';
        } else {
            available.forEach(asset => {
                const opt = document.createElement('option');
                opt.value = asset.id;
                opt.textContent = `${asset.asset_code} | ${asset.name}`;
                select.appendChild(opt);
            });
        }
    } catch (err) {
        select.innerHTML = '<option value="">-- โหลดข้อมูลล้มเหลว --</option>';
    }
}

// 3. บันทึกการยืม
document.getElementById('borrowForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        asset_id: document.getElementById('assetSelect').value,
        borrower_name: loggedInUser,
        borrow_date: new Date().toISOString().split('T')[0],
        return_date: document.getElementById('returnDate').value,
        reason: document.getElementById('reason').value
    };

    try {
        const res = await fetch(`${API_URL}/borrow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert('บันทึกการยืมสำเร็จ!');
            location.reload();
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาด');
    }
});