(() => {
  'use strict';

  const KEY_DEADLINE = 'lumen.deadline';
  const KEY_WAITLIST = 'lumen.waitlist';
  const KEY_COUNT = 'lumen.count';

  // ---------- Countdown ----------
  const deadline = (() => {
    const stored = parseInt(localStorage.getItem(KEY_DEADLINE), 10);
    if (stored && stored > Date.now()) return stored;
    const next = Date.now() + 1000 * 60 * 60 * 24 * 30;
    localStorage.setItem(KEY_DEADLINE, String(next));
    return next;
  })();

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
  const cd = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-minutes'),
    s: document.getElementById('cd-seconds'),
  };
  const tick = () => {
    let diff = Math.max(0, deadline - Date.now());
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);  diff -= h * 3600000;
    const m = Math.floor(diff / 60000);    diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    cd.d.textContent = pad(d);
    cd.h.textContent = pad(h);
    cd.m.textContent = pad(m);
    cd.s.textContent = pad(s);
  };
  tick();
  setInterval(tick, 1000);

  // ---------- Header shadow ----------
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Waitlist counter ----------
  const countEl = document.getElementById('waitlistCount');
  const base = 2847;
  let extra = parseInt(localStorage.getItem(KEY_COUNT) || '0', 10);
  const renderCount = () => { countEl.textContent = (base + extra).toLocaleString('pt-BR'); };
  renderCount();

  // ---------- Toast (Toastify from Squeleton) ----------
  const toast = (text, type = 'success') => {
    if (typeof Toastify !== 'function') return;
    Toastify({
      text,
      duration: 3200,
      gravity: 'bottom',
      position: 'center',
      stopOnFocus: true,
      style: {
        background: type === 'success' ? '#1a1613' : '#c0392b',
        borderRadius: '999px',
        padding: '14px 22px',
        fontSize: '14px',
      },
    }).showToast();
  };

  // ---------- Form ----------
  const form = document.getElementById('waitlistForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = form.querySelector('button[type="submit"]');
  const nameInput = form.querySelector('#name');
  const emailInput = form.querySelector('#email');

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const setErr = (input, on) => input.setAttribute('aria-invalid', on ? 'true' : 'false');
  const showFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.className = `form-feedback fs-5 m-15-t ${type}`;
  };

  const getList = () => { try { return JSON.parse(localStorage.getItem(KEY_WAITLIST) || '[]'); } catch { return []; } };
  const saveList = (l) => localStorage.setItem(KEY_WAITLIST, JSON.stringify(l));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const interest = form.querySelector('#interest').value;

    const nameErr = name.length < 2;
    const emailErr = !isEmail(email);
    setErr(nameInput, nameErr);
    setErr(emailInput, emailErr);
    if (nameErr || emailErr) {
      showFeedback('Confira nome e email antes de continuar.', 'error');
      return;
    }

    const list = getList();
    if (list.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
      showFeedback(`Esse email já está na lista, ${name.split(' ')[0]}. Te avisamos em breve.`, 'success');
      toast('Você já estava na lista ✨');
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    await new Promise((r) => setTimeout(r, 900));

    list.push({ name, email, interest, joinedAt: new Date().toISOString() });
    saveList(list);
    extra += 1;
    localStorage.setItem(KEY_COUNT, String(extra));
    renderCount();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    form.reset();
    setErr(nameInput, false);
    setErr(emailInput, false);

    showFeedback(`Pronto, ${name.split(' ')[0]}! Você é o #${(base + extra).toLocaleString('pt-BR')} da lista.`, 'success');
    toast('Bem-vindo à lista Lumen 🌅');
  });

  [nameInput, emailInput].forEach((i) => i.addEventListener('input', () => setErr(i, false)));

  // ---------- Lamp phase cycling ----------
  const lampBody = document.querySelector('.lamp-body');
  const lampGlow = document.querySelector('.lamp-glow');
  if (lampBody && lampGlow) {
    const phases = [
      { body: 'radial-gradient(circle at 40% 35%, #ffe2a8, #f3a267 45%, #d97b3f 85%)', glow: 'rgba(255, 210, 150, .6)' },
      { body: 'radial-gradient(circle at 40% 35%, #fefcf0, #f6eed9 45%, #c9d7e0 85%)', glow: 'rgba(255, 250, 220, .7)' },
      { body: 'radial-gradient(circle at 40% 35%, #ffcb8e, #e0894a 45%, #a26433 85%)', glow: 'rgba(230, 145, 80, .6)' },
      { body: 'radial-gradient(circle at 40% 35%, #f3a267, #a26433 45%, #5c3a20 85%)', glow: 'rgba(200, 110, 50, .5)' },
    ];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % phases.length;
      lampBody.style.background = phases[i].body;
      lampGlow.style.background = `radial-gradient(circle, ${phases[i].glow}, transparent 60%)`;
    }, 3500);
  }
})();
