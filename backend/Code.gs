/**
 * ==========================================================================
 * Google Apps Script - Dev.Blog Backend API (회원가입, 로그인, 게시글, 댓글, 통계)
 * 
 * [스프레드시트 배포 가이드]
 * 1. 구글 스프레드시트를 생성하거나 기존 시트를 엽니다.
 * 2. 상단 메뉴 [확장 프로그램] ➔ [Apps Script] 클릭
 * 3. 기존 코드를 모두 지우고 이 파일의 전체 코드를 붙여넣습니다.
 * 4. 아래 SPREADSHEET_ID 변수에 본인의 스프레드시트 ID를 입력합니다.
 *    (시트 URL: https://docs.google.com/spreadsheets/d/[스프레드시트ID]/edit)
 * 5. 우측 상단 [배포] ➔ [새 배포] 클릭
 *    - 유형 선택(톱니바퀴): "웹 앱"
 *    - 설명: "DevBlog API v2"
 *    - 다음 사용자로 실행: "나(내 계정)"
 *    - 액세스 권한: "모든 사용자(Anyone)"  <-- ※ 필수! (로그인 없이 브라우저에서 접근 가능하도록)
 * 6. 발급된 웹 앱 URL (https://script.google.com/macros/s/.../exec)을 복사하여
 *    블로그 헤더의 [구글 시트 연동] 메뉴에 입력합니다.
 * ==========================================================================
 */

// 스프레드시트 ID (스프레드시트 URL의 /d/ 와 /edit 사이의 문자열)
const SPREADSHEET_ID = '1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc';

/**
 * 스프레드시트 객체 반환 (컨테이너 바인딩 및 독립형 스크립트 모두 지원)
 */
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

/**
 * 필요한 시트(users, posts, comments) 및 초기 데이터 자동 생성
 */
function ensureSheets() {
  const ss = getSpreadsheet();
  if (!ss) {
    throw new Error('스프레드시트를 열 수 없습니다. SPREADSHEET_ID를 올바르게 입력했는지 확인하세요.');
  }

  // 1. users (회원 시트)
  let usersSheet = ss.getSheetByName('users');
  if (!usersSheet) {
    usersSheet = ss.insertSheet('users');
    usersSheet.appendRow([
      'id', 'email', 'password', 'name', 'bio', 'techStack', 'role', 'createdAt'
    ]);
    // 기본 운영자 계정
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
      'content', 'authorName', 'authorAvatar', 'views', 'likes', 'createdAt', 'updatedAt'
    ]);
    // 기본 샘플 첫 게시글
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
      new Date().toISOString(),
      new Date().toISOString()
    ]);
  }

  // 3. comments (댓글 시트)
  let commentsSheet = ss.getSheetByName('comments');
  if (!commentsSheet) {
    commentsSheet = ss.insertSheet('comments');
    commentsSheet.appendRow([
      'id', 'postId', 'authorName', 'authorAvatar', 'content', 'createdAt'
    ]);
  }

  return { ss, usersSheet, postsSheet, commentsSheet };
}

/**
 * 공통 요청 처리 디스패처 (GET & POST 모두 완벽 지원)
 */
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

  // [게시글] 전체 목록 조회 (댓글 포함)
  if (action === 'getPosts') {
    const posts = getAllPosts(postsSheet, commentsSheet);
    return { success: true, posts: posts, count: posts.length };
  }

  // [게시글] 단일 상세 및 댓글 조회
  if (action === 'getPost') {
    const postId = data.id;
    const post = findPostById(postsSheet, commentsSheet, postId);
    if (!post) {
      return { success: false, message: '게시글을 찾을 수 없습니다.' };
    }
    return { success: true, post: post };
  }

  // [게시글] 새 글 등록 (Create)
  if (action === 'createPost') {
    const newPostId = data.id || ('post-' + Date.now());
    const now = new Date().toISOString();
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
      data.createdAt || now,
      now
    ];
    postsSheet.appendRow(row);
    return { success: true, id: newPostId };
  }

  // [게시글] 글 수정 (Update)
  if (action === 'updatePost') {
    const postId = data.id;
    if (!postId) {
      return { success: false, message: '게시글 ID가 누락되었습니다.' };
    }
    const updated = updatePostRow(postsSheet, postId, data);
    return { success: updated, id: postId, message: updated ? '수정되었습니다.' : '해당 글을 찾을 수 없습니다.' };
  }

  // [게시글] 글 삭제 (Delete)
  if (action === 'deletePost') {
    const postId = data.id;
    if (!postId) {
      return { success: false, message: '게시글 ID가 누락되었습니다.' };
    }
    const deleted = deletePostRow(postsSheet, commentsSheet, postId);
    return { success: deleted, id: postId, message: deleted ? '삭제되었습니다.' : '해당 글을 찾을 수 없습니다.' };
  }

  // [댓글] 댓글 등록
  if (action === 'addComment') {
    const newCommentId = data.id || ('c-' + Date.now());
    const row = [
      newCommentId,
      data.postId,
      data.authorName || '익명 방문자',
      data.authorAvatar || 'assets/images/profile.svg',
      data.content || '',
      data.createdAt || new Date().toISOString()
    ];
    commentsSheet.appendRow(row);
    return { success: true, commentId: newCommentId };
  }

  // [댓글] 댓글 삭제
  if (action === 'deleteComment') {
    const commentId = data.id || data.commentId;
    const deleted = deleteCommentRow(commentsSheet, commentId);
    return { success: deleted, commentId: commentId };
  }

  // [좋아요/공감] 공감 증가
  if (action === 'likePost') {
    const likes = incrementCell(postsSheet, data.postId, 10);
    return { success: true, likes: likes };
  }

  // [조회수] 조회수 증가
  if (action === 'viewPost') {
    const views = incrementCell(postsSheet, data.postId, 9);
    return { success: true, views: views };
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
      techStack: typeof techStack === 'string' ? techStack.split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [],
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

  // [회원] 프로필 정보 수정
  if (action === 'updateProfile') {
    const userId = data.userId || (data.user && data.user.id);
    if (!userId) {
      return { success: false, message: '회원 ID가 지정되지 않았습니다.' };
    }
    const updated = updateUserProfile(usersSheet, userId, data);
    return { success: updated, message: updated ? '프로필이 업데이트되었습니다.' : '회원을 찾을 수 없습니다.' };
  }

  return { success: false, message: '알 수 없는 요청 액션입니다: ' + action };
}

/**
 * GET 요청 핸들러 (조회, 핑, 브라우저 다이렉트 테스트)
 */
function doGet(e) {
  try {
    const data = (e && e.parameter) ? e.parameter : {};
    const result = processRequest(data);
    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * POST 요청 핸들러 (CORS 및 JSON/Form 전송 모두 지원)
 */
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

// ==========================================================================
// 보조 헬퍼 함수들 (데이터베이스 쿼리 및 변환)
// ==========================================================================

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
        techStack: typeof row[5] === 'string' ? row[5].split(',').map(s => s.trim()).filter(Boolean) : [],
        role: row[6] || 'member',
        createdAt: row[7] ? new Date(row[7]).toISOString() : new Date().toISOString()
      };
    }
  }
  return null;
}

function updateUserProfile(usersSheet, userId, data) {
  const values = usersSheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(userId)) {
      if (data.name) usersSheet.getRange(i + 1, 4).setValue(data.name);
      if (data.bio !== undefined) usersSheet.getRange(i + 1, 5).setValue(data.bio);
      if (data.techStack !== undefined) {
        const stackStr = Array.isArray(data.techStack) ? data.techStack.join(', ') : data.techStack;
        usersSheet.getRange(i + 1, 6).setValue(stackStr);
      }
      return true;
    }
  }
  return false;
}

function getAllPosts(postsSheet, commentsSheet) {
  const data = postsSheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const allComments = commentsSheet ? getAllComments(commentsSheet) : [];
  const commentsByPostId = {};
  allComments.forEach(c => {
    if (!commentsByPostId[c.postId]) commentsByPostId[c.postId] = [];
    commentsByPostId[c.postId].push(c);
  });

  const posts = [];
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    if (!row[0]) continue;

    const postId = String(row[0]);
    posts.push({
      id: postId,
      title: String(row[1] || ''),
      category: String(row[2] || '개발'),
      tags: typeof row[3] === 'string' ? row[3].split(',').map(s => s.trim()).filter(Boolean) : (Array.isArray(row[3]) ? row[3] : []),
      excerpt: String(row[4] || ''),
      content: String(row[5] || ''),
      authorName: String(row[6] || '홍길동'),
      authorAvatar: String(row[7] || 'assets/images/profile.svg'),
      views: Number(row[8] || 0),
      likes: Number(row[9] || 0),
      comments: commentsByPostId[postId] || [],
      createdAt: row[10] ? new Date(row[10]).toISOString() : new Date().toISOString(),
      updatedAt: row[11] ? new Date(row[11]).toISOString() : (row[10] ? new Date(row[10]).toISOString() : new Date().toISOString())
    });
  }
  return posts;
}

function findPostById(postsSheet, commentsSheet, id) {
  const posts = getAllPosts(postsSheet, commentsSheet);
  return posts.find(p => p.id === String(id)) || null;
}

function updatePostRow(postsSheet, postId, data) {
  const values = postsSheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(postId)) {
      const rowIdx = i + 1;
      if (data.title !== undefined) postsSheet.getRange(rowIdx, 2).setValue(data.title);
      if (data.category !== undefined) postsSheet.getRange(rowIdx, 3).setValue(data.category);
      if (data.tags !== undefined) {
        const tagStr = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags;
        postsSheet.getRange(rowIdx, 4).setValue(tagStr);
      }
      if (data.excerpt !== undefined) postsSheet.getRange(rowIdx, 5).setValue(data.excerpt);
      if (data.content !== undefined) postsSheet.getRange(rowIdx, 6).setValue(data.content);
      
      // updatedAt
      const now = new Date().toISOString();
      postsSheet.getRange(rowIdx, 12).setValue(now);
      return true;
    }
  }
  return false;
}

function deletePostRow(postsSheet, commentsSheet, postId) {
  const values = postsSheet.getDataRange().getValues();
  let deleted = false;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(postId)) {
      postsSheet.deleteRow(i + 1);
      deleted = true;
      break;
    }
  }

  // 연결된 댓글도 일괄 삭제
  if (commentsSheet) {
    const cValues = commentsSheet.getDataRange().getValues();
    for (let i = cValues.length - 1; i >= 1; i--) {
      if (String(cValues[i][1]) === String(postId)) {
        commentsSheet.deleteRow(i + 1);
      }
    }
  }

  return deleted;
}

function getAllComments(commentsSheet) {
  const data = commentsSheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const comments = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    comments.push({
      id: String(row[0]),
      postId: String(row[1]),
      authorName: String(row[2] || '익명'),
      authorAvatar: String(row[3] || 'assets/images/profile.svg'),
      content: String(row[4] || ''),
      createdAt: row[5] ? new Date(row[5]).toISOString() : new Date().toISOString()
    });
  }
  return comments;
}

function getCommentsForPost(commentsSheet, postId) {
  const all = getAllComments(commentsSheet);
  return all.filter(c => c.postId === String(postId));
}

function deleteCommentRow(commentsSheet, commentId) {
  const values = commentsSheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(commentId)) {
      commentsSheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
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

// ==========================================================================
// Apps Script IDE 콘솔 직접 테스트용 함수
// Apps Script 상단에서 [testApi] 함수를 선택하고 [▷ 실행]을 클릭하여 테스트
// ==========================================================================
function testApi() {
  Logger.log('1. ensureSheets 실행 및 시트 확인 중...');
  const sheets = ensureSheets();
  Logger.log('✔ 스프레드시트 이름: ' + sheets.ss.getName());

  Logger.log('2. ping 테스트 실행...');
  const pingRes = processRequest({ action: 'ping' });
  Logger.log('✔ ping 결과: ' + JSON.stringify(pingRes));

  Logger.log('3. getPosts 테스트 실행...');
  const postsRes = processRequest({ action: 'getPosts' });
  Logger.log('✔ 등록된 글 개수: ' + postsRes.count);

  Logger.log('🎉 모든 테스트 정상 통과! 이제 [배포] ➔ [새 배포] ➔ [웹 앱]으로 배포하세요.');
}