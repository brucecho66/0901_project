/**
 * ==========================================================================
 * Google Apps Script - Dev.Blog x Google Sheets Backend API
 * 스프레드시트 ID: 1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc
 * ==========================================================================
 * 
 * [배포 방법]
 * 1. 구글 스프레드시트 (https://docs.google.com/spreadsheets/d/1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc/edit) 열기
 * 2. 상단 메뉴 [확장 프로그램] > [Apps Script] 클릭
 * 3. 이 코드 전체를 복사하여 붙여넣고 저장(Ctrl+S)
 * 4. 우측 상단 [배포] > [새 배포] 클릭
 *    - 유형 선택(톱니바퀴): [웹 앱 (Web App)]
 *    - 설명: DevBlog API v1
 *    - 다음 사용자 권한으로 실행: 나 (Me)
 *    - 액세스 권한이 있는 사용자: 모든 사용자 (Anyone)  <-- 중요!
 * 5. 발급된 '웹 앱 URL' (https://script.google.com/macros/s/.../exec)을 블로그에 등록
 */

const SPREADSHEET_ID = '1dzsv8e3o-LaAnL2smrrzB_YrVqloz51AUcQTNE5Xelc';

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

// 시트 초기화 및 헤더 자동 생성
function ensureSheets() {
  const ss = getSpreadsheet();
  
  // 1. posts 시트
  let postsSheet = ss.getSheetByName('posts');
  if (!postsSheet) {
    postsSheet = ss.insertSheet('posts');
    postsSheet.appendRow([
      'id', 'title', 'category', 'tags', 'excerpt', 
      'content', 'authorName', 'authorAvatar', 'views', 'likes', 'createdAt'
    ]);
  }

  // 2. comments 시트
  let commentsSheet = ss.getSheetByName('comments');
  if (!commentsSheet) {
    commentsSheet = ss.insertSheet('comments');
    commentsSheet.appendRow([
      'id', 'postId', 'authorName', 'content', 'createdAt'
    ]);
  }

  return { ss, postsSheet, commentsSheet };
}

// --------------------------------------------------------------------------
// 1. GET 요청 (게시글 목록 및 상세 조회)
// --------------------------------------------------------------------------
function doGet(e) {
  try {
    const { postsSheet, commentsSheet } = ensureSheets();
    const action = (e && e.parameter && e.parameter.action) || 'getPosts';

    // (1) 특정 게시글 상세 조회
    if (action === 'getPost') {
      const postId = e.parameter.id;
      const post = findPostById(postsSheet, postId);
      const comments = getCommentsForPost(commentsSheet, postId);
      return createJsonResponse({ success: true, post, comments });
    }

    // (2) 전체 게시글 목록 조회
    const posts = getAllPosts(postsSheet);
    return createJsonResponse({ success: true, posts });

  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// --------------------------------------------------------------------------
// 2. POST 요청 (글 등록, 댓글 작성, 좋아요, 조회수)
// --------------------------------------------------------------------------
function doPost(e) {
  try {
    const { postsSheet, commentsSheet } = ensureSheets();
    const contents = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(contents);
    const action = data.action;

    // (1) 새 게시글 등록
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
      return createJsonResponse({ success: true, id: newPostId });
    }

    // (2) 댓글 등록
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

    // (3) 좋아요 1 증가
    if (action === 'likePost') {
      const likes = incrementCell(postsSheet, data.postId, 10);
      return createJsonResponse({ success: true, likes });
    }

    // (4) 조회수 1 증가
    if (action === 'viewPost') {
      const views = incrementCell(postsSheet, data.postId, 9);
      return createJsonResponse({ success: true, views });
    }

    return createJsonResponse({ success: false, message: '유효하지 않은 요청입니다.' });

  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// --------------------------------------------------------------------------
// 보조 함수들
// --------------------------------------------------------------------------
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getAllPosts(postsSheet) {
  const data = postsSheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const posts = [];
  for (let i = data.length - 1; i >= 1; i--) {
    const row = data[i];
    if (!row[0]) continue; // 빈 행 건너뛰기
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
