// ดึง Element ที่จำเป็น
const form = document.getElementById('scanEntryForm');
const employeeIdInput = document.getElementById('employeeId');
const scanDateInput = document.getElementById('scanDate');
const scanTimeInput = document.getElementById('scanTime');
const dataTableBody = document.querySelector('#dataTable tbody');

// ----------------------------------------------------
// 📌 1. ตัวแปรและคีย์สำหรับ Local Storage
// ----------------------------------------------------
let allScanRecords = []; // Array สำหรับเก็บข้อมูลทั้งหมด
const STORAGE_KEY = 'employeeScanRecords'; 

// ----------------------------------------------------
// 📌 2. ฟังก์ชันหลักสำหรับ Local Storage
// ----------------------------------------------------

// บันทึกข้อมูลทั้งหมดลง Local Storage
function saveRecordsToLocalStorage() {
    // แปลง Array เป็น String (JSON) ก่อนบันทึก
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allScanRecords));
}

// ดึงข้อมูลจาก Local Storage เมื่อโหลดหน้า
function loadRecordsFromLocalStorage() {
    const storedRecords = localStorage.getItem(STORAGE_KEY);
    
    if (storedRecords) {
        // แปลง String (JSON) กลับเป็น Array
        allScanRecords = JSON.parse(storedRecords);
        
        // แสดงข้อมูลทั้งหมดที่มีอยู่ในตารางทันที
        renderAllRecords(); 
    }
}

// ----------------------------------------------------
// 📌 3. ฟังก์ชันกำหนดค่าเริ่มต้น วันที่และเวลาปัจจุบัน
// ----------------------------------------------------
function setInitialDateTime() {
    const now = new Date();
    
    // กำหนดวันที่: YYYY-MM-DD
    const dateString = now.toLocaleDateString('en-CA');
    scanDateInput.value = dateString;

    // กำหนดเวลา: HH:MM
    const timeString = now.toTimeString().substring(0, 5);
    scanTimeInput.value = timeString;
}

// ----------------------------------------------------
// 📌 4. ฟังก์ชันจัดการเมื่อมีการบันทึกข้อมูล (ปรับปรุง)
// ----------------------------------------------------
form.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // ดึงค่าจากฟอร์ม
    const employeeId = employeeIdInput.value.trim();
    const scanDate = scanDateInput.value;
    const scanTime = scanTimeInput.value;
    const scanType = document.getElementById('scanType').value;

    if (employeeId === '') {
        alert('กรุณากรอกรหัสพนักงาน');
        return;
    }

    // สร้าง Object ข้อมูล
    const scanData = { id: employeeId, date: scanDate, time: scanTime, type: scanType };

    // **ขั้นตอนใหม่:** // 1. เพิ่มข้อมูลใหม่ไปที่ด้านหน้าของ Array (Unshift)
    allScanRecords.unshift(scanData); 
    
    // 2. บันทึก Array ใหม่ลง Local Storage
    saveRecordsToLocalStorage();
    
    // 3. แสดงผลข้อมูลใหม่ทั้งหมด (เพื่ออัปเดตตาราง)
    renderAllRecords(); 

    // 4. แจ้งเตือนและรีเซ็ตฟอร์ม
    alert(`บันทึกข้อมูลสำเร็จ:\nรหัส: ${employeeId}, ประเภท: ${scanType}`);
    employeeIdInput.value = '';
    setInitialDateTime(); 
    employeeIdInput.focus();
});


// ----------------------------------------------------
// 📌 5. ฟังก์ชันแสดงผลและสร้างแถวในตาราง (ปรับปรุง)
// ----------------------------------------------------

// ฟังก์ชันสร้างแถวข้อมูลลงในตาราง (เหมือนเดิม)
function createRowInTable(data) {
    const newRow = dataTableBody.insertRow(-1); // แทรกที่ท้ายสุดของตาราง (เพราะเราใส่ข้อมูลใหม่ไว้หน้าสุดใน Array แล้ว)

    newRow.insertCell().textContent = data.id;
    newRow.insertCell().textContent = data.date;
    newRow.insertCell().textContent = data.time;
    newRow.insertCell().textContent = data.type;
}

// ฟังก์ชันแสดงข้อมูลทั้งหมดในตาราง (ดึงจาก allScanRecords)
function renderAllRecords() {
    // ล้างตารางเดิมก่อน
    dataTableBody.innerHTML = ''; 

    // จำกัดการแสดงผลไม่ให้เกิน 5 รายการล่าสุด
    allScanRecords.slice(0, 5).forEach(record => {
        createRowInTable(record);
    });
}


// ----------------------------------------------------
// 📌 6. เรียกใช้ฟังก์ชันเริ่มต้น (ปรับปรุง)
// ----------------------------------------------------
setInitialDateTime();
loadRecordsFromLocalStorage(); // **ต้องเรียกใช้ตรงนี้เพื่อให้ข้อมูลเก่าแสดงผลเมื่อเว็บโหลด**