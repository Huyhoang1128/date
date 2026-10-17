const HEADERS = ["Thời gian gửi", "Tên", "Số người", "Nhà hàng", "Hoạt động", "Lời nhắn"];
const RESTAURANT_COL = 4; // cột "Nhà hàng", đếm từ 1

function doPost(e) {
  const sheet = getSheet();
  sheet.appendRow([
    new Date(),
    e.parameter.name || "",
    e.parameter.guests || "",
    e.parameter.restaurant || "",
    e.parameter.activity || "",
    e.parameter.notes || "",
  ]);
  return ContentService.createTextOutput("OK");
}

// Trả về các nhà hàng đã được gợi ý kèm số phiếu, để trang hiện cho người sau chọn
function doGet() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  const rows = lastRow > 1 ? sheet.getRange(2, RESTAURANT_COL, lastRow - 1, 1).getValues() : [];

  // Gộp các tên chỉ khác nhau ở hoa/thường hoặc khoảng trắng, giữ cách viết của người gợi ý đầu tiên
  const byKey = {};
  rows.forEach(([value]) => {
    const name = String(value).trim();
    if (!name) return;
    const key = name.toLowerCase().replace(/\s+/g, " ");
    if (!byKey[key]) byKey[key] = { name, votes: 0 };
    byKey[key].votes++;
  });

  const restaurants = Object.values(byKey).sort((a, b) => b.votes - a.votes);
  return ContentService.createTextOutput(JSON.stringify({ restaurants }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}
