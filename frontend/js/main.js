/**
 * main.js - 인터랙션, 스크롤 애니메이션, 메뉴 토글, 프로젝트 상세 모달 및 폼 처리
 * docs/requirements.md 명세에 따른 완벽한 기능 구현
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. 모바일 햄버거 메뉴 토글 & 배경 스크롤 방지 (docs/requirements.md 2.4)
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function closeMobileMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    }
  }

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
    });

    // 메뉴 항목 클릭 시 메뉴 닫기
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // 화면 바깥 클릭 시 메뉴 닫기
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. 스크롤스파이 (Scrollspy) - 네비게이션 액티브 표시 (docs/requirements.md 2.2)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 3. 스크롤 페이드인 애니메이션 (Intersection Observer - docs/requirements.md 2.3)
  // --------------------------------------------------------------------------
  const animatedElements = document.querySelectorAll('.fade-in-section');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // 강점 기술 프로그레스 바 너비 애니메이션
          const progressBars = entry.target.querySelectorAll('.strength-bar-fill');
          progressBars.forEach((bar) => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth) {
              bar.style.width = targetWidth;
            }
          });

          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    // 폴백 지원
    animatedElements.forEach((el) => {
      el.classList.add('is-visible');
      const progressBars = el.querySelectorAll('.strength-bar-fill');
      progressBars.forEach((bar) => {
        bar.style.width = bar.getAttribute('data-width') || '85%';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. 프로필 사진 실시간 미리보기 기능
  // --------------------------------------------------------------------------
  const photoInput = document.getElementById('photoInput');
  const profileImg = document.getElementById('profileImg');

  if (photoInput && profileImg) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          profileImg.src = event.target.result;
          showToast('📸 프로필 사진이 성공적으로 반영되었습니다!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. 프로젝트 상세 보기 모달 팝업 (docs/requirements.md 1.5)
  // --------------------------------------------------------------------------
  const projectDetails = {
    1: {
      badge: '웹 생산성 도구 (Productivity)',
      title: '스마트 칸반 태스크 보드 (Smart Kanban Board)',
      summary: '드래그 앤 드롭으로 할 일(To-Do), 진행 중(In Progress), 완료(Done) 상태를 직관적으로 제어할 수 있는 일정 관리 웹 애플리케이션입니다. 외부 상태관리 라이브러리 없이 순수 자바스크립트로 견고한 데이터 모델을 구축했습니다.',
      features: [
        'HTML5 Drag and Drop API를 활용한 부드러운 카드 이동 UX',
        'LocalStorage 연동으로 페이지를 새로고침하거나 브라우저를 닫아도 데이터 영구 보존',
        '태스크 중요도(긴급, 보통, 낮음) 뱃지 부여 및 실시간 검색/필터링',
        '모바일 터치 환경을 고려한 터치 제스처 폴백 지원'
      ],
      troubleshooting: '모바일 뷰포트에서 기본 브라우저 스크롤 동작과 드래그 이벤트가 충돌하는 문제를 발견하여, 터치 시작 시 스크롤을 일시 제어하고 PointerEvents API를 융합하여 크로스 디바이스 드래그 환경을 완성했습니다.',
      tags: ['HTML5', 'CSS Grid', 'Vanilla JS (ES6+)', 'LocalStorage', 'Touch API'],
      demoUrl: '#',
      repoUrl: 'https://github.com'
    },
    2: {
      badge: '금융 및 데이터 시각화 (FinTech)',
      title: '개인 자산 & 지출 대시보드 (Finance Dashboard)',
      summary: '사용자의 월별 수입과 지출 패턴을 한눈에 파악할 수 있도록 도넛 및 막대 차트로 시각화한 반응형 분석 대시보드입니다. 가계부 작성의 번거로움을 덜어주는 직관적인 데이터 통계를 제공합니다.',
      features: [
        'HTML5 Canvas API 기반의 동적 도넛 차트 및 막대 그래프 렌더링',
        '수입/지출 내역 추가, 수정, 삭제(CRUD) 및 카테고리별 자동 합산',
        '날짜별 필터링 기능과 CSV 파일 데이터 내보내기/불러오기 지원',
        '데스크톱 3열에서 모바일 1열로 매끄럽게 변환되는 반응형 그리드'
      ],
      troubleshooting: '고해상도(Retina) 디스플레이에서 Canvas 차트가 번져 보이는 블러 현상을 해결하기 위해, `window.devicePixelRatio` 비율에 맞게 캔버스 내부 버퍼 크기를 2배로 확장 렌더링하여 선명한 그래픽을 구현했습니다.',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API', 'CSV Export', 'Responsive'],
      demoUrl: '#',
      repoUrl: 'https://github.com'
    },
    3: {
      badge: '텍스트 & 에디터 (Developer Tool)',
      title: '실시간 마크다운 노트 에디터 (Markdown Note Engine)',
      summary: '개발자 및 테크 라이터가 웹에서 빠르게 마크다운 문서를 작성하고 즉시 HTML 결과물을 확인할 수 있도록 제작된 분할 뷰 실시간 웹 에디터입니다.',
      features: [
        '정규표현식(RegEx)을 기반으로 한 제목, 강조, 코드 블록, 인용구 즉시 파싱',
        '좌측 작성 영역과 우측 미리보기 영역의 스크롤 위치 동기화(Scroll Sync)',
        '작성한 문서를 HTML 파일 또는 서식 유지 텍스트(.md)로 즉시 다운로드',
        '눈의 피로도를 낮춰주는 다크 모드 맞춤형 문법 하이라이팅 테마'
      ],
      troubleshooting: '장문의 글 작성 시 매 키 입력마다 전체 문서를 재파싱하면서 발생하는 입력 딜레이를 잡기 위해, 150ms 디바운스(Debounce) 알고리즘을 도입하여 렌더링 비용을 70% 이상 절감했습니다.',
      tags: ['Vanilla JS', 'RegEx', 'Blob API', 'Debounce', 'Dark Theme'],
      demoUrl: '#',
      repoUrl: 'https://github.com'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSummary = document.getElementById('modalSummary');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalTrouble = document.getElementById('modalTrouble');
  const modalTags = document.getElementById('modalTags');
  const modalDemoBtn = document.getElementById('modalDemoBtn');
  const modalRepoBtn = document.getElementById('modalRepoBtn');

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !projectModal) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalSummary.textContent = data.summary;
    
    // 주요 기능 리스트
    modalFeatures.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    // 문제 해결
    modalTrouble.textContent = data.troubleshooting;
    // 태그
    modalTags.innerHTML = data.tags.map(t => `<span class="project-tag">${t}</span>`).join('');
    // 링크
    modalDemoBtn.setAttribute('href', data.demoUrl);
    modalRepoBtn.setAttribute('href', data.repoUrl);

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 차단
  }

  function closeProjectModal() {
    if (projectModal && projectModal.classList.contains('active')) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 모달 트리거 버튼 이벤트 연결
  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    // 배경 클릭 시 닫기
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. 이메일 클립보드 원클릭 복사
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const contactEmail = document.getElementById('contactEmail');

  if (copyEmailBtn && contactEmail) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = contactEmail.textContent.trim();
      navigator.clipboard.writeText(emailText).then(() => {
        showToast('📋 이메일 주소가 클립보드에 복사되었습니다!');
      }).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = emailText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('📋 이메일 주소가 클립보드에 복사되었습니다!');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. 이력서 다운로드 버튼 (docs/requirements.md 1.2)
  // --------------------------------------------------------------------------
  const resumeDownloadBtn = document.getElementById('resumeDownloadBtn');
  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('📄 이력서(PDF) 다운로드가 준비 중입니다. 연락처로 문의해 주세요!');
    });
  }

  // --------------------------------------------------------------------------
  // 8. 토스트 알림 (Toast Notification)
  // --------------------------------------------------------------------------
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 9. 맨 위로 가기 버튼 (Back to Top - docs/requirements.md 1.7)
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. 연락처 문의 폼 (Contact Form - docs/requirements.md 1.6)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('messageText');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('모든 필수 항목을 입력해 주세요.');
        return;
      }

      // 이메일 정규식 검사
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        alert('올바른 이메일 주소를 입력해 주세요.');
        emailInput.focus();
        return;
      }

      // 전송 버튼 로딩 상태 전환
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = '메시지 전송 중...';

      setTimeout(() => {
        formAlert.classList.add('success');
        formAlert.textContent = '소중한 메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 회신드리겠습니다!';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('✉️ 메시지가 성공적으로 발송되었습니다.');

        // 5초 후 알림 숨김
        setTimeout(() => {
          formAlert.classList.remove('success');
        }, 5000);
      }, 700);
    });
  }

  // --------------------------------------------------------------------------
  // 11. 푸터 저작권 연도 자동 업데이트
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
