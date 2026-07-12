/**
 * Hương Võ AI — Google Apps Script logger + stats reader for CTV (affiliate)
 * sign-ups and lead events, backed by a Google Sheet.
 *
 * SETUP (see huong-dan-thiet-lap.md for the step-by-step Vietnamese guide):
 *   1. Paste this whole file into Extensions > Apps Script on your Sheet.
 *   2. Deploy > Manage deployments > edit > Version: New version > Deploy.
 *      (Reuses the same /exec URL already wired into js/auth.js — no need
 *      to send a new URL unless you create a brand new deployment.)
 *
 * "Loại" (type) values written to the sheet:
 *   - dang_ky_ctv       : someone registered as an affiliate/CTV.
 *   - quan_tam_don_hang : a visitor (possibly via a CTV's ?ref= link) clicked
 *                         "Nhắn Zalo" / copied the transfer note on the
 *                         payment page — a LEAD, not a confirmed sale.
 *
 * IMPORTANT: nothing here can confirm a bank transfer actually happened.
 * "quan_tam_don_hang" only means someone reached the point of contacting
 * you about an order — always verify against the real transfer/Zalo
 * message before paying out commission or treating it as a sale.
 */

function doPost(e) {
  var sheet = getSheet_();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.type || '',
    data.name || '',
    data.phone || '',
    data.email || '',
    data.refCode || '',
    data.product || '',
    data.amount || '',
    data.page || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Read-only stats for one CTV's dashboard: GET .../exec?ref=CODE&callback=fn
 * Returns JSONP so it can be loaded cross-origin from the website via a
 * <script> tag (Apps Script Web Apps don't send CORS headers for fetch()).
 */
function doGet(e) {
  var ref = String((e.parameter && e.parameter.ref) || '').trim();
  var callback = e.parameter && e.parameter.callback;

  var stats = { ref: ref, dangKy: 0, quanTam: 0, hoaHongUocTinh: 0 };

  if (ref) {
    var rows = getSheet_().getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var type = row[1];
      var rowRef = String(row[5] || '');
      if (rowRef !== ref) continue;

      if (type === 'dang_ky_ctv') stats.dangKy++;
      if (type === 'quan_tam_don_hang') {
        stats.quanTam++;
        var amount = Number(row[7]) || 0;
        // Rough estimate only (30%) — actual rate depends on the product,
        // confirm the real total manually before paying out.
        stats.hoaHongUocTinh += Math.round(amount * 0.3);
      }
    }
  }

  var json = JSON.stringify(stats);
  var body = callback ? (callback + '(' + json + ')') : json;
  return ContentService
    .createTextOutput(body)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('DuLieu');
  if (!sheet) {
    sheet = ss.insertSheet('DuLieu');
    sheet.appendRow(['Thời gian', 'Loại', 'Họ tên', 'SĐT', 'Email', 'Mã CTV', 'Sản phẩm', 'Số tiền', 'Trang']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
