// Baseline UI — Base Site Scripts
// Applies to all pages; minimal shared behaviour
// License: MIT License

(function () {
  'use strict';

  // Confirm page matches nav item — helps catch copy-paste errors
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-bar .nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPath) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  console.log(
    '%cBaseline UI',
    'font-size: 18px; font-weight: 700; color: #6750a4;'
  );
  console.log(
    '%cOriginal source: baseline-ui repository\nCode: MIT · Text: CC BY-NC-ND 4.0',
    'font-size: 13px; color: #555;'
  );
})();
