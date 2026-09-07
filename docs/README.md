# 📄 개인 프로필 페이지 프로젝트 문서

HTML5, CSS3, Vanilla JavaScript를 활용하여 제작하는 반응형 개인 프로필 및 포트폴리오 웹사이트의 기획 및 개발 문서입니다.

---

## 📌 목차
1. [프로젝트 개요](file:///C:/Users/SAMSUNG%20ATIV%20LAPTOP/Desktop/0901/docs/requirements.md#프로젝트-개요)
2. [기능 및 섹션 요구사항](file:///C:/Users/SAMSUNG%20ATIV%20LAPTOP/Desktop/0901/docs/requirements.md)
3. [디자인 시스템 가이드](file:///C:/Users/SAMSUNG%20ATIV%20LAPTOP/Desktop/0901/docs/design_system.md)
4. [구현 로드맵 및 체크리스트](file:///C:/Users/SAMSUNG%20ATIV%20LAPTOP/Desktop/0901/docs/checklist.md)

---

## 🛠 권장 프로젝트 파일 구조 (`frontend/`)

```text
frontend/
├── index.html              # 메인 HTML 구조
├── css/
│   ├── reset.css           # 브라우저 기본 스타일 초기화
│   ├── variables.css       # 컬러, 폰트 등 CSS 변수 (라이트/다크 모드)
│   └── style.css           # 컴포넌트 및 레이아웃 스타일
├── js/
│   ├── theme.js            # 다크/라이트 모드 테마 전환 로직
│   └── main.js             # 네비게이션, 스크롤 인터랙션 등 메인 스크립트
└── assets/
    ├── images/             # 프로필 사진, 프로젝트 스크린샷
    └── icons/              # 파비콘 및 SVG 아이콘
```

---

## 🎯 개발 목표
- **순수 웹 기술 기반**: 별도의 무거운 프레임워크(React/Vue 등) 없이 순수 HTML/CSS/JavaScript로 가볍고 빠른 성능 제공.
- **반응형 웹 (Responsive Web)**: 모바일, 태블릿, 데스크톱 등 모든 디바이스에서 최적화된 레이아웃 제공.
- **시맨틱 마크업 (Semantic HTML)**: 웹 표준 및 웹 접근성(A11y), SEO를 고려한 태그(`header`, `nav`, `main`, `section`, `footer`) 활용.
- **모던 인터랙션**: 다크모드 토글, 스크롤 애니메이션, 부드러운 탭/모달 등 직관적인 사용자 경험(UX) 제공.
