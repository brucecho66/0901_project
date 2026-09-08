/**
 * ==========================================================================
 * Google Apps Script - Dev.Blog Backend API (회원가입, 로그인, 게시글, 댓글)
 * 스프레드시트 ID: 1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc
 * ==========================================================================
 * 
 * [지원 기능]
 * 1. 회원가입 (users 시트 자동 생성 및 이메일 중복 검증, 회원 정보 저장)
 * 2. 로그인 (이메일/비밀번호 인증 및 사용자 프로필 반환)
 * 3. 게시글 관리 (posts 시트: 목록 조회, 상세 조회, 새 글 등록, 좋아요, 조회수)
 * 4. 댓글 관리 (comments 시트: 댓글 등록 및 글별 댓글 조회)
 */

const SPREADSHEET_ID = '1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc';

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

// --------------------------------------------------------------------------
// 시트 및 기본 데이터 자동 생성 (users, posts, comments)
// --------------------------------------------------------------------------
function ensureSheets() {
  const ss = getSpreadsheet();

  // 1. users (회원 시트)
  let usersSheet = ss.getSheetByName('users');
  if (!usersSheet) {
    usersSheet = ss.insertSheet('users');
    usersSheet.appendRow([
      'id', 'email', 'password', 'name', 'bio', 'techStack', 'role', 'createdAt'
    ]);
    // 기본 운영자 계정 1개 자동 생성
    usersSheet.appendRow([
      'u_admin',
      'hong@example.com',
      'password123',
      '홍길동',
      '문제를 집요하게 해결하는 풀스택 웹 개발자입니다.',
      'JavaScript, HTML5, CSS3, React',
      'author',
      new Date().toISOString()
    ]);
  }

  // 2. posts (게시글 시트)
  let postsSheet = ss.getSheetByName('posts');
  if (!postsSheet) {
    postsSheet = ss.insertSheet('posts');
    postsSheet.appendRow([
      'id', 'title', 'category', 'tags', 'excerpt', 
      'content', 'authorName', 'authorAvatar', 'views', 'likes', 'createdAt'
    ]);
  }

  // 3. comments (댓글 시트)
  let commentsSheet = ss.getSheetByName('comments');
  if (!commentsSheet) {
    commentsSheet = ss.insertSheet('comments');
    commentsSheet.appendRow([
      'id', 'postId', 'authorName', 'content', 'createdAt'
    ]);
  }

  return { ss, usersSheet, postsSheet, commentsSheet };
}

// --------------------------------------------------------------------------
// 1. GET 요청 핸들러 (조회 전용)
// --------------------------------------------------------------------------
function doGet(e) {
  try {
    const { usersSheet, postsSheet, commentsSheet } = ensureSheets();
    const action = (e && e.parameter && e.parameter.action) || 'getPosts';

    // (1) 특정 게시글 상세 조회
    if (action === 'getPost') {
      const postId = e.parameter.id;
      const post = findPostById(postsSheet, postId);
      const comments = getCommentsForPost(commentsSheet, postId);
      return createJsonResponse({ success: true, post, comments });
    }

    // (2) 전체 게시글 목록 조회
    if (action === 'getPosts') {
      const posts = getAllPosts(postsSheet);
      return createJsonResponse({ success: true, posts });
    }

    // (3) 이메일 중복 확인
    if (action === 'checkEmail') {
      const email = (e.parameter.email || '').trim().toLowerCase();
      const exists = checkUserEmailExists(usersSheet, email);
      return createJsonResponse({ success: true, exists });
    }

    return createJsonResponse({ success: true, message: 'DevBlog API Ready' });

  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// --------------------------------------------------------------------------
// 2. POST 요청 핸들러 (회원가입, 로그인, 글쓰기, 댓글, 좋아요)
// --------------------------------------------------------------------------
function doPost(e) {
  try {
    const { usersSheet, postsSheet, commentsSheet } = ensureSheets();
    const contents = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(contents);
    const action = data.action;

    // ----------------------------------------------------------------------
    // [인증 1] 회원가입 (Signup)
    // ----------------------------------------------------------------------
    if (action === 'signup') {
      const email = (data.email || '').trim().toLowerCase();
      const password = String(data.password || '').trim();
      const name = (data.name || '').trim() || '블로그 회원';
      const bio = (data.bio || '').trim() || '반갑습니다!';
      const techStack = Array.isArray(data.techStack) ? data.techStack.join(', ') : (data.techStack || 'Web');

      if (!email || !password) {
        return createJsonResponse({ success: false, message: '이메일과 비밀번호를 모두 입력해 주세요.' });
      }

      // 중복 체크
      if (checkUserEmailExists(usersSheet, email)) {
        return createJsonResponse({ success: false, message: '이미 등록된 이메일 계정입니다.' });
      }

      const newUserId = 'u_' + Date.now();
      const now = new Date().toISOString();

      const newRow = [
        newUserId,
        email,
        password,
        name,
        bio,
        techStack,
        'member',
        now
      ];

      usersSheet.appendRow(newRow);

      // 비밀번호는 제외하고 반환
      const userSafe = {
        id: newUserId,
        email: email,
        name: name,
        bio: bio,
        techStack: techStack.split(',').map(s => s.trim()),
        role: 'member',
        createdAt: now
      };

      return createJsonResponse({ success: true, user: userSafe });
    }

    // ----------------------------------------------------------------------
    // [인증 2] 로그인 (Login)
    // ----------------------------------------------------------------------
    if (action === 'login') {
      const email = (data.email || '').trim().toLowerCase();
      const password = String(data.password || '').trim();

      if (!email || !password) {
        return createJsonResponse({ success: false, message: '이메일과 비밀번호를 입력해 주세요.' });
      }

      const user = authenticateUser(usersSheet, email, password);
      if (!user) {
        return createJsonResponse({ success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
      }

      return createJsonResponse({ success: true, user });
    }

    // ----------------------------------------------------------------------
    // [게시글] 새 글 등록 (Create Post)
    // ----------------------------------------------------------------------
    if (action === 'createPost') {
      const newPostId = data.id || ('post-' + Date.now());
      const row = [
        newPostId,
        data.title || '제목 없음',
        data.category || '개발',
        Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        data.excerpt || '',
        data.content || '',
        data.authorName || '작성자',
        data.authorAvatar || 'assets/images/profile.svg',
        Number(data.views || 0),
        Number(data.likes || 0),
        data.createdAt || new Date().toISOString()
      ];
      postsSheet.appendRow(row);
      return createJsonResponse({ success: true, id: newPostId });
    }

    // ----------------------------------------------------------------------
    // [댓글] 댓글 등록 (Add Comment)
    // ----------------------------------------------------------------------
    if (action === 'addComment') {
      const newCommentId = 'c-' + Date.now();
      const row = [
        newCommentId,
        data.postId,
        data.authorName || '익명 방문자',
        data.content || '',
        new Date().toISOString()
      ];
      commentsSheet.appendRow(row);
      return createJsonResponse({ success: true, commentId: newCommentId });
    }

    // ----------------------------------------------------------------------
    // [좋아요] 좋아요 1 증가
    // ----------------------------------------------------------------------
    if (action === 'likePost') {
      const likes = incrementCell(postsSheet, data.postId, 10);
      return createJsonResponse({ success: true, likes });
    }

    // ----------------------------------------------------------------------
    // [조회수] 조회수 1 증가
    // ----------------------------------------------------------------------
    if (action === 'viewPost') {
      const views = incrementCell(postsSheet, data.postId, 9);
      return createJsonResponse({ success: true, views });
    }

    return createJsonResponse({ success: false, message: '알 수 없는 액션입니다: ' + action });

  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// --------------------------------------------------------------------------
// 회원 및 보조 유틸리티 함수
// --------------------------------------------------------------------------
function checkUserEmailExists(usersSheet, email) {
  const data = usersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === email) {
      return true;
    }
  }
  return false;
}

function authenticateUser(usersSheet, email, password) {
  const data = usersSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowEmail = String(row[1]).toLowerCase();
    const rowPassword = String(row[2]);

    if (rowEmail === email && rowPassword === password) {
      return {
        id: String(row[0]),
        email: row[1],
        name: row[3],
        bio: row[4],
        techStack: typeof row[5] === 'string' ? row[5].split(',').map(s => s.trim()) : [],
        role: row[6] || 'member',
        createdAt: row[7] ? new Date(row[7]).toISOString() : new Date().toISOString()
      };
    }
  }
  return null;
}

function getAllPosts(postsSheet) {
  const data = postsSheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const posts = [];
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    if (!row[0]) continue;
    posts.push({
      id: String(row[0]),
      title: String(row[1] || ''),
      category: String(row[2] || '개발'),
      tags: typeof row[3] === 'string' ? row[3].split(',').map(s => s.trim()).filter(Boolean) : [],
      excerpt: String(row[4] || ''),
      content: String(row[5] || ''),
      authorName: String(row[6] || '홍길동'),
      authorAvatar: String(row[7] || 'assets/images/profile.svg'),
      views: Number(row[8] || 0),
      likes: Number(row[9] || 0),
      createdAt: row[10] ? new Date(row[10]).toISOString() : new Date().toISOString()
    });
  }
  return posts;
}

function findPostById(postsSheet, id) {
  const posts = getAllPosts(postsSheet);
  return posts.find(p => p.id === String(id)) || null;
}

function getCommentsForPost(commentsSheet, postId) {
  const data = commentsSheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const comments = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[1]) === String(postId)) {
      comments.push({
        id: String(row[0]),
        postId: String(row[1]),
        authorName: String(row[2] || '익명'),
        content: String(row[3] || ''),
        createdAt: row[4] ? new Date(row[4]).toISOString() : new Date().toISOString()
      });
    }
  }
  return comments;
}

function incrementCell(sheet, id, columnIndex) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      const current = Number(data[i][columnIndex - 1] || 0) + 1;
      sheet.getRange(i + 1, columnIndex).setValue(current);
      return current;
    }
  }
  return 0;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
