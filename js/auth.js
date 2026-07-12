// ---------- "Đăng Ký" -> "HV Free" account chip (demo, stored locally) ----------
(function(){
  const STORAGE_KEY = 'hv_user';

  // Paste the Google Apps Script Web App URL here once deployed (see
  // google-sheet/huong-dan-thiet-lap.md). Left empty, logging is a silent no-op.
  const SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzDDaB7d0ZZjsnDb3IfL9VRU7nYqdqheakmffafdd8Ew2N4WriuwPYqmaqbAONmPCb8iQ/exec';

  function logToSheet(payload){
    if (!SHEET_WEBAPP_URL) return;
    try {
      fetch(SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(Object.assign({ page: location.pathname }, payload))
      }).catch(() => {});
    } catch (e) {}
  }
  window.HVLogSheet = logToSheet;
  window.HV_SHEET_URL = SHEET_WEBAPP_URL;

  function getUser(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch(e){ return null; }
  }

  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initials(name){
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'HV';
    const first = parts[0][0] || 'H';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] || 'V');
    return (first + last).toUpperCase();
  }

  function genRefCode(name){
    const base = (name || 'ctv')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z]/g, '')
      .slice(0, 6) || 'ctv';
    const rand = Math.floor(10000 + Math.random() * 90000);
    return base + rand;
  }

  function refLinkFor(code){
    return location.origin + '/?ref=' + code;
  }

  function wireCopy(btn, getText){
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(getText());
        const original = btn.textContent;
        btn.textContent = (window.HVApplyLang && localStorage.getItem('hv_lang') === 'en') ? 'Copied' : 'Đã chép';
        setTimeout(() => { btn.textContent = original; }, 1500);
      } catch (e) {}
    });
  }

  // Remember whoever referred this visitor (?ref=CODE) for the rest of their visit,
  // so it can be attached to their order later on the contact page.
  (function captureRef(){
    const ref = new URLSearchParams(location.search).get('ref');
    if (ref) localStorage.setItem('hv_ref', ref);
  })();

  function reapplyLang(){
    if (window.HVApplyLang) window.HVApplyLang(localStorage.getItem('hv_lang') || 'vi');
  }

  function openModal(){
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.add('open');
  }

  function closeModal(){
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.remove('open');
  }

  function renderAffiliatePanel(){
    const cta = document.getElementById('affiliateCta');
    if (!cta) return;
    const user = getUser();

    if (user) {
      if (!user.refCode) {
        user.refCode = genRefCode(user.name);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
      const link = refLinkFor(user.refCode);
      cta.innerHTML =
        '<div class="ref-link-row">' +
          '<input type="text" readonly id="myRefLink" value="' + escapeHtml(link) + '">' +
          '<button type="button" class="btn btn-primary" id="copyMyRefBtn" data-i18n="aff_copy_link">Sao chép link</button>' +
        '</div>' +
        '<p class="affiliate-note" data-i18n="aff_link_note">Đây là link giới thiệu riêng của bạn. Chia sẻ link này — mọi khách đặt hàng qua link sẽ được ghi nhận cho bạn.</p>';
      wireCopy(document.getElementById('copyMyRefBtn'), () => document.getElementById('myRefLink').value);
    } else {
      cta.innerHTML = '<button type="button" class="btn btn-primary" id="openRegisterAff" data-i18n="aff_cta">Đăng Ký Làm Cộng Tác Viên</button>';
      document.getElementById('openRegisterAff').addEventListener('click', openModal);
    }

    reapplyLang();
  }

  function renderAuthSlot(){
    const slot = document.getElementById('authSlot');
    if (!slot) return;
    const user = getUser();

    if (user) {
      slot.innerHTML =
        '<div class="user-chip" id="userChip">' +
          '<div class="avatar">' + escapeHtml(initials(user.name)) + '</div>' +
          '<div class="user-meta">' +
            '<span class="user-name">' + escapeHtml((user.name || 'Bạn').split(/\s+/)[0]) + '</span>' +
            '<span class="user-tag">Free</span>' +
          '</div>' +
          '<div class="user-dropdown">' +
            '<button type="button" id="logoutBtn" data-i18n="logout_btn">Đăng xuất</button>' +
          '</div>' +
        '</div>';

      const chip = document.getElementById('userChip');
      chip.addEventListener('click', (e) => {
        if (e.target.id === 'logoutBtn') return;
        chip.classList.toggle('open');
      });
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        renderAuthSlot();
      });
      document.addEventListener('click', (e) => {
        if (!chip.contains(e.target)) chip.classList.remove('open');
      });
    } else {
      slot.innerHTML = '<button type="button" class="btn-register" id="openRegister" data-i18n="btn_register">Đăng Ký</button>';
      document.getElementById('openRegister').addEventListener('click', openModal);
    }

    reapplyLang();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAuthSlot();
    renderAffiliatePanel();

    const modal = document.getElementById('registerModal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('registerForm');

    document.querySelectorAll('.js-open-register').forEach((btn) => {
      btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const emailField = document.getElementById('regEmail');
        const email = emailField ? emailField.value.trim() : '';
        if (!name || !phone) return;
        const refCode = genRefCode(name);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, phone, email, refCode }));
        logToSheet({ type: 'dang_ky_ctv', name, phone, email, refCode });
        closeModal();
        form.reset();
        renderAuthSlot();
        renderAffiliatePanel();
      });
    }
  });
})();
