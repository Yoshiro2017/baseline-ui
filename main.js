// Baseline UI — Base Site Scripts
// Theme: light/dark with localStorage persistence
// License: MIT License

(function () {
  'use strict';

  // === THEME SYSTEM ===
  const STORAGE_KEY = 'baseline-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeButton(theme);
  }

  function toggleTheme() {
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }

  function updateThemeButton(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
      ? '<span class="material-symbols-outlined" style="font-size:18px;">light_mode</span> Light'
      : '<span class="material-symbols-outlined" style="font-size:18px;">dark_mode</span> Dark';
  }

  // Apply on load
  applyTheme(getPreferredTheme());

  // Attach toggle
  document.addEventListener('click', e => {
    if (e.target.closest('#theme-toggle-btn')) toggleTheme();
  });

  // === NAV ACTIVE STATE ===
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-bar .nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('href') === currentPath);
  });

  console.log('%cBaseline UI', 'font-size:18px; font-weight:700; color:#6750a4;');
})();
