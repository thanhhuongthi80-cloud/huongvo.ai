(function () {
  // Shared Apps Script Web App (google-sheet/Code.gs) — same URL already used
  // by js/auth.js for the CTV system. The "app" param routes to this app's
  // own "MaKichHoat_review_faceless" tab so codes don't mix with other apps.
  var WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw9shQIMN2cV5RD0hJhU8PA1YKNZ0aw8Us1o-L7QqTTu3UYfoYL7pjvwAG7BuI91liv3w/exec';
  var APP_ID = 'review_faceless';
  var STORAGE_KEY = 'vrf_activated_code';

  var gate = document.getElementById('activationGate');
  var appRoot = document.getElementById('appRoot');
  var input = document.getElementById('activationCodeInput');
  var btn = document.getElementById('activationSubmitBtn');
  var errorEl = document.getElementById('gateError');

  function unlock() {
    gate.classList.add('hidden');
    appRoot.classList.remove('app-hidden');
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.remove('hidden');
  }

  if (localStorage.getItem(STORAGE_KEY)) {
    unlock();
    return;
  }

  function jsonp(params) {
    return new Promise(function (resolve, reject) {
      var cbName = 'vrf_cb_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
      var script = document.createElement('script');
      var timer = setTimeout(function () {
        cleanup();
        reject(new Error('timeout'));
      }, 15000);

      function cleanup() {
        clearTimeout(timer);
        delete window[cbName];
        script.remove();
      }

      window[cbName] = function (data) {
        cleanup();
        resolve(data);
      };

      var qs = new URLSearchParams(Object.assign({}, params, { callback: cbName })).toString();
      script.src = WEBAPP_URL + '?' + qs;
      script.onerror = function () {
        cleanup();
        reject(new Error('network'));
      };
      document.body.appendChild(script);
    });
  }

  function submitCode() {
    var code = input.value.trim();
    errorEl.classList.add('hidden');

    if (!code) {
      input.focus();
      return;
    }

    if (!WEBAPP_URL) {
      showError('Chưa gắn địa chỉ kiểm tra mã kích hoạt. Vui lòng liên hệ để được hỗ trợ.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Đang kiểm tra...';

    jsonp({ action: 'check_code', app: APP_ID, code: code })
      .then(function (res) {
        if (res.status === 'ok') {
          localStorage.setItem(STORAGE_KEY, code);
          unlock();
        } else {
          showError(res.message || 'Mã kích hoạt không đúng. Vui lòng kiểm tra lại.');
        }
      })
      .catch(function () {
        showError('Không kết nối được để kiểm tra mã. Vui lòng thử lại.');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Xác nhận mã';
      });
  }

  btn.addEventListener('click', submitCode);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') submitCode();
  });
})();
