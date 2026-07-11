// ---------- Countdown timer ----------
// Persists a deadline in localStorage so the countdown survives reloads
// but resets to a fresh window once it expires.
(function initCountdown(){
  const STORAGE_KEY = 'hvPromoDeadline';
  const DURATION_MS = (372 * 24 * 60 * 60 + 12 * 60 * 60 + 33 * 60 + 58) * 1000;

  let deadline = Number(localStorage.getItem(STORAGE_KEY));
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + DURATION_MS;
    localStorage.setItem(STORAGE_KEY, String(deadline));
  }

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };
  if (!els.days) return;

  function pad(n){ return String(n).padStart(2, '0'); }

  function tick(){
    const diff = Math.max(0, deadline - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    els.days.textContent = days;
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);

    if (diff <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      initCountdown();
    }
  }

  tick();
  setInterval(tick, 1000);
})();

// ---------- Mobile nav toggle ----------
(function initNav(){
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

// ---------- Philosophy card accordion (triet-ly page) ----------
(function initPhiCards(){
  document.querySelectorAll('.phi-card').forEach(card => {
    const toggle = card.querySelector('.phi-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => card.classList.toggle('open'));
  });
})();

// ---------- Affiliate panel toggle (tac-gia page) ----------
(function initAffiliateToggle(){
  const toggle = document.getElementById('affiliateToggle');
  const panel = document.getElementById('affiliatePanel');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    panel.classList.toggle('open');
  });
})();

// ---------- Hero book video (poster shows until a real video file is added) ----------
(function initHeroVideo(){
  const btn = document.getElementById('heroVideoPlay');
  const vid = document.getElementById('heroVideo');
  if (!btn || !vid) return;

  btn.addEventListener('click', () => {
    vid.setAttribute('controls', '');
    vid.play().catch(() => {});
    btn.style.display = 'none';
  });
  vid.addEventListener('ended', () => {
    vid.removeAttribute('controls');
    btn.style.display = '';
  });
  vid.addEventListener('pause', () => {
    if (vid.currentTime === 0) btn.style.display = '';
  });
})();
