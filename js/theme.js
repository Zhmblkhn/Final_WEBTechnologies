// js/theme.js
// Theme toggling via [data-theme] attribute on <html> (or body)
const THEME = (function(){
  const LS_KEY = 'furni_theme';
  let theme = localStorage.getItem(LS_KEY) || 'light';

  function apply() {
    // apply on <html> and body for CSS selectors
    document.documentElement.setAttribute('data-theme', theme);
    document.body && document.body.setAttribute('data-theme', theme);
    // update toggle icon
    const icon = document.getElementById('theme-icon');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'bi bi-moon-stars-fill';
      } else {
        icon.className = 'bi bi-sun-fill';
      }
    }
  }
  function toggle() {
    theme = (theme === 'dark') ? 'light' : 'dark';
    localStorage.setItem(LS_KEY, theme);
    apply();
  }
  function init() {
    // If user has system preference and no explicit saved theme, use it
    if (!localStorage.getItem(LS_KEY)) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = prefersDark ? 'dark' : 'light';
    }
    // attach toggle buttons
    document.querySelectorAll('#theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
    apply();
  }

  return { init, toggle, current: () => theme };
})();
