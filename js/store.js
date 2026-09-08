/**
 * store.js - 블로그 데이터 스토리지 및 Google Sheets (Apps Script) 연동 모듈
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    USERS: 'devlog_users',
    CURRENT_USER: 'devlog_current_user',
    POSTS: 'devlog_posts',
    INIT: 'devlog_initialized_v2',
    GAS_URL: 'devlog_gas_api_url'
  };

  // 연결된 구글 스프레드시트 설정 정보
  const GOOGLE_CONFIG = {
    SPREADSHEET_ID: '1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc',
    SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc/edit'
  };

  // 초기 시드 데이터 (풍부한 기술 블로그 글)
  const INITIAL_USERS = [
    {
      id: 'u_hong',
      email: 'hong@example.com',
      password: 'password123',
      name: '홍길동',
      avatar: 'assets/images/profile.svg',
      bio: '문제를 집요하게 해결하는 풀스택 웹 개발자입니다. 사용자 중심의 인터랙션과 웹 성능 최적화, 지속 가능한 아키텍처에 관심이 많습니다.',
      techStack: ['JavaScript (ES6+)', 'TypeScript', 'HTML5/CSS3', 'Node.js', 'React', 'Git & GitHub'],
      github: 'https://github.com/brucecho66',
      createdAt: '2026-08-01'
    }
  ];

  const INITIAL_POSTS = [
    {
      id: 'post-1',
      title: '2026년 모던 프론트엔드 성능 최적화 실전 가이드',
      category: '프론트엔드',
      tags: ['성능최적화', 'CoreWebVitals', 'JavaScript', '웹표준'],
      excerpt: '브라우저 렌더링 파이프라인 이해부터 LCP, FID, CLS 등 핵심 웹 바이탈 지표를 대폭 개선하는 실전 테크닉들을 정리합니다.',
      content: `## 🚀 들어가며: 왜 웹 성능인가?

현대 웹 애플리케이션에서 사용자 이탈을 막고 최상의 사용자 경험을 제공하기 위한 첫 번째 조건은 **"압도적인 로딩 속도와 부드러운 반응성"**입니다. 

구글의 조사에 따르면 로딩 시간이 1초에서 3초로 증가할 때 사용자 이탈률은 **32%** 증가합니다. 이번 글에서는 2026년 웹 환경에서 실제로 검증된 성능 최적화 전략을 공유합니다.

---

### 1. 렌더링 경로 최적화 (Critical Rendering Path)
브라우저가 HTML을 파싱하고 화면에 픽셀을 그리기까지의 과정을 최적화해야 합니다:

- **CSS 차단 리소스 줄이기**: 중요한 스타일(Critical CSS)만 인라인으로 넣고, 비필수 CSS는 비동기로 로드합니다.
- **JavaScript 지연 평가**: \`defer\` 및 \`async\` 속성을 적극 활용하여 메인 스레드 블로킹을 방지합니다.
- **웹 폰트 최적화**: \`font-display: swap\` 설정과 \`preconnect\`를 통해 FOIT(Flash of Invisible Text) 현상을 제거합니다.

\`\`\`html
<!-- 폰트 CDN 사전 연결 예시 -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/.../pretendard.min.css" as="style">
\`\`\`

---

### 2. 코어 웹 바이탈 (Core Web Vitals) 공략법
1. **LCP (Largest Contentful Paint)**: 가장 큰 시각적 요소(히어로 이미지, 배너)의 빠른 다운로드를 위해 WebP/AVIF 포맷을 사용하고 이미지 크기를 디바이스 해상도에 맞춥니다.
2. **CLS (Cumulative Layout Shift)**: 이미지나 동영상 태그에 명시적인 \`width\`, \`height\` 또는 \`aspect-ratio\` CSS 속성을 부여하여 화면 덜컹거림을 완벽히 차단합니다.
3. **INP (Interaction to Next Paint)**: 복잡한 연산은 \`requestIdleCallback\` 또는 Web Worker로 분리하여 사용자 클릭 시 프레임 드랍을 막습니다.

> 💡 **핵심 요약:**
> "가장 빠른 코드는 실행되지 않는 코드이고, 가장 빠른 리소스는 다운로드되지 않는 리소스입니다."`,
      authorId: 'u_hong',
      authorName: '홍길동',
      authorAvatar: 'assets/images/profile.svg',
      thumbnail: 'assets/images/profile.svg',
      views: 342,
      likes: 28,
      likedUsers: [],
      createdAt: '2026-09-02T10:30:00.000Z',
      comments: [
        {
          id: 'c-1',
          authorName: '김개발',
          authorAvatar: 'assets/images/profile.svg',
          content: 'CLS 지표 개선 팁이 정말 유용하네요! 실무 프로젝트에 바로 적용해보겠습니다.',
          createdAt: '2026-09-03T14:20:00.000Z'
        },
        {
          id: 'c-2',
          authorName: '이코드',
          authorAvatar: 'assets/images/profile.svg',
          content: '글 구성이 알차고 가독성이 아주 좋습니다. 다음 편도 기대할게요!',
          createdAt: '2026-09-04T09:15:00.000Z'
        }
      ]
    },
    {
      id: 'post-2',
      title: '순수 JavaScript로 구현하는 상태 관리와 컴포넌트 아키텍처',
      category: '개발',
      tags: ['VanillaJS', '상태관리', '아키텍처', '클린코드'],
      excerpt: '외부 프레임워크 의존성 없이 순수 JS(Vanilla JS)의 Proxy와 Observer 패턴을 활용하여 반응형 데이터 바인딩을 구현하는 패턴을 탐구합니다.',
      content: `## 📌 프레임워크 없는 프론트엔드 개발

우리는 종종 당연하다는 듯이 React나 Vue를 먼저 설치하곤 합니다. 하지만 브라우저의 기본 기능과 모던 자바스크립트의 표준 API만으로도 얼마든지 탄탄하고 유지보수하기 쉬운 아키텍처를 구축할 수 있습니다.

이번 아티클에서는 **Observer 패턴**과 **ES6 Proxy**를 이용해 반응형 상태 관리 시스템(Reactive Store)을 직접 만들어봅니다.

---

### 1. Observable Store 구현

\`\`\`javascript
function createStore(initialState) {
  const listeners = new Set();
  
  const state = new Proxy(initialState, {
    set(target, property, value) {
      target[property] = value;
      listeners.forEach(fn => fn(target));
      return true;
    }
  });

  return {
    state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
}
\`\`\`

---

### 2. 가볍고 명확한 구조의 이점
- 번들 사이즈가 0KB에 가까워 브라우저 첫 로딩 속도가 혁신적으로 빠릅니다.
- 프레임워크 버전 업그레이드로 인한 의존성 파편화 위험이 없습니다.
- 웹 표준의 본질적인 이벤트 루프와 돔(DOM) 조작 원리를 깊이 이해하게 됩니다.`,
      authorId: 'u_hong',
      authorName: '홍길동',
      authorAvatar: 'assets/images/profile.svg',
      thumbnail: 'assets/images/profile.svg',
      views: 215,
      likes: 19,
      likedUsers: [],
      createdAt: '2026-09-04T15:00:00.000Z',
      comments: [
        {
          id: 'c-3',
          authorName: '박엔지니어',
          authorAvatar: 'assets/images/profile.svg',
          content: 'Proxy를 활용한 옵저버 패턴 예제가 군더더기 없이 깔끔합니다.',
          createdAt: '2026-09-05T11:40:00.000Z'
        }
      ]
    },
    {
      id: 'post-3',
      title: '확장 가능한 CSS 디자인 시스템과 반응형 레이아웃 구축 노하우',
      category: 'UI/UX',
      tags: ['CSS', '디자인시스템', '다크모드', '반응형'],
      excerpt: 'CSS 변수(Design Tokens)를 기반으로 라이트/다크 테마를 매끄럽게 전환하고, 모바일 퍼스트 반응형 레이아웃을 구현하는 설계 기법입니다.',
      content: `## 🎨 유지보수하기 좋은 CSS의 비결

서비스가 성장함에 따라 스타일 코드는 쉽게 스파게티가 됩니다. 이를 방지하는 가장 확실한 방법은 **디자인 토큰(Design Tokens)**을 체계화하고 일관된 규칙을 적용하는 것입니다.

---

### 1. 시맨틱 컬러 토큰 정의

\`\`\`css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
  --accent-color: #3b82f6;
  --radius-md: 12px;
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  --accent-color: #60a5fa;
}
\`\`\`

컴포넌트 스타일에서는 절대로 고정 색상(\`#ffffff\`)을 직접 사용하지 않고 언제나 의미론적 변수(\`var(--bg-primary)\`)를 참조하도록 강제합니다. 이 규칙 하나만으로도 완벽한 다크모드 대응이 보장됩니다.`,
      authorId: 'u_hong',
      authorName: '홍길동',
      authorAvatar: 'assets/images/profile.svg',
      thumbnail: 'assets/images/profile.svg',
      views: 184,
      likes: 15,
      likedUsers: [],
      createdAt: '2026-09-05T18:20:00.000Z',
      comments: []
    },
    {
      id: 'post-4',
      title: '주니어 개발자에서 성장하며 체득한 클린 코드와 문제 해결 회고',
      category: '회고',
      tags: ['회고', '성장', '커리어', '협업'],
      excerpt: '단순히 동작하는 코드를 넘어서 동료가 읽기 쉽고 변경에 유연한 코드를 작성하기 위해 치열하게 고민했던 경험과 통찰을 나눕니다.',
      content: `## 💭 3년 차 개발자가 돌아본 성장 일기

개발을 처음 배울 때는 "일단 작동하게 만드는 것"이 가장 중요했습니다. 하지만 실제 서비스 환경에서 수많은 버그와 마주치며 깨달은 것은, **"코드는 작성되는 시간보다 읽히고 수정되는 시간이 훨씬 길다"**는 사실이었습니다.

---

### 내가 지키고자 하는 3가지 개발 원칙

1. **명확한 네이밍이 최고의 주석이다**: 변수나 함수명이 그 자체로 의도를 설명할 수 있을 때까지 고민합니다.
2. **함수는 단 한 가지 일만 집중해서 수행한다 (단일 책임 원칙)**: 함수 길이가 길어지면 분리할 타이밍입니다.
3. **실패를 두려워하지 않고 원인을 집요하게 파고든다**: 버그를 만났을 때 대충 땜질하지 않고 발생 근본 원인을 파악합니다.

> "좋은 개발자는 컴퓨터가 이해할 수 있는 코드를 짜지만, 훌륭한 개발자는 인간이 이해할 수 있는 코드를 짠다." - 마틴 파울러`,
      authorId: 'u_hong',
      authorName: '홍길동',
      authorAvatar: 'assets/images/profile.svg',
      thumbnail: 'assets/images/profile.svg',
      views: 412,
      likes: 42,
      likedUsers: [],
      createdAt: '2026-09-06T09:00:00.000Z',
      comments: [
        {
          id: 'c-4',
          authorName: '취준생',
          authorAvatar: 'assets/images/profile.svg',
          content: '개발자로서의 태도와 가치관에 큰 영감을 얻어갑니다. 감사합니다!',
          createdAt: '2026-09-06T13:00:00.000Z'
        }
      ]
    }
  ];

  // 초기화 함수
  function initStore() {
    if (!localStorage.getItem(STORAGE_KEYS.INIT)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      localStorage.setItem(STORAGE_KEYS.INIT, 'true');
    }
    // Google Sheets 연동 URL이 있다면 원격 데이터 동기화 시도
    syncFromGoogleSheets();
  }

  // --- Google Sheets (Apps Script) 연동 API ---

  function getGasUrl() {
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  }

  function setGasUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem(STORAGE_KEYS.GAS_URL, url.trim());
      syncFromGoogleSheets();
      return true;
    } else {
      localStorage.removeItem(STORAGE_KEYS.GAS_URL);
      return false;
    }
  }

  // 원격 구글 시트로부터 게시글 목록 동기화
  async function syncFromGoogleSheets() {
    const gasUrl = getGasUrl();
    if (!gasUrl) return false;

    try {
      const fetchUrl = gasUrl + (gasUrl.includes('?') ? '&' : '?') + 'action=getPosts&_t=' + Date.now();
      const response = await fetch(fetchUrl, {
        method: 'GET',
        mode: 'cors'
      });
      if (!response.ok) return false;

      const data = await response.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        // 원격 구글 시트 게시글과 로컬 게시글 병합 (원격 우선)
        const localPosts = getPosts();
        const mergedMap = new Map();
        
        // 원격 글 먼저 등록
        data.posts.forEach(p => mergedMap.set(p.id, p));
        // 로컬 글 중 원격에 아직 안 올라간 글 유지
        localPosts.forEach(p => {
          if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
        });

        const mergedList = Array.from(mergedMap.values());
        savePosts(mergedList);
        console.log('[DevBlog] 구글 스프레드시트와 실시간 동기화 완료! 총 ' + mergedList.length + '개 글');
        return true;
      }
    } catch (err) {
      console.warn('[DevBlog] 구글 시트 동기화 실패 (오프라인/CORS 설정 확인):', err);
    }
    return false;
  }

  // 원격 구글 시트로 POST 비동기 전송 헬퍼
  function sendToGoogleSheets(payload) {
    const gasUrl = getGasUrl();
    if (!gasUrl) return;

    try {
      // text/plain 형식으로 전송해야 브라우저의 불필요한 CORS preflight(OPTIONS) 차단을 우회할 수 있습니다.
      fetch(gasUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.warn('[DevBlog] 구글 시트 백엔드 전송 경고:', err);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // --- 사용자 (Auth) 관련 API ---

  function getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      const safeUser = { ...user };
      delete safeUser.password;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  function signup({ email, password, name, bio, techStack }) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: '이미 등록된 이메일 계정입니다.' };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      email: cleanEmail,
      password: password,
      name: name.trim() || '블로그 회원',
      avatar: 'assets/images/profile.svg',
      bio: bio ? bio.trim() : '안녕하세요! 반갑습니다.',
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()) : ['Web']),
      github: '',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  function login(email, password) {
    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (!found) {
      return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
    }

    setCurrentUser(found);
    return { success: true, user: found };
  }

  function quickLogin() {
    const users = getUsers();
    const admin = users[0] || INITIAL_USERS[0];
    setCurrentUser(admin);
    return { success: true, user: admin };
  }

  function logout() {
    setCurrentUser(null);
    return { success: true };
  }

  function updateProfile(updateData) {
    const current = getCurrentUser();
    if (!current) return { success: false, message: '로그인이 필요합니다.' };

    const users = getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx === -1) return { success: false, message: '사용자를 찾을 수 없습니다.' };

    const updated = {
      ...users[idx],
      ...updateData,
      id: current.id,
      email: users[idx].email
    };

    users[idx] = updated;
    saveUsers(users);
    setCurrentUser(updated);

    const posts = getPosts();
    let postsChanged = false;
    posts.forEach(p => {
      if (p.authorId === current.id) {
        p.authorName = updated.name;
        p.authorAvatar = updated.avatar;
        postsChanged = true;
      }
    });
    if (postsChanged) savePosts(posts);

    return { success: true, user: updated };
  }

  // --- 게시글 (Posts) 관련 API ---

  function getPosts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POSTS);
      return data ? JSON.parse(data) : INITIAL_POSTS;
    } catch (e) {
      return INITIAL_POSTS;
    }
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }

  function queryPosts({ category = 'all', search = '', tag = '', sort = 'latest' } = {}) {
    let list = [...getPosts()];

    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    if (tag) {
      list = list.filter(p => p.tags && p.tags.includes(tag));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'popular') {
      list.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
    } else if (sort === 'likes') {
      list.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'comments') {
      list.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }

  function getPostById(id) {
    const posts = getPosts();
    return posts.find(p => p.id === id) || null;
  }

  function incrementPostViews(id) {
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (post) {
      post.views = (post.views || 0) + 1;
      savePosts(posts);
      // 구글 스프레드시트로 조회수 비동기 전송
      sendToGoogleSheets({ action: 'viewPost', postId: id });
      return post.views;
    }
    return 0;
  }

  function togglePostLike(id) {
    const user = getCurrentUser();
    const posts = getPosts();
    const post = posts.find(p => p.id === id);
    if (!post) return { success: false, message: '게시글이 존재하지 않습니다.' };

    if (!post.likedUsers) post.likedUsers = [];

    const userKey = user ? user.id : 'guest_' + (localStorage.getItem('devlog_guest_id') || Math.random().toString(36).substring(2, 9));
    if (!user && !localStorage.getItem('devlog_guest_id')) {
      localStorage.setItem('devlog_guest_id', userKey);
    }

    const hasLiked = post.likedUsers.includes(userKey);
    if (hasLiked) {
      post.likedUsers = post.likedUsers.filter(k => k !== userKey);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedUsers.push(userKey);
      post.likes = (post.likes || 0) + 1;
    }

    savePosts(posts);

    // 구글 스프레드시트에 좋아요 비동기 반영
    if (!hasLiked) {
      sendToGoogleSheets({ action: 'likePost', postId: id });
    }

    return { success: true, likes: post.likes, hasLiked: !hasLiked };
  }

  function checkUserLiked(id) {
    const user = getCurrentUser();
    const post = getPostById(id);
    if (!post || !post.likedUsers) return false;
    const userKey = user ? user.id : localStorage.getItem('devlog_guest_id');
    return userKey ? post.likedUsers.includes(userKey) : false;
  }

  function createPost({ title, category, tags, content, excerpt, thumbnail }) {
    const user = getCurrentUser();
    if (!user) return { success: false, message: '로그인이 필요한 작업입니다.' };

    const posts = getPosts();
    const cleanTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
      : (tags || []);

    const safeExcerpt = excerpt && excerpt.trim()
      ? excerpt.trim()
      : content.replace(/[#*`_~>\-\n]/g, ' ').substring(0, 140).trim() + '...';

    const newPost = {
      id: 'post-' + Date.now(),
      title: title.trim(),
      category: category || '개발',
      tags: cleanTags,
      excerpt: safeExcerpt,
      content: content.trim(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || 'assets/images/profile.svg',
      thumbnail: thumbnail || 'assets/images/profile.svg',
      views: 0,
      likes: 0,
      likedUsers: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    savePosts(posts);

    // 구글 스프레드시트에 비동기 전송
    sendToGoogleSheets({
      action: 'createPost',
      id: newPost.id,
      title: newPost.title,
      category: newPost.category,
      tags: newPost.tags,
      excerpt: newPost.excerpt,
      content: newPost.content,
      authorName: newPost.authorName,
      authorAvatar: newPost.authorAvatar,
      createdAt: newPost.createdAt
    });

    return { success: true, post: newPost };
  }

  function updatePost(id, { title, category, tags, content, excerpt, thumbnail }) {
    const user = getCurrentUser();
    const posts = getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) return { success: false, message: '게시글이 존재하지 않습니다.' };
    if (!user || (user.id !== post.authorId && user.role !== 'author')) {
      return { success: false, message: '수정 권한이 없습니다.' };
    }

    const cleanTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
      : (tags || post.tags);

    post.title = title.trim();
    post.category = category || post.category;
    post.tags = cleanTags;
    post.content = content.trim();
    if (excerpt && excerpt.trim()) post.excerpt = excerpt.trim();
    if (thumbnail) post.thumbnail = thumbnail;
    post.updatedAt = new Date().toISOString();

    savePosts(posts);
    return { success: true, post };
  }

  function deletePost(id) {
    const user = getCurrentUser();
    const posts = getPosts();
    const post = posts.find(p => p.id === id);

    if (!post) return { success: false, message: '게시글이 존재하지 않습니다.' };
    if (!user || (user.id !== post.authorId && user.role !== 'author')) {
      return { success: false, message: '삭제 권한이 없습니다.' };
    }

    const filtered = posts.filter(p => p.id !== id);
    savePosts(filtered);
    return { success: true };
  }

  // --- 댓글 (Comments) API ---

  function addComment(postId, { content, authorName, authorAvatar }) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return { success: false, message: '게시글을 찾을 수 없습니다.' };

    const user = getCurrentUser();
    const finalAuthorName = user ? user.name : (authorName && authorName.trim() ? authorName.trim() : '익명 방문자');
    const finalAvatar = user ? user.avatar : (authorAvatar || 'assets/images/profile.svg');

    if (!post.comments) post.comments = [];

    const newComment = {
      id: 'c-' + Date.now(),
      authorId: user ? user.id : null,
      authorName: finalAuthorName,
      authorAvatar: finalAvatar,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
    savePosts(posts);

    // 구글 스프레드시트에 댓글 비동기 전송
    sendToGoogleSheets({
      action: 'addComment',
      postId: postId,
      authorName: finalAuthorName,
      content: newComment.content
    });

    return { success: true, comment: newComment };
  }

  function deleteComment(postId, commentId) {
    const user = getCurrentUser();
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post || !post.comments) return { success: false, message: '해당 댓글이 없습니다.' };

    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return { success: false, message: '댓글이 존재하지 않습니다.' };

    if (user && (user.id === comment.authorId || user.id === post.authorId || user.role === 'author')) {
      post.comments = post.comments.filter(c => c.id !== commentId);
      savePosts(posts);
      return { success: true };
    }

    if (!comment.authorId) {
      post.comments = post.comments.filter(c => c.id !== commentId);
      savePosts(posts);
      return { success: true };
    }

    return { success: false, message: '댓글 삭제 권한이 없습니다.' };
  }

  // --- 헬퍼 유틸리티 ---

  function formatDate(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (e) {
      return isoString;
    }
  }

  function calculateReadingTime(text) {
    if (!text) return '1분';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes}분`;
  }

  function renderMarkdown(md) {
    if (!md) return '';
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="code-block" data-lang="${lang}"><code>${code.trim()}</code></pre>`;
    });

    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^\> (.*$)/gim, '<blockquote><p>$1</p></blockquote>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^---$/gim, '<hr class="divider">');
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<ul') || p.startsWith('<hr')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
  }

  initStore();

  window.BlogStore = {
    // Config & Google Sheets
    GOOGLE_CONFIG,
    getGasUrl,
    setGasUrl,
    syncFromGoogleSheets,

    // Auth
    getUsers,
    getCurrentUser,
    setCurrentUser,
    signup,
    login,
    quickLogin,
    logout,
    updateProfile,

    // Posts
    getPosts,
    queryPosts,
    getPostById,
    incrementPostViews,
    togglePostLike,
    checkUserLiked,
    createPost,
    updatePost,
    deletePost,

    // Comments
    addComment,
    deleteComment,

    // Utils
    formatDate,
    calculateReadingTime,
    renderMarkdown
  };

})(window);
