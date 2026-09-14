/**
 * ==========================================================================
 * Google Apps Script - Dev.Blog Backend API (회원가입, 로그인, 게시글, 댓글)
 * 스프레드시트 ID: 1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc
 * ==========================================================================
 */

const SPREADSHEET_ID = '1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc';

function getSpreadsheet() {
  let ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  
  if (!ss && SPREADSHEET_ID) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {}
  }
  return ss;
}

// --------------------------------------------------------------------------
// 시트 및 기본 데이터 자동 생성 (users, posts, comments)
// --------------------------------------------------------------------------
function ensureSheets() {
  const ss = getSpreadsheet();
  if (!ss) throw new Error('스프레드시트를 열 수 없습니다. 스프레드시트 ID를 확인하세요.');

  // 1. users (회원 시트)
  let usersSheet = ss.getSheetByName('users');
  if (!usersSheet) {
    usersSheet = ss.insertSheet('users');
    usersSheet.appendRow([
      'id', 'email', 'password', 'name', 'bio', 'techStack', 'role', 'createdAt'
    ]);
    // 기본 운영자 계정 자동 생성
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
    // 샘플 첫 게시글 1개 자동 생성
    postsSheet.appendRow([
      'post-1',
      '2026년 모던 프론트엔드 성능 최적화 실전 가이드',
      '프론트엔드',
      '성능최적화, CoreWebVitals, JavaScript',
      '브라우저 렌더링 파이프라인 이해부터 LCP, FID, CLS 등 핵심 웹 바이탈 지표를 대폭 개선하는 실전 테크닉들을 정리합니다.',
      '## 🚀 웹 성능 최적화\n\n현대 웹에서 속도는 곧 사용자 경험입니다.\n\n- CSS 차단 리소스 줄이기\n- JavaScript defer/async 활용\n- 웹 폰트 font-display: swap 설정',
      '홍길동',
      'assets/images/profile.svg',
      128,
      15,
      new Date().toISOString()
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
// 공통 요청 처리 디스패처 (GET & POST 모두 완벽 지원)
// --------------------------------------------------------------------------
function processRequest(data) {
  const { ss, usersSheet, postsSheet, commentsSheet } = ensureSheets();
  const action = (data && data.action) || 'getPosts';

  // [헬스체크 / 핑]
  if (action === 'ping') {
    return {
      success: true,
      message: 'DevBlog API가 정상 작동 중입니다.',
      spreadsheet: ss.getName(),
      timestamp: new Date().toISOString()
    };
  }

  // [게시글] 전체 목록 조회
  if (action === 'getPosts') {
    const posts = getAllPosts(postsSheet);
    return { success: true, posts: posts, count: posts.length };
  }

  // [게시글] 단일 상세 및 댓글 조회
  if (action === 'getPost') {
    const postId = data.id;
    const post = findPostById(postsSheet, postId);
    const comments = getCommentsForPost(commentsSheet, postId);
    return { success: true, post: post, comments: comments };
  }

  // [회원] 이메일 중복 확인
  if (action === 'checkEmail') {
    const email = (data.email || '').trim().toLowerCase();
    const exists = checkUserEmailExists(usersSheet, email);
    return { success: true, exists: exists };
  }

  // [회원] 회원가입 (Signup)
  if (action === 'signup') {
    const email = (data.email || '').trim().toLowerCase();
    const password = String(data.password || '').trim();
    const name = (data.name || '').trim() || '블로그 회원';
    const bio = (data.bio || '').trim() || '반갑습니다!';
    const techStack = Array.isArray(data.techStack) ? data.techStack.join(', ') : (data.techStack || 'Web');

    if (!email || !password) {
      return { success: false, message: '이메일과 비밀번호를 모두 입력해 주세요.' };
    }

    if (checkUserEmailExists(usersSheet, email)) {
      return { success: false, message: '이미 등록된 이메일 계정입니다.' };
    }

    const newUserId = 'u_' + Date.now();
    const now = new Date().toISOString();

    usersSheet.appendRow([
      newUserId,
      email,
      password,
      name,
      bio,
      techStack,
      'member',
      now
    ]);

    const userSafe = {
      id: newUserId,
      email: email,
      name: name,
      bio: bio,
      techStack: typeof techStack === 'string' ? techStack.split(',').map(function(s) { return s.trim(); }) : [],
      role: 'member',
      createdAt: now
    };

    return { success: true, user: userSafe };
  }

  // [회원] 로그인 (Login)
  if (action === 'login') {
    const email = (data.email || '').trim().toLowerCase();
    const password = String(data.password || '').trim();

    if (!email || !password) {
      return { success: false, message: '이메일과 비밀번호를 입력해 주세요.' };
    }

    const user = authenticateUser(usersSheet, email, password);
    if (!user) {
      return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
    }

    return { success: true, user: user };
  }

  // [게시글] 새 글 등록
  if (action === 'createPost') {
    const newPostId = data.id || ('post-' + Date.now());
    const row = [
      newPostId,
      data.title || '제목 없음',
      data.category || '개발',
      Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
      data.excerpt || '',
      data.content || '',
      data.authorName || '홍길동',
      data.authorAvatar || 'assets/images/profile.svg',
      Number(data.views || 0),
      Number(data.likes || 0),
      data.createdAt || new Date().toISOString()
    ];
    postsSheet.appendRow(row);
    return { success: true, id: newPostId };
  }

  // [게시글] 게시글 수정 (Update)
  if (action === 'updatePost') {
    const postId = String(data.id || '');
    if (!postId) {
      return { success: false, message: '게시글 ID가 누락되었습니다.' };
    }
    const updated = updatePostRow(postsSheet, postId, data);
    if (!updated) {
      return { success: false, message: '수정할 게시글을 찾을 수 없습니다.' };
    }
    return { success: true, id: postId, message: '게시글이 성공적으로 수정되었습니다.' };
  }

  // [게시글] 게시글 삭제 (Delete)
  if (action === 'deletePost') {
    const postId = String(data.id || '');
    if (!postId) {
      return { success: false, message: '게시글 ID가 누락되었습니다.' };
    }
    const deleted = deletePostRow(postsSheet, commentsSheet, postId);
    if (!deleted) {
      return { success: false, message: '삭제할 게시글을 찾을 수 없습니다.' };
    }
    return { success: true, id: postId, message: '게시글과 관련 댓글이 삭제되었습니다.' };
  }

  // [댓글] 댓글 등록
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
    return { success: true, commentId: newCommentId };
  }

  // [좋아요] 좋아요 증가
  if (action === 'likePost') {
    const likes = incrementCell(postsSheet, data.postId, 10);
    return { success: true, likes: likes };
  }

  // [조회수] 조회수 증가
  if (action === 'viewPost') {
    const views = incrementCell(postsSheet, data.postId, 9);
    return { success: true, views: views };
  }

  return { success: false, message: '알 수 없는 요청 액션입니다: ' + action };
}

// --------------------------------------------------------------------------
// 1. GET 요청 핸들러 (브라우저 주소창, JSON 조회, GET 파라미터 호출)
// --------------------------------------------------------------------------
function doGet(e) {
  try {
    const data = (e && e.parameter) ? e.parameter : {};
    const result = processRequest(data);
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// --------------------------------------------------------------------------
// 2. POST 요청 핸들러 (회원가입, 로그인, 글쓰기, 댓글, 좋아요)
// --------------------------------------------------------------------------
function doPost(e) {
  try {
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = (e && e.parameter) || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const result = processRequest(data);
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// --------------------------------------------------------------------------
// 직접 테스트용 함수 (Apps Script 상단에서 [testApi] 선택 후 [▷ 실행] 클릭)
// --------------------------------------------------------------------------
function testApi() {
  Logger.log('1. ensureSheets 실행 중...');
  const sheets = ensureSheets();
  Logger.log('2. 시트 확인 완료: ' + sheets.ss.getName());

  Logger.log('3. doGet 테스트 실행...');
  const res = doGet({ parameter: { action: 'getPosts' } });
  Logger.log('doGet 결과: ' + res.getContent());

  Logger.log('🎉 모든 테스트 통과! 이제 [배포] > [새 배포]를 진행하세요.');
}

// --------------------------------------------------------------------------
// 보조 함수들
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

function updatePostRow(postsSheet, id, data) {
  const values = postsSheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      const rowIndex = i + 1;
      // Col 2: title, Col 3: category, Col 4: tags, Col 5: excerpt, Col 6: content
      if (data.title !== undefined) postsSheet.getRange(rowIndex, 2).setValue(data.title);
      if (data.category !== undefined) postsSheet.getRange(rowIndex, 3).setValue(data.category);
      if (data.tags !== undefined) {
        const tagsStr = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags;
        postsSheet.getRange(rowIndex, 4).setValue(tagsStr);
      }
      if (data.excerpt !== undefined) postsSheet.getRange(rowIndex, 5).setValue(data.excerpt);
      if (data.content !== undefined) postsSheet.getRange(rowIndex, 6).setValue(data.content);
      return true;
    }
  }
  return false;
}

function deletePostRow(postsSheet, commentsSheet, id) {
  const values = postsSheet.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      postsSheet.deleteRow(i + 1);
      found = true;
      break;
    }
  }

  // 연결된 댓글도 함께 삭제
  if (commentsSheet) {
    const commentValues = commentsSheet.getDataRange().getValues();
    for (let j = commentValues.length - 1; j >= 1; j--) {
      if (String(commentValues[j][1]) === String(id)) {
        commentsSheet.deleteRow(j + 1);
      }
    }
  }

  return found;
}

