function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheets = {
      rsvp: {
        name: "RSVP",
        headers: ["Thời gian", "Họ tên", "Tham dự", "Số khách", "Khách nhà", "Lời nhắn"],
        values: [
          data.created_at || new Date().toISOString(),
          safeCell(data.name),
          safeCell(data.attendance),
          Number(data.guests) || 0,
          safeCell(data.side),
          safeCell(data.message)
        ]
      },
      wish: {
        name: "Lời chúc",
        headers: ["Thời gian", "Họ tên", "Lời chúc"],
        values: [
          data.created_at || new Date().toISOString(),
          safeCell(data.name),
          safeCell(data.message)
        ]
      }
    };
    const entry = sheets[data.type];
    if (!entry || !data.name) {
      throw new Error("Dữ liệu gửi lên không hợp lệ.");
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      let sheet = spreadsheet.getSheetByName(entry.name);
      if (!sheet) sheet = spreadsheet.insertSheet(entry.name);
      if (sheet.getLastRow() === 0) sheet.appendRow(entry.headers);
      sheet.appendRow(entry.values);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function safeCell(value) {
  const text = String(value || "").trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
