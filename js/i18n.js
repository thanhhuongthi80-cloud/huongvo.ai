// ---------- VI / EN translation toggle ----------
// Each page may define window.PAGE_I18N = { vi: {...}, en: {...} } BEFORE loading this file.
// Elements marked data-i18n="key" get their innerHTML swapped on toggle.
(function(){
  const COMMON = {
    vi: {
      nav_triet_ly: 'Triết Lý Cuộc Sống',
      nav_san_pham: 'Sản Phẩm',
      nav_tac_gia: 'Tác Giả',
      nav_bat_dau: 'Bắt Đầu',
      nav_affiliate: 'Cộng Tác Viên',
      nav_home: 'Trang chủ',
      back_home: '← Trang chủ',
      back_triet_ly: '← Triết Lý Cuộc Sống',
      btn_register: 'Đăng Ký',
      logout_btn: 'Đăng xuất',
      reg_title: 'Đăng Ký Miễn Phí',
      reg_sub: 'Tạo tài khoản để lưu tiến trình đọc và nhận ưu đãi Chìa Khóa Tự Do.',
      reg_name: 'Họ và tên',
      reg_phone: 'Số điện thoại',
      reg_submit: 'Đăng Ký Ngay',
      reg_note: 'Miễn phí · Không cần thẻ tín dụng',
      promo_text: '<strong>CHÌA KHÓA TỰ DO</strong> — Phụ Nữ AI',
      promo_label: 'Kết thúc sau:',
      cd_days: 'ngày',
      zalo_label: 'Nhắn Zalo: 0582 364 021',
      footer_desc: 'Chìa Khóa Tự Do — hệ thống sách &amp; khóa học giúp phụ nữ hiện đại làm chủ cuộc đời cùng AI.',
      footer_nav: 'Điều hướng',
      footer_contact: 'Liên hệ',
      footer_support: 'Hỗ trợ 24/7 qua Zalo',
      footer_bottom: '© 2026 Chìa Khóa Tự Do. Đã đăng ký bản quyền.',
    },
    en: {
      nav_triet_ly: 'Life Philosophy',
      nav_san_pham: 'Products',
      nav_tac_gia: 'Author',
      nav_bat_dau: 'Get Started',
      nav_affiliate: 'Affiliate',
      nav_home: 'Home',
      back_home: '← Home',
      back_triet_ly: '← Life Philosophy',
      btn_register: 'Sign Up',
      logout_btn: 'Log out',
      reg_title: 'Free Sign Up',
      reg_sub: 'Create an account to save your progress and get Freedom Key offers.',
      reg_name: 'Full name',
      reg_phone: 'Phone number',
      reg_submit: 'Sign Up Now',
      reg_note: 'Free · No credit card required',
      promo_text: '<strong>THE FREEDOM KEY</strong> — Women x AI',
      promo_label: 'Ends in:',
      cd_days: 'days',
      zalo_label: 'Chat on Zalo: 0582 364 021',
      footer_desc: 'The Freedom Key — a book &amp; course system helping modern women master their lives with AI.',
      footer_nav: 'Navigate',
      footer_contact: 'Contact',
      footer_support: '24/7 support via Zalo',
      footer_bottom: '© 2026 The Freedom Key. All rights reserved.',
    }
  };

  function mergeDict(base, extra){
    return {
      vi: Object.assign({}, base.vi, (extra && extra.vi) || {}),
      en: Object.assign({}, base.en, (extra && extra.en) || {}),
    };
  }

  const DICT = mergeDict(COMMON, window.PAGE_I18N);

  function applyLang(lang){
    if (!DICT[lang]) lang = 'vi';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = DICT[lang][el.dataset.i18n];
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.documentElement.lang = lang;
    localStorage.setItem('hv_lang', lang);
  }

  window.HVApplyLang = applyLang;

  document.addEventListener('DOMContentLoaded', () => {
    applyLang(localStorage.getItem('hv_lang') || 'vi');
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
  });
})();
