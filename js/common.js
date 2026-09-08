/**
 * common.js - 공통 헤더/푸터 렌더링, 구글 시트 연동 모달, 네비게이션 및 알림(Toast) 유틸리티
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
    const isGasConnected = window.BlogStore && !!window.BlogStore.getGasUrl();

    const navLinksHtml = `
      <nav class="nav-menu" id="navMenu">
        <a href="index.html" class="nav-link ${activePage === 'posts' ? 'active' : ''}">글 목록</a>
        <a href="profile.html" class="nav-link ${activePage === 'profile' ? 'active' : ''}">프로필</a>
        ${user ? `<a href="post-write.html" class="nav-link ${activePage === 'write' ? 'active' : ''} nav-write-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          글 작성
        </a>` : ''}
        <button id="openGasModalBtn" class="nav-link gas-status-btn" title="구글 스프레드시트 연동 상태">
          <span class="gas-indicator ${isGasConnected ? 'connected' : ''}"></span>
          구글 시트 연동
        </button>
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
              <svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
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

    // 이벤트 바인딩
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

    const menuBtn = document.getElementById('menuToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
      });
    }

    // 구글 시트 모달 바인딩
    const openGasBtn = document.getElementById('openGasModalBtn');
    if (openGasBtn) {
      openGasBtn.addEventListener('click', openGasModal);
    }
  }

  // 구글 스프레드시트 연동 모달 창
  function openGasModal() {
    let modal = document.getElementById('gasModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gasModal';
      modal.className = 'modal-backdrop';
      document.body.appendChild(modal);
    }

    const currentGasUrl = window.BlogStore ? window.BlogStore.getGasUrl() : '';
    const sheetUrl = (window.BlogStore && window.BlogStore.GOOGLE_CONFIG.SPREADSHEET_URL) || 'https://docs.google.com/spreadsheets/d/1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc/edit';

    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">Google 스프레드시트 연동 설정</h3>
          </div>
          <button id="closeGasModalBtn" class="modal-close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="gas-target-box">
            <span class="gas-target-lbl">지정된 데이터베이스 스프레드시트</span>
            <a href="${sheetUrl}" target="_blank" rel="noopener noreferrer" class="gas-target-link">
              <span>${sheetUrl}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>

          <div class="editor-form-group">
            <label class="editor-label">Apps Script 웹 앱 URL (Web App URL)</label>
            <input type="url" id="gasUrlInput" class="editor-input" placeholder="https://script.google.com/macros/s/AKfycb.../exec" value="${currentGasUrl}">
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
              스프레드시트 ➔ 확장 프로그램 ➔ Apps Script에서 웹 앱으로 배포한 URL을 입력하세요.
            </div>
          </div>

          <div class="gas-guide-card">
            <h4 style="font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">🚀 연결 3단계 가이드</h4>
            <ol style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; padding-left: 1.2rem;">
              <li>위 스프레드시트 링크 열기 ➔ <strong>[확장 프로그램] ➔ [Apps Script]</strong> 클릭</li>
              <li>[backend/Code.gs] 코드를 복사하여 붙여넣고 저장(Ctrl+S)</li>
              <li>우측 상단 <strong>[배포] ➔ [새 배포]</strong> (유형: 웹 앱, 액세스: <strong>모든 사용자</strong>) 후 생성된 URL을 위 입력창에 붙여넣기</li>
            </ol>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="copyGasCodeBtn" class="btn btn-sm btn-secondary">Apps Script 코드 복사</button>
          <button type="button" id="saveGasUrlBtn" class="btn btn-sm btn-primary">연결 저장 & 즉시 동기화</button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');

    // 모달 이벤트 바인딩
    document.getElementById('closeGasModalBtn').addEventListener('click', () => {
      modal.classList.remove('is-open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });

    document.getElementById('saveGasUrlBtn').addEventListener('click', async () => {
      const url = document.getElementById('gasUrlInput').value.trim();
      if (!url) {
        window.BlogStore.setGasUrl('');
        toast('구글 시트 연동이 해제되었습니다. (로컬 모드 전환)', 'info');
        modal.classList.remove('is-open');
        renderHeader();
        return;
      }

      if (!url.startsWith('https://script.google.com/macros/s/')) {
        toast('올바른 Google Apps Script 웹 앱 URL 형식이 아닙니다.', 'error');
        return;
      }

      window.BlogStore.setGasUrl(url);
      toast('연결 저장 완료! 구글 시트와 데이터 동기화를 시도합니다...', 'info');
      
      const success = await window.BlogStore.syncFromGoogleSheets();
      if (success) {
        toast('구글 스프레드시트와 실시간 연동 성공!', 'success');
        setTimeout(() => { window.location.reload(); }, 800);
      } else {
        toast('URL이 저장되었습니다. (스프레드시트에 새 글 작성 시 자동 기록됩니다)', 'success');
      }
      modal.classList.remove('is-open');
      renderHeader();
    });

    document.getElementById('copyGasCodeBtn').addEventListener('click', () => {
      const sampleCode = `// 스프레드시트 확장 프로그램 > Apps Script에 아래 코드를 넣으세요.
// 깃허브 저장소의 backend/Code.gs 파일에서 전체 소스코드를 확인하실 수 있습니다.`;
      if (navigator.clipboard) {
        fetch('backend/Code.gs')
          .then(res => res.text())
          .then(code => {
            navigator.clipboard.writeText(code);
            toast('Apps Script 전체 코드가 클립보드에 복사되었습니다!', 'success');
          })
          .catch(() => {
            toast('깃허브 저장소 backend/Code.gs 파일을 열어 코드를 복사해주세요.', 'info');
          });
      }
    });
  }

  // 공통 푸터 렌더링
  function renderFooter() {
    const footerPlaceholder = document.getElementById('blogFooter');
    if (!footerPlaceholder) return;

    const sheetUrl = (window.BlogStore && window.BlogStore.GOOGLE_CONFIG.SPREADSHEET_URL) || 'https://docs.google.com/spreadsheets/d/1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc/edit';

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
            <a href="${sheetUrl}" target="_blank" rel="noopener noreferrer" style="color: #10b981; font-weight: 700;">📊 Google 스프레드시트 DB</a>
            <a href="https://github.com/brucecho66/0901_project" target="_blank" rel="noopener noreferrer">GitHub 저장소</a>
          </div>

          <div class="footer-bottom">
            <p class="footer-text">
              © <span id="currentYear">${new Date().getFullYear()}</span> Dev.Blog. Connected with Google Sheets & Hosted on GitHub Pages.
            </p>
            <button id="backToTopBtn" class="back-to-top-btn" aria-label="페이지 맨 위로 이동">
              <span>맨 위로</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            </button>
          </div>
        </div>
      </footer>
    `;

    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  window.BlogCommon = {
    toast,
    renderHeader,
    renderFooter,
    openGasModal
  };

})(window);
