function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date(),
    e.parameter.datetime || "",
    e.parameter.activity || "",
    e.parameter.notes || "",
  ]);
  return ContentService.createTextOutput("OK");
}
