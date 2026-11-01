// Countdown – Zieldatum steht in index.html (data-target am #countdown)
const cd = document.getElementById('countdown');
if (cd) {
  const target = new Date(cd.dataset.target).getTime();
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const s = Math.floor(Math.max(0, target - Date.now()) / 1000);
    document.getElementById('cd-d').textContent = Math.floor(s / 86400);
    document.getElementById('cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
    document.getElementById('cd-m').textContent = pad(Math.floor(s % 3600 / 60));
    document.getElementById('cd-s').textContent = pad(s % 60);
  };
  tick();
  setInterval(tick, 1000);
}

// Programm-Tabs
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => b.setAttribute('aria-selected', b === btn));
  document.querySelectorAll('.day').forEach(d => d.hidden = d.id !== btn.dataset.day);
}));

// Mobile-Menü
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', nav.classList.toggle('open'));
});

// Kontaktformular
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  const failText = 'Das Senden hat leider nicht geklappt. Bitte schreiben Sie uns direkt an info@mv-zimmern.de.';
  const show = (text, ok) => { status.textContent = text; status.className = 'form-status ' + (ok ? 'ok' : 'err'); };
  const params = new URLSearchParams(location.search);
  if (params.has('sent')) show('Vielen Dank! Ihre Nachricht wurde gesendet.', true);
  if (params.has('error')) show(failText, false);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Wird gesendet …';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'fetch' } });
      const data = await res.json();
      show(data.message, data.ok);
      if (data.ok) form.reset();
    } catch {
      show(failText, false);
    }
    btn.disabled = false;
  });
}
