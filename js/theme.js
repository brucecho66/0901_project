/**
 * theme.js - 라이트 / 다크 테마 전환 및 저장 관리
 */

(function initTheme() {
  const THEME_KEY = 'portfolio_theme';
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const rootElement = document.documentElement;

  // 1. 저장된 테마 혹은 OS 기본 설정 테마 확인
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
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

  // 3. 초기 테마 적용
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // 4. 버튼 클릭 이벤트 리스너 등록
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = rootElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // 5. OS 테마 설정 실시간 변경 감지 (사용자가 수동 변경하지 않은 경우)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
