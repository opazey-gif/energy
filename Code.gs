/**
 * TIJ Energy Management Portal - Backend logic
 * Architect: OCTO_IT
 * Version: 2.3 (Grid + Solar + TOU + BAS Actual kWh Integrated)
 */

const CONFIG = {
  SPREADSHEET_ID: "1JywAqED8mxRIJrU2XvewRhBjW1Mp6RTcqnxiEGfRu1k",
  SHEET_NAME: "Table_Energy_Records", // Grid Data
  SOLAR_SHEET_NAME: "Table_Solar_Records", // Solar Data
  TOU_SHEET_NAME: "Table_TOU_Records", // TOU Data
  BAS_SHEET_NAME: "Table_BAS_Records", // BAS 50-Meters Data
  UPLOAD_FOLDER_ID: "1o8_LSUdVpLjx6mWjHR2ZNx5d4_r5vjm9",
  ADMIN_EMAIL: "opas.y@tijthailand.org"
};

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('TIJ Energy Intelligence')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function calculateFiscalYear(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const yearBE = date.getFullYear() + 543;
  return (month >= 10) ? yearBE + 1 : yearBE;
}

function submitEnergyRecord(formObject) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    const data = sheet.getDataRange().getValues();
    const invoiceIndex = 1; 
    const isDuplicate = data.some(row => row[invoiceIndex] == formObject.invoice_no);
    if (isDuplicate) throw new Error("ตรวจพบเลขที่ใบแจ้งหนี้ซ้ำในระบบ");

    const folder = DriveApp.getFolderById(CONFIG.UPLOAD_FOLDER_ID);
    const blob = formObject.bill_file;
    const file = folder.createFile(blob);
    file.setName(`BILL_${formObject.billing_period}_${formObject.invoice_no}`);

    const recordId = `ENY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fiscalYear = calculateFiscalYear(formObject.billing_period + "-01");
    const userEmail = Session.getActiveUser().getEmail();

    const newRow = [
      recordId, formObject.invoice_no, formObject.meter_id || "MAIN-01",
      formObject.billing_period, fiscalYear,
      Number(formObject.peak_demand_kw), Number(formObject.peak_demand_thb), 
      Number(formObject.on_peak_kwh), Number(formObject.on_peak_thb),    
      Number(formObject.off_peak_kwh), Number(formObject.off_peak_thb),    
      Number(formObject.service_fee), Number(formObject.ft_rate),
      Number(formObject.base_energy_cost), Number(formObject.vat_thb),         
      Number(formObject.total_amount), file.getId(), userEmail, "Submitted", new Date()
    ];

    sheet.appendRow(newRow);
    return { success: true, message: "บันทึกข้อมูลและอัปโหลดไฟล์บิลเรียบร้อยแล้ว", recordId: recordId };

  } catch (e) {
    return { success: false, message: e.toString() };
  } finally {
    lock.releaseLock();
  }
}

/**
 * ดึงข้อมูลทั้งหมดเพื่อส่งไปวิเคราะห์ที่หน้า Dashboard
 */
function getDashboardData() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  // 1. ดึงข้อมูล Grid (บิลค่าไฟ)
  const gridSheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  let gridRecords = [];
  if (gridSheet) {
    const gridData = gridSheet.getDataRange().getValues();
    if (gridData.length > 1) {
      const headers = gridData.shift();
      gridRecords = gridData.map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = (row[i] instanceof Date) ? row[i].toISOString() : row[i]);
        return obj;
      });
    }
  }

  // 2. ดึงข้อมูล Solar
  const solarSheet = ss.getSheetByName(CONFIG.SOLAR_SHEET_NAME);
  let solarRecords = [];
  if (solarSheet) {
    const solarData = solarSheet.getDataRange().getValues();
    if (solarData.length > 1) {
      const solarHeaders = solarData.shift();
      solarRecords = solarData.map(row => {
        let obj = {};
        solarHeaders.forEach((h, i) => obj[h] = (row[i] instanceof Date) ? row[i].toISOString() : row[i]);
        return obj;
      });
    }
  }

  // 3. ดึงข้อมูล TOU (รายวัน)
  const touSheet = ss.getSheetByName(CONFIG.TOU_SHEET_NAME);
  let touRecords = [];
  if (touSheet) {
    const touData = touSheet.getDataRange().getValues();
    if (touData.length > 1) {
      const touHeaders = touData.shift();
      touRecords = touData.map(row => {
        let obj = {};
        touHeaders.forEach((h, i) => obj[h] = (row[i] instanceof Date) ? row[i].toISOString() : row[i]);
        return obj;
      });
    }
  }

  // 4. ดึงข้อมูล BAS 50-Meters (อัปเดตดึง Actual kWh)
  const basSheet = ss.getSheetByName(CONFIG.BAS_SHEET_NAME);
  let basRecords = [];
  if (basSheet) {
    const basData = basSheet.getDataRange().getValues();
    if (basData.length > 1) {
      const basHeaders = basData.shift();
      basRecords = basData.map(row => {
        let obj = {};
        basHeaders.forEach((h, i) => obj[h] = (row[i] instanceof Date) ? row[i].toISOString() : row[i]);
        return obj;
      });
    }
  }

  // ดึงอีเมลผู้ใช้งาน (ป้องกัน Error หากเปิดสิทธิ์เป็น Anyone)
  let userEmail = '';
  try {
    userEmail = Session.getActiveUser().getEmail();
  } catch(e) {
    userEmail = 'Operator';
  }

  return {
    records: gridRecords,
    solarRecords: solarRecords,
    touRecords: touRecords,
    basRecords: basRecords,
    user: userEmail
  };
}
