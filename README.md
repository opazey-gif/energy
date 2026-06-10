📘 เอกสารโครงสร้างและแผนการพัฒนาระบบ (Project Documentation Update)

Project Name: TIJ Energy Intelligence Portal

Document Date: เมษายน 2026 (Updated based on Operational View Requirements)

Architect: OCTO_IT x TIJ Top Management

📑 1. Software Requirements Specification (SRS) - อัปเดตล่าสุด

จากการประเมินผลระบบ (Phase 1) ที่เน้นการนำเสนอระดับผู้บริหาร (Executive Dashboard) พบว่ามีความจำเป็นต้องเพิ่มขีดความสามารถของระบบเพื่อให้ทีม Operation และ Business สามารถวิเคราะห์ข้อมูลเชิงลึก (Root Cause Analysis) ได้ จึงมีการเพิ่ม Requirements ดังนี้:

1.1 Architectural Requirements (โครงสร้างสถาปัตยกรรม)

SR-ARCH-01 (Modularization): ระบบต้องถูกปรับโครงสร้างโค้ด (Refactoring) จากการใช้ไฟล์ Index.html เพียงไฟล์เดียว (Single Monolithic File) ให้แตกออกเป็นไฟล์ย่อย (Modular HTML/JS/CSS) เพื่อลดความซ้ำซ้อน จัดการง่าย และป้องกันปัญหาโค้ดเกิน 2,000 บรรทัด

SR-ARCH-02 (Server-Client Optimization): ระบบต้องรองรับการประมวลผลข้อมูลปริมาณมาก (Raw Data) โดยประเมินการใช้ Client-side Filtering สำหรับข้อมูลขนาดกลาง และ Server-side Filtering สำหรับข้อมูลขนาดใหญ่ในอนาคต

1.2 Functional Requirements (ฟังก์ชันการทำงานใหม่)

SR-FUNC-05 (Dynamic Date Range): เปลี่ยนจากการใช้ Filter แบบ "เลือกปี (Yearly Dropdown)" เป็น "การเลือกช่วงวันที่ (Date Range Picker)" เช่น 1-17 มี.ค. เทียบกับ 18-31 มี.ค. ได้อย่างอิสระ

SR-FUNC-06 (Interactive Data Grid): เพิ่มแท็บการแสดงผลแบบ "ตารางข้อมูลดิบ (Raw Data Table)" ที่ผู้ใช้สามารถจัดเรียง (Sort) จากมากไปน้อย และตั้งค่า Multi-filter (เช่น เลือกชั้น 3 + วันศุกร์ + แอร์) ได้ในตัว

SR-FUNC-07 (M&V Baseline Calculation): ระบบต้องสามารถคำนวณและแสดงผล "Avoided Energy/Cost" หรือพลังงานที่ประหยัดได้ โดยอ้างอิงจากเส้นฐาน (BAU Baseline) เช่น คำนวณส่วนต่างระหว่างการใช้ไฟปกติเทียบกับวัน WFH

1.3 Data Normalization Requirements (มาตรฐานข้อมูล)

SR-DATA-01 (Unit Scaling): ระบบต้องทำการแปลงหน่วย (Scale Unit) ของข้อมูล TOU อัตโนมัติ (คูณ 1,000) ให้เป็น kWh เพื่อให้สอดคล้องกับฐานข้อมูล BAS

SR-DATA-02 (Data Intersection Logic): การคำนวณสัดส่วนร้อยละ (%) ระหว่างข้อมูล 2 แหล่ง (เช่น TOU และ BAS) จะต้องคำนวณเฉพาะ "วันที่ข้อมูลทั้ง 2 ฝั่งมีตรงกันเท่านั้น" เพื่อป้องกันความคลาดเคลื่อนของฐานข้อมูล

📈 2. Project Phase Plan (แผนการดำเนินงาน)

เพื่อให้การเปลี่ยนผ่านสถาปัตยกรรมระบบไม่กระทบต่อการใช้งาน จึงมีการปรับแผนงานใหม่ (Re-planning) ดังนี้:

✅ Phase 1: Executive Dashboard (Completed)

สร้างระบบ Data Entry ฟอร์มบันทึกบิลค่าไฟ (Grid)

บูรณาการข้อมูล Grid, Solar, TOU, และ BAS 50-Meters

สร้างกราฟแสดงผลภาพรวมระดับ Macro (MoM, YoY)

การปรับสเกลหน่วยข้อมูล (Data Normalization)

🟡 Phase 2: Architecture Refactoring (In Progress / NEXT)

หยุดการเพิ่มฟีเจอร์ใหม่ชั่วคราว

แยกร่างไฟล์ Index.html เป็นโมดูล (CSS, Global JS, Chart JS, Views)

ปรับปรุง Code.gs ให้รองรับฟังก์ชัน include() ไฟล์ย่อย

⏳ Phase 3: Operational & Analytical View (Upcoming)

ติดตั้งไลบรารี Date Range Picker (เช่น Flatpickr)

ติดตั้งไลบรารี Data Grid (เช่น DataTables หรือ Grid.js)

สร้าง View ใหม่สำหรับการทำ Multi-filtering & Data Export (CSV)

⏳ Phase 4: Advanced M&V & Alerts (Future)

ระบบสร้าง Baseline อัตโนมัติ เพื่อคำนวณเงินที่ประหยัดได้ (Avoided Cost)

ระบบแจ้งเตือนความผิดปกติ (Anomaly Detection) เช่น แอร์ทำงานหนักผิดปกติในวันหยุด

🔗 3. Requirements Traceability Matrix (RTM)

ตารางตรวจสอบความเชื่อมโยงของระบบกับการทำงานปัจจุบัน:

| ID | Requirement Description | Type | Status | Target Phase |
| REQ-01 | บันทึกบิลค่าไฟและอัปโหลด PDF ไปยัง Drive | Func | ✅ Done | Phase 1 |
| REQ-02 | แสดงผล ESG (Net Carbon) & ประสิทธิภาพตึก (SEC) | Func | ✅ Done | Phase 1 |
| REQ-03 | วิเคราะห์พฤติกรรมโหลด BAS รายชั้น (Heatmap/WFH Tracker) | Func | ✅ Done | Phase 1 |
| REQ-04 | แก้ไขปัญหา Data Asymmetry & Unit Mismatch (TOU vs BAS) | Data | ✅ Done | Phase 1 |
| REQ-05 | 

$$NEW$$

 แยกร่างไฟล์ HTML/JS (Modularization) | Arch | 🟡 Next | Phase 2 |
| REQ-06 | 

$$NEW$$

 เพิ่มฟีเจอร์ Date Range Picker | Func | ⏳ Pending | Phase 3 |
| REQ-07 | 

$$NEW$$

 เพิ่มตาราง Data Grid (Sort, Multi-filter, Export) | Func | ⏳ Pending | Phase 3 |
| REQ-08 | 

$$NEW$$

 สรุปผล Avoided Cost จากนโยบาย WFH (M&V) | Func | ⏳ Pending | Phase 4 |

🚀 4. Next Step (ก้าวต่อไปของโปรเจกต์)

เพื่อหลีกเลี่ยง "Technical Debt (หนี้ทางเทคนิค)" จากการเขียนโค้ดทับซ้อนกันจนถึงขีดจำกัด สิ่งที่เราต้องทำใน Sprint ถัดไป คือ:

Step 1: เปลี่ยนโครงสร้างหลังบ้าน (Google Apps Script Preparation)

เพิ่มฟังก์ชันกุญแจสำคัญลงในไฟล์ Code.gs เพื่ออนุญาตให้ระบบดึงไฟล์ HTML/JS ย่อยๆ มาประกอบร่างกันได้ (เหมือนคำสั่ง include ในภาษา PHP)

// โค้ดที่จะถูกเพิ่มใน Code.gs
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}



Step 2: สับไฟล์ Index.html (Code Splitting)

เตรียมย้ายโค้ดกว่า 1,700 บรรทัด ออกเป็นไฟล์ย่อยๆ บน Google Apps Script IDE ดังนี้:

Index.html (ไฟล์โครงร่างหลัก)

CSS_Main.html (สำหรับ Style)

JS_Data.html (สำหรับดึงข้อมูลและเตรียม Data)

JS_Charts.html (สำหรับวาดกราฟทั้งหมด)

View_Table.html (สร้างแท็บใหม่เพื่อใส่ตาราง Data Grid เจาะลึก)

🤖 5. AI Handoff & Developer Notes (คำแนะนำสำหรับการเริ่ม Chat ใหม่)

To the AI Assistant: If you are reading this document in a new session, it means we are picking up the project from Phase 2: Architecture Refactoring.

Current State:

The user has provided Index.html and Code.gs representing the completed Phase 1.

The Index.html file is a monolithic file (~1,700 lines) containing HTML, Tailwind CSS classes, Chart.js logic, and Google Apps Script client-side logic.

The data dictionaries (like METER_MAP) and data normalization logic (multiplying TOU by 1000) are fully working in the current Index.html. Do not alter the core business logic.

Your First Task (Prompt for next session):
"Hi AI, I have uploaded the current Index.html and Code.gs. Please review them along with this TIJ_Energy_Project_Docs.md. Our goal today is to execute Phase 2: Step 1 and Step 2. Please guide me on how to split the Index.html file into modular files, and provide the exact code blocks for the new Code.gs and the newly split HTML/JS files."
