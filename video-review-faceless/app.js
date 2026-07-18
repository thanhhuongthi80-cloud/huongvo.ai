(function () {
  const CLIP_SECONDS = 8;
  const MIN_CLIPS = 1;
  const MAX_CLIPS = 15;

  // ---------- Breadcrumb / page switching ----------
  const crumbs = document.querySelectorAll('.crumb');
  const pages = { page1: document.getElementById('page1'), page2: document.getElementById('page2') };

  function showPage(id) {
    Object.keys(pages).forEach((key) => {
      pages[key].classList.toggle('hidden', key !== id);
    });
    crumbs.forEach((c) => c.classList.toggle('active', c.dataset.page === id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  crumbs.forEach((c) => {
    c.addEventListener('click', () => showPage(c.dataset.page));
  });

  document.getElementById('editSettingsBtn').addEventListener('click', () => showPage('page1'));

  // ---------- Single-select button groups ----------
  document.querySelectorAll('.btn-grid:not([data-multi]), .toggle-row').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || !group.contains(btn)) return;
      group.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const revealTargets = group.parentElement.querySelectorAll('.custom-input[data-reveal-for]');
      revealTargets.forEach((el) => {
        const show = el.dataset.revealFor === btn.dataset.value;
        el.classList.toggle('hidden', !show);
        if (show) el.focus();
      });
    });
  });

  // ---------- Dropdown "Khác" reveal ----------
  document.querySelectorAll('select').forEach((select) => {
    const customInput = select.closest('.card').querySelector('.custom-input');
    if (!customInput) return;
    select.addEventListener('change', () => {
      const show = select.value === 'Khác';
      customInput.classList.toggle('hidden', !show);
      if (show) customInput.focus();
    });
  });

  // ---------- Multi-select CTA group ----------
  const ctaGroup = document.querySelector('[data-multi="true"]');
  ctaGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || !ctaGroup.contains(btn)) return;
    btn.classList.toggle('active');

    const customInput = document.getElementById('ctaCustom');
    const anyCustomActive = ctaGroup.querySelector('[data-custom="true"].active');
    customInput.classList.toggle('hidden', !anyCustomActive);
    if (anyCustomActive) customInput.focus();

    const discountBlock = document.getElementById('discountBlock');
    const discountActive = ctaGroup.querySelector('[data-value="Đang có giảm giá"].active');
    discountBlock.classList.toggle('hidden', !discountActive);
  });

  // ---------- Stepper ----------
  const clipCount = document.getElementById('clipCount');
  const totalSeconds = document.getElementById('totalSeconds');

  function updateTotal() {
    totalSeconds.textContent = (parseInt(clipCount.value, 10) * CLIP_SECONDS) + ' giây';
  }

  document.getElementById('clipMinus').addEventListener('click', () => {
    const v = Math.max(MIN_CLIPS, parseInt(clipCount.value, 10) - 1);
    clipCount.value = v;
    updateTotal();
  });
  document.getElementById('clipPlus').addEventListener('click', () => {
    const v = Math.min(MAX_CLIPS, parseInt(clipCount.value, 10) + 1);
    clipCount.value = v;
    updateTotal();
  });

  // ---------- Helpers ----------
  function activeValue(groupSelector, fallback) {
    const el = document.querySelector(groupSelector + ' button.active');
    return el ? el.dataset.value : fallback;
  }

  function hookText() {
    const active = document.querySelector('[data-group="hook"] button.active');
    if (!active) return '';
    if (active.dataset.custom === 'true') {
      return document.getElementById('hookCustom').value.trim() || active.dataset.value;
    }
    return active.dataset.value;
  }

  function voiceLangText() {
    const active = document.querySelector('[data-group="voiceLang"] button.active');
    if (!active) return '';
    if (active.dataset.custom === 'true') {
      return document.getElementById('voiceLangCustom').value.trim() || active.dataset.value;
    }
    return active.textContent.trim();
  }

  function categoryValue() {
    const select = document.getElementById('category');
    if (select.value === 'Khác') {
      return document.getElementById('categoryCustom').value.trim() || 'Khác';
    }
    return select.value;
  }

  function environmentValue() {
    const select = document.getElementById('environment');
    if (select.value === 'Khác') {
      return document.getElementById('environmentCustom').value.trim() || 'Khác';
    }
    return select.value;
  }

  function discountText() {
    const active = document.querySelector('[data-group="discountType"] button.active');
    if (!active) return '';
    if (active.dataset.value === 'percent') {
      const v = document.getElementById('discountPercentInput').value.trim();
      return v ? 'Giảm ' + v + '%' : '';
    }
    if (active.dataset.value === 'amount') {
      const v = document.getElementById('discountAmountInput').value.trim();
      return v ? 'Giảm ' + v + 'đ' : '';
    }
    return '';
  }

  function ctaList() {
    return Array.from(document.querySelectorAll('[data-group="cta"] button.active')).map((b) => {
      if (b.dataset.custom === 'true') {
        return document.getElementById('ctaCustom').value.trim() || b.dataset.value;
      }
      return b.dataset.value;
    }).filter(Boolean);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function resultSection(opts) {
    const id = 'res_' + Math.random().toString(36).slice(2);
    return (
      '<div class="result-section">' +
        '<div class="rs-head">' +
          '<div class="rs-title-group">' +
            '<span class="rs-icon">' + opts.icon + '</span>' +
            '<h4 style="margin:0;">' + escapeHtml(opts.title) + '</h4>' +
            (opts.tag ? '<span class="rs-tag">' + escapeHtml(opts.tag) + '</span>' : '') +
          '</div>' +
          '<div class="rs-actions">' +
            '<button type="button" class="copy-btn" data-target="' + id + '">📋 Sao chép</button>' +
            '<button type="button" class="download-btn" data-target="' + id + '" data-filename="' + escapeHtml(opts.filename) + '">⬇ Tải về</button>' +
          '</div>' +
        '</div>' +
        (opts.subtitle ? '<p class="rs-subtitle">' + escapeHtml(opts.subtitle) + '</p>' : '') +
        '<pre id="' + id + '">' + escapeHtml(opts.text) + '</pre>' +
      '</div>'
    );
  }

  function buildImagePrompt(p) {
    return (
      'Một người mẫu review sản phẩm duy nhất, không có người thứ hai, phong cách giấu mặt (faceless), ' +
      'người mẫu cầm điện thoại thông minh bằng một tay che đi phần khuôn mặt của mình trước gương ' +
      '(tay còn lại tự do tạo dáng hoặc tương tác với sản phẩm), khuôn mặt hoàn toàn không hiển thị. ' +
      'Sản phẩm chính được thấy rõ và nổi bật là ' + p.productName + (p.desc ? ', ' + p.desc : '') + '. ' +
      'Tư thế đứng tự nhiên, hình ảnh chân thực sắc nét, không chứa chữ hay nhãn văn bản, ' +
      'không đóng dấu bản quyền watermark, không có logo. Bối cảnh xung quanh là ' + p.environment + ', ' +
      'ánh sáng đẹp tự nhiên, bố cục điện ảnh siêu chân thực.'
    );
  }

  function buildVoiceoverScript(p) {
    let s = p.hook + ', hôm nay tôi sẽ khai sáng cho mấy chị em một siêu phẩm ' + p.category.toLowerCase() +
      ' cực đỉnh, chính là em ' + p.productName + ' này đây! ';
    if (p.highlights) {
      const parts = p.highlights.split('\n').map((x) => x.trim()).filter(Boolean);
      s += parts.join(', ') + '. ';
    }
    s += 'Diện lên là tự động nhìn xinh xắn nổi bật hẳn ra, ưng mẫu này thì bấm mua ngay nha. ';
    if (p.discount) {
      s += 'Hiện đang ' + p.discount.toLowerCase() + ' cực sốc, tranh thủ đặt ngay hôm nay nhé vì số lượng có hạn, nhanh tay kẻo hết mất nha. ';
    }
    const spokenCtas = p.ctas.filter((c) => c !== 'Đang có giảm giá');
    if (spokenCtas.length) {
      s += spokenCtas.join(', ') + '. ';
    }
    s += 'Chốt đơn ngay hôm nay để nhận thêm quà xinh xắn nhé!';
    return s;
  }

  function estimateVoiceSeconds(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.round(words / 2.5);
  }

  const LOADING_STAGES = [
    'Đang tổng hợp thông tin sản phẩm...',
    'Đang chọn bối cảnh phù hợp...',
    'Đang soạn câu lệnh tạo ảnh nhân vật...',
    'Đang viết lời thoại voice...',
    'Đang hoàn thiện kịch bản...',
  ];

  function runLoadingAnimation(onDone) {
    const loadingBlock = document.getElementById('loadingBlock');
    const resultWrap = document.getElementById('resultWrap');
    const progressFill = document.getElementById('progressFill');
    const progressPct = document.getElementById('progressPct');
    const loadingStage = document.getElementById('loadingStage');

    resultWrap.classList.add('hidden');
    loadingBlock.classList.remove('hidden');
    progressFill.style.width = '0%';
    progressPct.textContent = 'TIẾN ĐỘ: 0%';

    const totalMs = 2200;
    const stepMs = 60;
    const steps = totalMs / stepMs;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / steps) * 100));
      progressFill.style.width = pct + '%';
      progressPct.textContent = 'TIẾN ĐỘ: ' + pct + '%';
      const stageIndex = Math.min(LOADING_STAGES.length - 1, Math.floor((pct / 100) * LOADING_STAGES.length));
      loadingStage.textContent = LOADING_STAGES[stageIndex];

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          loadingBlock.classList.add('hidden');
          resultWrap.classList.remove('hidden');
          onDone();
        }, 200);
      }
    }, stepMs);
  }

  // ---------- Generate ----------
  document.getElementById('generateBtn').addEventListener('click', () => {
    const productNameEl = document.getElementById('productName');
    const productName = productNameEl.value.trim();
    if (!productName) {
      productNameEl.focus();
      return;
    }

    const desc = document.getElementById('productDesc').value.trim();
    const highlights = document.getElementById('productHighlights').value.trim();
    const category = categoryValue();
    const environment = environmentValue();
    const clips = parseInt(clipCount.value, 10);
    const ratio = activeValue('[data-group="ratio"]', '9:16');
    const promptLang = activeValue('[data-group="promptLang"]', 'en');
    const hook = hookText();
    const voiceLang = voiceLangText();
    const ctas = ctaList();
    const discount = discountText();

    showPage('page2');

    runLoadingAnimation(() => {
      const imagePrompt = buildImagePrompt({ productName, desc, environment });
      const voiceScript = buildVoiceoverScript({ hook, productName, category, highlights, ctas, discount });

      const targetSeconds = clips * CLIP_SECONDS;
      const voiceSeconds = estimateVoiceSeconds(voiceScript);
      const pctOfTarget = Math.round((voiceSeconds / targetSeconds) * 100);

      document.getElementById('resultSummary').textContent =
        'Kịch bản của "' + productName + '" gồm ' + clips + ' clip đã được xây dựng theo chuẩn faceless.';

      document.getElementById('resultBox').innerHTML =
        resultSection({
          icon: '🖼️',
          title: 'PHẦN 1: CÂU LỆNH TẠO ẢNH (MIDJOURNEY / FLUX)',
          subtitle: 'Sao chép dán vào AI vẽ ảnh để tạo nhân vật giấu mặt cầm điện thoại che mặt làm gốc',
          text: imagePrompt,
          filename: 'cau-lenh-tao-anh.txt',
        }) +
        resultSection({
          icon: '🔊',
          title: 'PHẦN 2: LỜI THOẠI VOICE (VOICEOVER SCRIPT)',
          tag: voiceLang,
          subtitle: 'Lời thoại đọc cho cả video. Độ dài ước tính: ~' + voiceSeconds + 's (' + pctOfTarget + '% của tổng ' + targetSeconds + 's video)',
          text: voiceScript,
          filename: 'loi-thoai-voice.txt',
        }) +
        resultSection({
          icon: '🎬',
          title: 'CÂU LỆNH VIDEO (SORA / VEO / KLING)',
          subtitle: 'Dùng cho AI dựng video từ ảnh nhân vật ở Phần 1',
          text:
            '[Video prompt — ' + promptLang.toUpperCase() + ' | ' + ratio + ' | ' + clips + ' clip x ' + CLIP_SECONDS + 's = ' + targetSeconds + 's]\n\n' +
            'Product: ' + productName + ' (' + category + ')\n' +
            'Setting: ' + environment + '\n' +
            'Style: faceless product review, natural handheld motion, soft daylight, UGC aesthetic\n' +
            'Details: ' + (desc || '—') + '\n' +
            'Key features to showcase: ' + (highlights || '—') + '\n' +
            'Aspect ratio: ' + ratio,
          filename: 'cau-lenh-video.txt',
        });

      const withinRange = pctOfTarget >= 85 && pctOfTarget <= 115;
      document.getElementById('durationBar').innerHTML =
        '<span>Tổng thời lượng video: <strong>' + targetSeconds + ' giây</strong> (' + clips + ' clip × ' + CLIP_SECONDS + 's)</span>' +
        '<span class="sep">|</span>' +
        '<span>Thời lượng voiceover ước tính: <strong>' + voiceSeconds + ' giây</strong> (~' + pctOfTarget + '%)</span>' +
        '<span class="sep">|</span>' +
        '<span class="' + (withinRange ? 'ok-note' : 'warn-note') + '">' +
          (withinRange ? '✓ Độ dài phù hợp, vừa vặn với video' : '⚠ Nên điều chỉnh số clip hoặc nội dung cho khớp thời lượng') +
        '</span>';

      document.querySelectorAll('.copy-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const target = document.getElementById(btn.dataset.target);
          try {
            await navigator.clipboard.writeText(target.textContent);
            const original = btn.textContent;
            btn.textContent = 'Đã chép';
            setTimeout(() => { btn.textContent = original; }, 1500);
          } catch (e) {}
        });
      });

      document.querySelectorAll('.download-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = document.getElementById(btn.dataset.target);
          downloadText(btn.dataset.filename, target.textContent);
        });
      });
    });
  });
})();
