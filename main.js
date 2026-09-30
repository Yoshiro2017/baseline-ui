// ==============================================
// Baseline UI — Original Source
// JavaScript behavior and page logic
// Source code under MIT License
// ==============================================

// IIFE wrapper — keeps variables private, no clashes with other scripts
(function () {
  'use strict'; // Catch common mistakes — stricter error checking

  // ==============================================
  // NAV HIGHLIGHT — Mark which page you're currently viewing
  // ==============================================
  function initActiveNav() {
    // Get filename from URL e.g. "index.html"
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Check every nav link → add/remove active class
    document.querySelectorAll('.nav-item').forEach(link => {
      const target = link.getAttribute('href');
      const isMatch = (target === currentPage) ||
                      (currentPage === '' && target === 'index.html');
      link.classList.toggle('active', isMatch);
    });
  }

  // ==============================================
  // FONT READY — Confirm custom fonts finished loading
  // ==============================================
  function onFontsReady() {
    document.documentElement.classList.add('fonts-ready');
    console.log('[Baseline UI — Original Source] All fonts loaded');
  }

  // ==============================================
  // TABS — Click to switch between content panels
  // ==============================================
  function initTabs() {
    document.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const group = tab.getAttribute('data-tab');
        const targetId = tab.getAttribute('data-tab-target');

        // Reset all tabs in this group
        document.querySelectorAll(`[data-tab="${group}"]`).forEach(t => {
          t.classList.remove('active');
        });
        // Hide all panels in this group
        document.querySelectorAll(`[data-tab-panel="${group}"]`).forEach(panel => {
          panel.hidden = true;
        });

        // Show selected
        tab.classList.add('active');
        document.getElementById(targetId).hidden = false;
      });
    });
  }

  // ==============================================
  // DISMISS BUTTON — Hide notice banners
  // ==============================================
  function initDismiss() {
    document.querySelectorAll('[data-dismiss]').forEach(button => {
      button.addEventListener('click', () => {
        const selector = button.getAttribute('data-dismiss');
        const container = button.closest(selector);
        if (container) container.style.display = 'none';
      });
    });
  }

  // ==============================================
  // INIT ALL — Run everything when page loads
  // ==============================================
  function initAll() {
    initActiveNav();
    initTabs();
    initDismiss();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Wait for font files
  document.fonts.ready.then(onFontsReady);

  // Expose tools for debugging
  window.Baseline = { initActiveNav, initTabs, initDismiss };
})();
