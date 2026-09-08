/**
 * theme.js - 라이트 / 다크 테마 전환 및 영구 저장 관리
 */

(function (window) {
  'use strict';

  const THEME_KEY = 'blog_theme';
  const rootElement = document.documentElement;

  // 1. 저장된 테마 혹은 OS 기본 설정 테마 확인
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem('portfolio_theme');
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  }

  // 2. 테마 적용 함수
  function applyTheme(theme) {
    if (theme === 'dark') {
      rootElement.setAttribute('data-theme', 'dark');
    } else {
      rootElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const isDark = rootElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // 초기 테마 즉시 적용 (화면 깜빡임 방지)
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // 이벤트 위임으로 동적 생성된 #themeToggleBtn도 완벽하게 지원
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#themeToggleBtn');
    if (toggleBtn) {
      toggleTheme();
    }
  });

  // OS 테마 설정 실시간 변경 감지
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  window.ThemeManager = {
    applyTheme,
    toggleTheme,
    getPreferredTheme
  };

})(window);
