/**
 * [글의 흐름 테트리스] 구글 스프레드시트 실시간 랭킹 연동 스크립트
 *
 * 사용 방법:
 * 1. 구글 드라이브에서 새 스프레드시트를 만듭니다.
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script]를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 아래 코드를 붙여넣은 뒤 저장(Ctrl+S)합니다.
 * 4. 우측 상단 [배포] -> [새 배포] 클릭
 *    - 유형 선택: '웹 앱'
 *    - 다음 사용자 권한으로 실행: '나'
 *    - 액세스 권한이 있는 사용자: '모든 사용자'
 * 5. [배포]를 누르고 나온 '웹 앱 URL'을 복사해 게임에 붙여넣으면 완료!
 */

const SHEET_NAME = '명예의 전당';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['id', 'name', 'timeMs', 'score', 'date']);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'name', 'timeMs', 'score', 'date']);
  }
  return sheet;
}

function getSortedRecords(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  const records = values
    .filter((row) => row[1] !== '' && row[2] !== '')
    .map((row) => ({
      id: String(row[0]),
      name: String(row[1]),
      timeMs: Number(row[2]),
      score: Number(row[3]) || 0,
      date: String(row[4] || ''),
    }));

  records.sort((a, b) => a.timeMs - b.timeMs || b.score - a.score);
  return records.slice(0, 50);
}

const BANNED_WORDS = [
  '시발', '씨발', '시팔', '씨팔', '병신', '븅신', '지랄', '존나', '졸라',
  '개새', '새끼', '미친', '미쳤', '닥쳐', '꺼져', '죽어', '뒤져', '엿먹',
  '느금', '니엄', '엄창', '애미', '애비', '창녀', '걸레', '호구', '찐따',
  '장애', '한남', '한녀', '일베', '메갈', '섹스', '야동', '보지', '자지',
  '바보', '멍청', '똥개', '똥꼬', '방구', '방귀', '변태', '또라이', '돌아이',
  '선생', '교장', '아무개', '테스트', '익명', '관리자',
  '이승만', '윤보선', '박정희', '최규하', '전두환', '노태우', '김영삼',
  '김대중', '노무현', '이명박', '박근혜', '문재인', '윤석열', '이재명',
];

function isValidStudentName(name) {
  if (!/^[1-9]\d?번\s[가-힣]{2,5}$/.test(name)) return false;
  const onlyName = name.split(' ')[1] || '';
  if (/^(.)\1+$/.test(onlyName)) return false;
  return !BANNED_WORDS.some((w) => onlyName.indexOf(w) !== -1);
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  const sheet = getOrCreateSheet();

  if (action === 'clear') {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, records: [] })).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  const records = getSortedRecords(sheet);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, records })).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  const sheet = getOrCreateSheet();
  const raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
  const data = JSON.parse(raw);

  if (data.action === 'clear') {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true, records: [] })).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  const id = data.id || Date.now();
  const name = String(data.name || '').trim().slice(0, 20);
  if (!isValidStudentName(name)) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: '유효하지 않은 번호 또는 이름입니다.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
  const timeMs = Number(data.timeMs) || 0;
  const score = Number(data.score) || 0;
  const date = String(data.date || '');

  sheet.appendRow([id, name, timeMs, score, date]);

  const records = getSortedRecords(sheet);
  return ContentService.createTextOutput(JSON.stringify({ ok: true, records })).setMimeType(
    ContentService.MimeType.JSON
  );
}
