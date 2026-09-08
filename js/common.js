/**
 * common.js - 공통 헤더/푸터 렌더링, 네비게이션 및 알림(Toast) 유틸리티
 */

(function (window) {
  'use strict';

  // 알림 토스트 (Toast) 표시
  function toast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${type}`;
    
    // 아이콘 매핑
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toastEl.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-text">${message}</div>
    `;

    container.appendChild(toastEl);

    // 자동 페이드아웃 및 제거
    setTimeout(() => {
      toastEl.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toastEl.parentNode) {
          toastEl.parentNode.removeChild(toastEl);
        }
      }, 300);
    }, 3200);
  }

  // 공통 헤더 렌더링 함수
  function renderHeader(activePage = '') {
    const headerPlaceholder = document.getElementById('blogHeader');
    if (!headerPlaceholder) return;

    const user = window.BlogStore ? window.BlogStore.getCurrentUser() : null;

    const navLinksHtml = `
      <nav class="nav-menu" id="navMenu">
        <a href="index.html" class="nav-link ${activePage === 'posts' ? 'active' : ''}">글 목록</a>
        <a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">프로필</a>
        ${user ? `<a href="post-write.html" class="nav-link ${activePage === 'write' ? 'active' : ''} nav-write-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          글 작성
        </a>` : ''}
      </nav>
    `;

    const userActionsHtml = user ? `
      <div class="header-user-menu">
        <a href="profile.html" class="user-profile-badge" title="마이 프로필 이동">
          <img src="${user.avatar || 'assets/images/profile.svg'}" alt="${user.name}" class="header-avatar">
          <span class="header-username">${user.name}</span>
        </a>
        <a href="post-write.html" class="btn btn-sm btn-primary header-write-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span>글쓰기</span>
        </a>
        <button id="headerLogoutBtn" class="btn btn-sm btn-secondary" title="로그아웃">로그아웃</button>
      </div>
    ` : `
      <div class="header-auth-buttons">
        <a href="login.html" class="btn btn-sm btn-secondary ${activePage === 'login' ? 'active' : ''}">로그인</a>
        <a href="signup.html" class="btn btn-sm btn-primary ${activePage === 'signup' ? 'active' : ''}">회원가입</a>
      </div>
    `;

    headerPlaceholder.innerHTML = `
      <header class="header">
        <div class="container nav-container">
          <a href="index.html" class="logo" aria-label="블로그 홈으로 이동">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Dev<span>.Blog</span>
          </a>

          ${navLinksHtml}

          <div class="nav-actions">
            ${userActionsHtml}

            <!-- 테마 전환 버튼 (라이트/다크) -->
            <button id="themeToggleBtn" class="theme-toggle-btn" aria-label="테마 전환 (라이트/다크)">
              <!-- Moon Icon -->
              <svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <!-- Sun Icon -->
              <svg class="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </button>

            <!-- 모바일 햄버거 메뉴 버튼 -->
            <button id="menuToggleBtn" class="hamburger-btn" aria-label="모바일 메뉴 열기" aria-expanded="false">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>
    `;

    // 로그아웃 이벤트 바인딩
    const logoutBtn = document.getElementById('headerLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (window.BlogStore) {
          window.BlogStore.logout();
          toast('안전하게 로그아웃되었습니다.', 'info');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 600);
        }
      });
    }

    // 모바일 햄버거 메뉴 이벤트
    const menuBtn = document.getElementById('menuToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
      });
    }
  }

  // 공통 푸터 렌더링
  function renderFooter() {
    const footerPlaceholder = document.getElementById('blogFooter');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
      <footer class="footer">
        <div class="container footer-content">
          <div class="footer-left">
            <div class="footer-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>Dev.Blog</span>
            </div>
            <p class="footer-desc">기술과 개발에 대한 깊이 있는 고민과 실전 경험을 기록하는 개인 블로그입니다.</p>
          </div>

          <div class="footer-links">
            <a href="index.html">글 목록</a>
            <a href="profile.html">프로필 소개</a>
            <a href="login.html">로그인</a>
            <a href="signup.html">회원가입</a>
            <a href="https://github.com/brucecho66/0901_project" target="_blank" rel="noopener noreferrer">GitHub 저장소</a>
          </div>

          <div class="footer-bottom">
            <p class="footer-text">
              © <span id="currentYear">${new Date().getFullYear()}</span> Dev.Blog. All rights reserved. Hosted on GitHub Pages.
            </p>
            <button id="backToTopBtn" class="back-to-top-btn" aria-label="페이지 맨 위로 이동">
              <span>맨 위로</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            </button>
          </div>
        </div>
      </footer>
    `;

    // 맨 위로 이동 버튼 이벤트
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // 글로벌 노출
  window.BlogCommon = {
    toast,
    renderHeader,
    renderFooter
  };

})(window);
