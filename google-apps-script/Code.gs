function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    new Date(),
    e.parameter.datetime || "",
    e.parameter.activity || "",
  ]);
  return ContentService.createTextOutput("OK");
}
