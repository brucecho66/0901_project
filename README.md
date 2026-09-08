# 📝 Dev.Blog - 개인 기술 블로그 웹 애플리케이션

HTML5, CSS3, Vanilla JavaScript를 기반으로 구현된 반응형 개인 기술 블로그입니다.  
GitHub Pages 정적 호스팅 환경에서 백엔드 서버 없이도 완벽한 회원 인증 및 게시글 CRUD, 댓글, 다크 모드 등을 지원합니다.

🌐 **실시간 배포 주소**: [https://brucecho66.github.io/0901_project/](https://brucecho66.github.io/0901_project/)

---

## 📌 주요 페이지 구성

1. **게시글 목록 페이지 (홈)** - [`index.html`](index.html)
   - 블로그 소개 배너 및 운영자 미니 프로필
   - 실시간 검색(제목, 내용, 태그) 및 카테고리 필터링(프론트엔드, 개발, UI/UX, 회고 등)
   - 정렬 기능 (최신순, 인기순, 좋아요순, 댓글순)
   - 반응형 포스트 카드 그리드

2. **게시글 상세 페이지** - [`post-detail.html`](post-detail.html)
   - 마크다운(Markdown) 서식 렌더링 (코드 블록, 인용구, 목록, 소제목 등)
   - 조회수 자동 집계 및 실시간 좋아요 추천 토글
   - 공유 링크 클립보드 복사
   - 작성자 프로필 카드
   - 실시간 댓글 작성 및 삭제 기능

3. **게시글 작성 및 수정 페이지** - [`post-write.html`](post-write.html)
   - 제목, 카테고리, 태그, 요약글 입력
   - 마크다운 서식 툴바 (H2, H3, 굵게, 기울임, 코드블록, 인용구, 목록, 구분선)
   - 실시간 미리보기(Preview) 탭 전환 기능
   - 작성자 권한 검증 및 글 수정/발행

4. **회원가입 페이지** - [`signup.html`](signup.html)
   - 닉네임, 이메일, 비밀번호 확인 유효성 검사
   - 가입 즉시 자동 로그인 및 환영 알림 제공

5. **로그인 페이지** - [`login.html`](login.html)
   - 이메일/비밀번호 기반 로그인
   - **체험 계정(홍길동) 1초 빠른 로그인** 버튼 지원

6. **프로필 페이지** - [`profile.html`](profile.html)
   - 블로거 소개, 프로필 사진 변경, 한 줄 소개 및 기술 스택 수정
   - 작성한 글 수, 누적 조회수, 받은 좋아요 수 통계 제공
   - '내가 작성한 글 목록' 및 '핵심 기술 스택/가치관' 탭 뷰

---

## 🛠 기술 스택
- **Frontend**: Pure HTML5, Semantic CSS3, Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage (No Backend Server required)
- **Theme**: Light / Dark Mode Toggle (CSS Variables)
- **Deployment**: GitHub Pages (Branch: `main`, Root: `/`)
