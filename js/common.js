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

        <div class="nav-menu-mobile-auth">
          ${user ? `
            <a href="profile.html" class="btn btn-sm btn-secondary ${activePage === 'profile' ? 'active' : ''}">
              <img src="${user.avatar || 'assets/images/profile.svg'}" alt="${user.name}" class="header-avatar-xs">
              <span>프로필 (${user.name})</span>
            </a>
            <button id="mobileLogoutBtn" class="btn btn-sm btn-secondary header-logout-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>로그아웃</span>
            </button>
          ` : `
            <a href="login.html" class="btn btn-sm btn-secondary ${activePage === 'login' ? 'active' : ''}">로그인</a>
            <a href="signup.html" class="btn btn-sm btn-primary ${activePage === 'signup' ? 'active' : ''}">회원가입</a>
          `}
        </div>
      </nav>
    `;

    const userActionsHtml = user ? `
      <div class="header-auth-buttons header-user-menu">
        <a href="post-write.html" class="btn btn-sm btn-primary header-write-btn ${activePage === 'write' ? 'active' : ''}" title="새 글 작성">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          <span class="btn-text">글쓰기</span>
        </a>
        <a href="profile.html" class="btn btn-sm btn-secondary header-profile-btn ${activePage === 'profile' ? 'active' : ''}" id="headerProfileBtn" title="${user.name} 프로필">
          <img src="${user.avatar || 'assets/images/profile.svg'}" alt="${user.name}" class="header-avatar-xs">
          <span class="btn-text">프로필</span>
        </a>
        <button id="headerLogoutBtn" class="btn btn-sm btn-secondary header-logout-btn" title="로그아웃">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span class="btn-text">로그아웃</span>
        </button>
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
    function handleLogout() {
      if (window.BlogStore) {
        window.BlogStore.logout();
        toast('안전하게 로그아웃되었습니다.', 'info');
        setTimeout(() => {
          if (window.location.pathname.endsWith('profile.html') || window.location.pathname.endsWith('post-write.html')) {
            window.location.href = 'index.html';
          } else {
            window.location.reload();
          }
        }, 500);
      }
    }

    const logoutBtn = document.getElementById('headerLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', handleLogout);
    }

    const menuBtn = document.getElementById('menuToggleBtn');
    const navMenu = document.getElementById('navMenu');
    if (menuBtn && navMenu) {
      menuBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        navMenu.classList.toggle('open', isOpen);
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
          <button id="closeGasModalBtn" class="modal-close-btn" aria-label="닫기">&times;</button>
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
            <label class="editor-label" for="gasUrlInput">Apps Script 웹 앱 URL (끝자리가 <strong>/exec</strong> 여야 합니다)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="url" id="gasUrlInput" class="editor-input" style="flex: 1;" placeholder="https://script.google.com/macros/s/AKfycb.../exec" value="${currentGasUrl}">
              <button type="button" id="testGasUrlBtn" class="btn btn-sm btn-secondary" style="white-space: nowrap; font-weight: 700;">실시간 진단 테스트</button>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
              ※ <code>/dev</code> 로 끝나는 테스트 배포 URL은 Google 로그인 차단으로 인해 연동되지 않으므로 반드시 <strong>/exec</strong> 웹 앱 URL을 사용하세요.
            </div>
          </div>

          <div id="gasTestResultBox" style="display: none; margin-top: 1rem;"></div>

          <div class="gas-guide-card">
            <h4 style="font-size: 0.875rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.4rem;">
              <span>🚀 3분 완성 스프레드시트 배포 가이드</span>
            </h4>
            <ol style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.65; padding-left: 1.2rem; margin: 0;">
              <li>스프레드시트 열기 ➔ 상단 메뉴 <strong>[확장 프로그램] ➔ [Apps Script]</strong> 클릭</li>
              <li>하단 <strong>[Apps Script 최신 코드 복사]</strong> 클릭 후 붙여넣고 <strong>Ctrl + S</strong> 저장</li>
              <li>상단 도구바에서 <strong>testApi</strong> 선택 ➔ <strong>▷ 실행</strong> 클릭하여 권한 최초 승인</li>
              <li>우측 상단 <strong>[배포] ➔ [새 배포]</strong> 클릭:
                <br>• 유형: <strong>웹 앱</strong>
                <br>• 실행할 사용자: <strong>나</strong>
                <br>• 액세스 권한: <strong style="color: #10b981;">모든 사용자(Anyone)</strong> (필수!)
              </li>
              <li>발급된 <strong>웹 앱 URL(/exec)</strong>을 위 입력창에 넣고 [연결 저장] 클릭</li>
            </ol>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="copyGasCodeBtn" class="btn btn-sm btn-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Apps Script 최신 코드 복사
          </button>
          <button type="button" id="saveGasUrlBtn" class="btn btn-sm btn-primary">연결 저장 & 즉시 동기화</button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');

    const resultBox = document.getElementById('gasTestResultBox');
    const urlInput = document.getElementById('gasUrlInput');

    function showTestResult(status, message, details) {
      resultBox.style.display = 'block';
      let bgColor = '#f8fafc';
      let borderColor = '#cbd5e1';
      let textColor = '#334155';
      let icon = 'ℹ️';

      if (status === 'success') {
        bgColor = 'rgba(16, 185, 129, 0.1)';
        borderColor = '#10b981';
        textColor = '#065f46';
        icon = '✅';
      } else if (status === 'error') {
        bgColor = 'rgba(239, 68, 68, 0.1)';
        borderColor = '#ef4444';
        textColor = '#991b1b';
        icon = '⚠️';
      } else if (status === 'loading') {
        bgColor = 'rgba(59, 130, 246, 0.08)';
        borderColor = '#3b82f6';
        textColor = '#1e40af';
        icon = '⏳';
      }

      resultBox.innerHTML = `
        <div style="background-color: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 8px; padding: 0.85rem 1rem; font-size: 0.825rem; color: ${textColor}; line-height: 1.5;">
          <div style="font-weight: 700; margin-bottom: 0.25rem;">${icon} ${message}</div>
          ${details ? `<div style="font-size: 0.775rem; margin-top: 0.4rem; color: var(--text-secondary);">${details}</div>` : ''}
        </div>
      `;
    }

    // 진단 테스트 버튼 이벤트
    document.getElementById('testGasUrlBtn').addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) {
        showTestResult('error', 'URL이 입력되지 않았습니다.', '스프레드시트에서 발급받은 웹 앱 URL을 먼저 입력해 주세요.');
        return;
      }

      showTestResult('loading', '스프레드시트와 실시간 통신 상태를 진단 중입니다...', 'Google 서버 응답을 확인하고 있습니다.');
      
      const res = await window.BlogStore.testConnection(url);
      if (res.success) {
        showTestResult('success', res.message, '스프레드시트 DB와 양방향 통신이 원활합니다. [연결 저장 & 즉시 동기화]를 눌러 적용하세요!');
      } else {
        let hint = '';
        if (res.code === 'DEV_URL') {
          hint = '👉 <strong>해결 방법</strong>: [배포] ➔ [새 배포] ➔ 액세스 권한을 <strong>"모든 사용자(Anyone)"</strong>로 설정하고 생성된 <code>/exec</code> URL을 입력해 주세요.';
        } else if (res.code === 'DOGET_NOT_FOUND') {
          hint = '👉 <strong>해결 방법</strong>: Apps Script 편집기에서 코드를 붙여넣고 <strong>Ctrl + S</strong> 저장한 후, [배포] ➔ [새 배포]를 진행해 주세요.';
        } else if (res.code === 'AUTH_REQUIRED') {
          hint = '👉 <strong>해결 방법</strong>: [새 배포] 시 액세스 권한 항목이 <strong>"모든 사용자"</strong>로 선택되었는지 확인해 주세요.';
        }
        showTestResult('error', res.message, hint);
      }
    });

    // 닫기 버튼
    document.getElementById('closeGasModalBtn').addEventListener('click', () => {
      modal.classList.remove('is-open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });

    // 저장 & 동기화 버튼
    document.getElementById('saveGasUrlBtn').addEventListener('click', async () => {
      const url = urlInput.value.trim();
      if (!url) {
        window.BlogStore.setGasUrl('');
        toast('구글 시트 연동이 해제되었습니다. (로컬 모드 유지)', 'info');
        modal.classList.remove('is-open');
        renderHeader();
        return;
      }

      if (url.includes('/dev')) {
        toast('테스트 배포(/dev) URL은 연동할 수 없습니다. /exec URL을 입력하세요.', 'error');
        return;
      }

      if (!url.startsWith('https://script.google.com/macros/s/')) {
        toast('올바른 Google Apps Script 웹 앱 URL 형식이 아닙니다.', 'error');
        return;
      }

      window.BlogStore.setGasUrl(url);
      toast('연결 저장 완료! 데이터 동기화 시도 중...', 'info');
      
      const success = await window.BlogStore.syncFromGoogleSheets();
      if (success) {
        toast('구글 스프레드시트와 실시간 연동 성공!', 'success');
        setTimeout(() => { window.location.reload(); }, 800);
      } else {
        toast('URL이 저장되었습니다. 로컬 저장소와 병행 동작합니다.', 'success');
      }
      modal.classList.remove('is-open');
      renderHeader();
    });

    // 코드 복사 버튼
    document.getElementById('copyGasCodeBtn').addEventListener('click', () => {
      fetch('backend/Code.gs')
        .then(res => res.text())
        .then(code => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(() => {
              toast('Apps Script 최신 코드가 복사되었습니다! Apps Script 편집기에 붙여넣으세요.', 'success');
            }).catch(() => {
              fallbackCopy(code);
            });
          } else {
            fallbackCopy(code);
          }
        })
        .catch(() => {
          toast('backend/Code.gs 파일에서 코드를 확인하실 수 있습니다.', 'info');
        });
    });

    function fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toast('Apps Script 코드가 복사되었습니다!', 'success');
      } catch (err) {
        toast('복사 실패: 저장소의 backend/Code.gs를 열어주세요.', 'error');
      }
      document.body.removeChild(textarea);
    }
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
