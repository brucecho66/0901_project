# 📋 기능 및 섹션 요구사항 명세서 (Requirements Specification)

본 문서는 개인 프로필 페이지에 포함될 각 섹션의 콘텐츠와 JavaScript 기반 동작 요구사항을 정의합니다.

---

## 1. 페이지 섹션 구성

### 1.1 헤더 및 네비게이션 (Header & Navigation)
- **로고/이름**: 클릭 시 최상단(Hero)으로 부드럽게 스크롤.
- **메뉴 링크**: `About`, `Skills`, `Projects`, `Contact` 메뉴 항목.
- **테마 토글 버튼**: 라이트 모드 / 다크 모드 전환 아이콘 버튼.
- **반응형 햄버거 메뉴**: 모바일 화면(768px 미만)에서 슬라이드 인/드롭다운 형태의 모바일 메뉴 토글.
- **스크롤 고정(Sticky/Fixed)**: 스크롤을 내려도 상단에 고정되며, 스크롤 위치에 따라 반투명 블러(backdrop-filter) 효과 적용.

### 1.2 히어로 섹션 (Hero Section)
- **프로필 이미지**: 깔끔한 원형 또는 라운드 사각형 프로필 사진.
- **한 줄 소개 & 타이틀**: "안녕하세요, 개발자 [이름]입니다" 등 방문자의 시선을 끄는 메인 카피.
- **CTA 버튼 (Call To Action)**:
  - "프로젝트 보러가기" (Projects 섹션으로 이동)
  - "이력서 다운로드 (PDF)" 또는 "연락하기" 버튼.
- **소셜 링크**: GitHub, LinkedIn, 이메일, 기술 블로그 바로가기 아이콘.

### 1.3 자기소개 섹션 (About Me)
- **상세 소개 글**: 본인의 개발 철학, 관심 기술 분야, 문제 해결 경험에 대한 2~3문단 설명.
- **기본 정보 카드**:
  - 이름, 생년월일/연차, 위치, 이메일, 전공/소속.
- **간단한 이력 타임라인 (옵션)**: 학력, 주요 경력, 활동 내역.

### 1.4 기술 스택 섹션 (Skills)
- **카테고리별 분류**:
  - **Frontend**: HTML5, CSS3, JavaScript (ES6+), React/Vue (해당 시)
  - **Backend / Database**: Node.js, Python, PostgreSQL/MySQL 등
  - **Tools & DevOps**: Git, GitHub, VS Code, Figma 등
- **표현 방식**:
  - 기술 아이콘 + 스킬명 배지(Badge) 형태.
  - 또는 숙련도 프로그레스 바(Progress Bar) 형태.

### 1.5 프로젝트 섹션 (Projects)
- **프로젝트 카드 목록**:
  - 대표 썸네일 이미지.
  - 프로젝트 제목 및 한 줄 요약.
  - 사용 기술 태그 (예: `#HTML`, `#CSS`, `#JavaScript`).
  - 버튼: "라이브 데모(Demo)" 링크, "GitHub 코드(Repo)" 링크.
- **모달(Modal) 팝업 (상세 보기)**:
  - 카드 클릭 시 프로젝트 주요 기능, 문제 해결 과정, 기여도 등을 보여주는 모달 창.

### 1.6 연락처 섹션 (Contact)
- **연락 안내 문구**: "협업 및 채용 문의는 언제든 편하게 연락주세요."
- **직접 연락처 정보**: 이메일 주소(클릭 시 `mailto:`), 전화번호 또는 오픈카카오톡/링크드인.
- **간이 문의 폼 (Contact Form)**:
  - 입력 필드: 보낸 사람 이름, 이메일, 제목, 메시지 내용.
  - 유효성 검사(Validation) 및 전송 버튼 (Formspree 또는 EmailJS 연동 고려).

### 1.7 푸터 (Footer)
- 저작권 문구 (`© 2026 [이름]. All rights reserved.`).
- 최상단 이동 버튼 (Back to Top 버튼).

---

## 2. JavaScript 핵심 기능 명세

1. **다크 모드 / 라이트 모드 (Theme Toggle)**
   - 사용자의 시스템 기본 설정(`prefers-color-scheme`) 감지.
   - 테마 변경 시 `localStorage`에 저장하여 새로고침 후에도 유지.
   - `data-theme="dark"` 속성을 `document.documentElement`에 적용.

2. **부드러운 스크롤 & 스크롤스파이 (Smooth Scroll & Scrollspy)**
   - 네비게이션 링크 클릭 시 부드러운 스크롤 이동 (`scroll-behavior: smooth`).
   - 현재 보고 있는 섹션에 맞춰 네비게이션 메뉴 활성화(Active) 표시 (`IntersectionObserver` 활용).

3. **스크롤 애니메이션 (Fade-in on Scroll)**
   - 각 섹션 또는 카드가 화면에 20% 이상 노출될 때 위로 살짝 떠오르며 나타나는 애니메이션 적용.

4. **모바일 네비게이션 토글**
   - 햄버거 버튼 클릭 시 메뉴 펼침/닫힘 상태 전환 및 배경 스크롤 방지.
