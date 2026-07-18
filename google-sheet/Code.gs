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
 *   - dang_ky_ctv        : someone registered as an affiliate/CTV.
 *   - dang_ky_shophia    : sign-up from the Hương Shophia site.
 *   - dang_ky_san_pham_ai: sign-up from the san-pham-ai.html AI store page.
 *   - quan_tam_don_hang / quan_tam_san_pham_ai : a visitor clicked
 *                         "Nhắn Zalo" / copied the transfer note on a
 *                         payment page — a LEAD, not a confirmed sale.
 *
 * Rows land on the "DuLieu" sheet tab by default. Any POST payload can
 * include a "sheet" field (e.g. { sheet: "SanPhamAI", ... }) to route it
 * to a different tab instead — the tab is auto-created with the same
 * headers on first use. This keeps a new page's sign-ups/leads separate
 * from the CTV referral data without needing a whole new spreadsheet.
 * doGet's stats dashboard still only reads "DuLieu" (used by cong-tac-vien.html).
 *
 * IMPORTANT: nothing here can confirm a bank transfer actually happened.
 * "quan_tam_don_hang" only means someone reached the point of contacting
 * you about an order — always verify against the real transfer/Zalo
 * message before paying out commission or treating it as a sale.
 *
 * After editing this file, you must redeploy for changes to take effect:
 * Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 *
 * ACTIVATION CODES (added for "Xưởng Kịch Bản Video Review Faceless" and any
 * future app using the same lock-screen pattern): GET .../exec?action=check_code
 * &app=review_faceless&code=CODE&callback=fn checks whether CODE exists in the
 * "MaKichHoat_<app>" tab (column A = Mã kích hoạt). One code = one purchase,
 * works forever once activated — no device cap, no expiry, no usage count.
 * Any other columns in that tab (Số lượt đã dùng, Giới hạn thiết bị, Ghi chú)
 * are ignored by this simpler version; safe to leave as-is or repurpose as
 * plain notes.
 */

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = getSheet_(data.sheet);

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
  if (e.parameter && e.parameter.action === 'check_code') {
    return handleCheckCode_(e);
  }

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

function getSheet_(sheetName) {
  var name = sheetName || 'DuLieu';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(['Thời gian', 'Loại', 'Họ tên', 'SĐT', 'Email', 'Mã CTV', 'Sản phẩm', 'Số tiền', 'Trang']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ---------- Activation codes (shared lock-screen pattern for new apps) ----------

function handleCheckCode_(e) {
  var callback = e.parameter && e.parameter.callback;
  var code = String((e.parameter && e.parameter.code) || '').trim();
  var app = String((e.parameter && e.parameter.app) || 'app').trim();

  var result;
  if (!code) {
    result = { status: 'error', message: 'Thiếu mã kích hoạt.' };
  } else {
    result = checkAndMarkCode_(app, code);
  }

  var json = JSON.stringify(result);
  var body = callback ? (callback + '(' + json + ')') : json;
  return ContentService
    .createTextOutput(body)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}

function getCodesSheet_(app) {
  var tabName = 'MaKichHoat_' + app;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(['Mã kích hoạt', 'Ghi chú']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findCodeRow_(sheet, code) {
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === code.trim().toLowerCase()) {
      return i + 1; // 1-indexed row number for Range operations
    }
  }
  return -1;
}

function checkAndMarkCode_(app, code) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getCodesSheet_(app);
    var rowNum = findCodeRow_(sheet, code);
    if (rowNum === -1) {
      return { status: 'error', message: 'Mã kích hoạt không đúng. Vui lòng kiểm tra lại.' };
    }
    return { status: 'ok' };
  } finally {
    lock.releaseLock();
  }
}
