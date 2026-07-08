// ---------- Countdown timer ----------
// Persists a deadline in localStorage so the countdown survives reloads
// but resets to a fresh window once it expires.
(function initCountdown(){
  const STORAGE_KEY = 'promoDeadline';
  const DURATION_MS = (2 * 24 * 60 * 60 + 23 * 60 * 60 + 58 * 60 + 56) * 1000; // 2d 23h 58m 56s

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

  function pad(n){ return String(n).padStart(2, '0'); }

  function tick(){
    const diff = Math.max(0, deadline - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    if (els.days) els.days.textContent = pad(days);
    if (els.hours) els.hours.textContent = pad(hours);
    if (els.mins) els.mins.textContent = pad(mins);
    if (els.secs) els.secs.textContent = pad(secs);

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

// ---------- Language switch (visual only) ----------
(function initLangSwitch(){
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

// ---------- FAQ accordion ----------
(function initFaq(){
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const question = item.querySelector('.faq-q');
    question.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
