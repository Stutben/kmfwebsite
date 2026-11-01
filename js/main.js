// Countdown – Zieldatum steht in index.html (data-target am #countdown)
const cd = document.getElementById('countdown');
const target = new Date(cd.dataset.target).getTime();
const pad = n => String(n).padStart(2, '0');
function tick() {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  document.getElementById('cd-d').textContent = Math.floor(s / 86400);
  document.getElementById('cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
  document.getElementById('cd-m').textContent = pad(Math.floor(s % 3600 / 60));
  document.getElementById('cd-s').textContent = pad(s % 60);
}
tick();
setInterval(tick, 1000);

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
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
});
