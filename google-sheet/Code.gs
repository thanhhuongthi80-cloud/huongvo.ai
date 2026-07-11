/**
 * Hương Võ AI — Google Apps Script logger for CTV (affiliate) sign-ups
 * and order/checkout events, written to a Google Sheet.
 *
 * SETUP (see huong-dan-thiet-lap.md for the step-by-step Vietnamese guide):
 *   1. Paste this whole file into Extensions > Apps Script on your Sheet.
 *   2. Deploy > New deployment > Web app > Execute as: Me, Access: Anyone.
 *   3. Copy the resulting /exec URL and send it back so it can be wired
 *      into js/auth.js (SHEET_WEBAPP_URL).
 *
 * This only logs events the browser can see (a CTV registering, or a
 * visitor reaching the payment page with a referral code). It cannot
 * confirm a bank transfer actually happened — that still needs a manual
 * check against the transfer content/Zalo message.
 */

function doPost(e) {
  var sheet = getSheet_();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.type || '',
    data.name || '',
    data.phone || '',
    data.refCode || '',
    data.product || '',
    data.amount || '',
    data.page || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DuLieu');
  if (!sheet) {
    sheet = ss.insertSheet('DuLieu');
    sheet.appendRow(['Thời gian', 'Loại', 'Họ tên', 'SĐT', 'Mã CTV', 'Sản phẩm', 'Số tiền', 'Trang']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
