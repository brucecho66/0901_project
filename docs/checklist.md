# ✅ 구현 로드맵 및 단계별 체크리스트 (Roadmap & Checklist)

본 문서는 기획된 문서를 바탕으로 실제 HTML, CSS, JavaScript 코드를 작성할 때 따라갈 수 있는 단계별 실행 가이드입니다.

---

## 📌 Phase 1: 기본 환경 및 디렉토리 구성
- [x] `frontend/` 폴더 내에 기본 디렉토리 구조 생성 (`css/`, `js/`, `assets/images/`, `assets/icons/`)
- [x] `frontend/index.html` 기본 골격 생성 (DOCTYPE, meta charset, viewport, SEO 메타태그 등)
- [x] 외부 폰트(Pretendard 등) 및 인라인/벡터 아이콘 링크 설정

---

## 📌 Phase 2: HTML 시맨틱 구조 마크업
- [x] `<header>`: 네비게이션 바, 로고, 테마 스위처 버튼 마크업
- [x] `<main>`:
  - [x] `#hero`: 프로필 사진, 한 줄 소개, CTA 버튼군(프로젝트, 이력서, 연락처), 소셜 링크(GitHub, 이메일, LinkedIn, Blog)
  - [x] `#about`: 자기소개 텍스트, 3대 핵심 역량, 인적 정보 목록, **주요 이력 타임라인 (Timeline)**
  - [x] `#skills`: 본인 핵심 강점 기술(게이지 바) & 카테고리별 기술 스택 태그/뱃지
  - [x] `#projects`: 프로젝트 카드 목록, **상세 보기 모달(Modal) 팝업** 연동
  - [x] `#contact`: 연락처 정보(이메일 복사, GitHub, 전화번호) 및 간이 문의 폼 (이름, 이메일, 제목, 내용)
- [x] `<footer>`: 저작권 표시 및 상단 스크롤 버튼

---

## 📌 Phase 3: CSS 스타일링 및 반응형 디자인
- [x] `css/reset.css`: 브라우저 기본 여백/스타일 초기화 (`box-sizing: border-box` 등)
- [x] `css/variables.css`: `docs/design_system.md` 기준 라이트/다크 모드 컬러셋, 타이포그래피, 1200px 컨테이너 규격 정의
- [x] `css/style.css`:
  - [x] 전역 레이아웃 및 Pretendard 폰트 스타일 적용
  - [x] 플렉스박스(Flexbox) 및 CSS 그리드(CSS Grid) 기반 반응형 섹션 배치
  - [x] 호버(Hover) 효과, 버튼 인터랙션, 카드 그림자, 모달 팝업 스타일링
  - [x] 미디어 쿼리(`@media`) 작성: 모바일(768px 이하) 및 데스크톱 대응

---

## 📌 Phase 4: JavaScript 동적 기능 구현
- [x] **다크 모드 (`theme.js`)**:
  - [x] 테마 토글 버튼 클릭 이벤트 연결
  - [x] `localStorage`를 통한 이전 방문 테마 복원
  - [x] OS 다크모드 선호(`prefers-color-scheme`) 자동 감지
- [x] **네비게이션 및 인터랙션 (`main.js`)**:
  - [x] 모바일 햄버거 메뉴 토글 및 배경 스크롤 방지
  - [x] 스크롤 위치에 따른 헤더 블러/고정 스타일 처리
  - [x] `IntersectionObserver`를 활용한 스크롤 페이드인(Fade-in) 및 강점 게이지 바 애니메이션
  - [x] 상단 이동(Back to top) 버튼 스크롤 연동
  - [x] **프로젝트 상세 보기 모달(Modal) 팝업 열기/닫기/ESC 제어**
  - [x] **이메일 주소 클립보드 원클릭 복사 및 토스트 알림**
  - [x] 프로필 사진 실시간 미리보기 (로컬 파일 업로드 테스트)

---

## 📌 Phase 5: 검토 및 최적화
- [x] 프로필 이미지(벡터 SVG) 및 최적화된 마크업 구성
- [x] 모바일(햄버거 메뉴 및 1열 그리드), 태블릿, PC 화면 크기별 반응형 레이아웃 완료
- [x] 웹 표준 시맨틱 태그 및 웹 접근성 속성(`aria-label`, `alt` 등) 준수
- [ ] GitHub Pages 또는 Netlify/Vercel을 통한 무료 정적 웹 호스팅 배포 (배포 준비 완료)
