# 🎨 디자인 시스템 및 스타일 가이드 (Design System)

일관되고 현대적인 UI/UX를 구축하기 위한 디자인 규칙과 CSS 변수 가이드입니다.

---

## 1. 색상 시스템 (Color Palette)

CSS 변수(`:root`)를 활용하여 라이트 모드와 다크 모드를 유연하게 지원합니다.

### 1.1 라이트 모드 (Default)
| 항목 | 변수명 | 권장 색상 코드 | 용도 |
| :--- | :--- | :--- | :--- |
| 메인 배경색 | `--bg-primary` | `#ffffff` | 전체 페이지 기본 배경 |
| 보조 배경색 | `--bg-secondary` | `#f8f9fa` | 카드, 섹션 구분 배경 |
| 기본 텍스트 | `--text-primary` | `#1f2937` | 본문, 제목 주요 텍스트 |
| 보조 텍스트 | `--text-secondary` | `#6b7280` | 부제목, 날짜, 설명 |
| 포인트 컬러 | `--accent-color` | `#3b82f6` (Blue) | 주요 버튼, 하이라이트 링크 |
| 포인트 호버 | `--accent-hover` | `#1d4ed8` | 버튼 hover 상태 |
| 테두리/구분선 | `--border-color` | `#e5e7eb` | 카드 테두리, 구분선 |

### 1.2 다크 모드 (`[data-theme="dark"]`)
| 항목 | 변수명 | 권장 색상 코드 | 용도 |
| :--- | :--- | :--- | :--- |
| 메인 배경색 | `--bg-primary` | `#0f172a` | 어두운 남색 계열 배경 |
| 보조 배경색 | `--bg-secondary` | `#1e293b` | 다크 카드 배경 |
| 기본 텍스트 | `--text-primary` | `#f8fafc` | 밝은 흰색 계열 텍스트 |
| 보조 텍스트 | `--text-secondary` | `#94a3b8` | 차분한 회색 보조 텍스트 |
| 포인트 컬러 | `--accent-color` | `#60a5fa` | 어두운 배경에서 시인성 높은 블루 |
| 테두리/구분선 | `--border-color` | `#334155` | 어두운 테두리선 |

---

## 2. 타이포그래피 (Typography)

- **기본 폰트 패밀리**:
  - 한국어/영문 공용: `'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`
- **폰트 크기 계층 (Font Scale)**:
  - `Hero Title (h1)`: `2.75rem ~ 3.5rem` (반응형 클램프 적용 권장)
  - `Section Title (h2)`: `2rem ~ 2.25rem` (굵기: 700)
  - `Card Title (h3)`: `1.25rem ~ 1.5rem` (굵기: 600)
  - `Body (p)`: `1rem (16px)` (줄간격: `1.6 ~ 1.7`)
  - `Caption / Badge`: `0.875rem (14px)`

---

## 3. 반응형 브레이크포인트 (Responsive Breakpoints)

- **Mobile (스마트폰)**: `< 768px`
  - 1열(Single Column) 레이아웃
  - 햄버거 네비게이션 활성화
  - 패딩 축소 (16px~20px)
- **Tablet (태블릿)**: `768px ~ 1024px`
  - 2열 그리드 레이아웃
  - 네비게이션 가로형 전환 가능
- **Desktop (데스크톱)**: `> 1024px`
  - 최대 너비 제한: `max-width: 1200px` (가운데 정렬 `margin: 0 auto`)
  - 3열 프로젝트 카드 그리드

---

## 4. UI 컴포넌트 스타일 원칙

1. **카드 컴포넌트**: 부드러운 라운딩(`border-radius: 12px ~ 16px`), 호버 시 가벼운 그림자 및 살짝 올라오는 트랜지션 (`transform: translateY(-4px)`).
2. **버튼 (Button)**: 둥근 모서리, 명확한 클릭 피드백(Active/Hover 애니메이션), 터치에 편리한 최소 높이 44px 보장.
3. **그림자 (Box Shadow)**:
   - 라이트: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
   - 다크: `0 4px 6px -1px rgba(0, 0, 0, 0.3)`
