import React, { useState } from 'react';
import { ReaderAvatar } from './ReaderAvatar';

export function formatTime(ms) {
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

const BANNED_NICKNAME_WORDS = [
  '시발', '씨발', '시팔', '씨팔', '병신', '븅신', '지랄', '존나', '졸라',
  '개새', '새끼', '미친', '미쳤', '닥쳐', '꺼져', '죽어', '뒤져', '엿먹',
  '느금', '니엄', '엄창', '애미', '애비', '창녀', '걸레', '호구', '찐따',
  '장애', '한남', '한녀', '일베', '메갈', '섹스', '야동', '보지', '자지',
  '바보', '멍청', '똥개', '똥꼬', '방구', '방귀', '변태', '또라이', '돌아이',
  '선생', '교장', '아무개', '테스트', '익명', '관리자',
  '이승만', '윤보선', '박정희', '최규하', '전두환', '노태우', '김영삼',
  '김대중', '노무현', '이명박', '박근혜', '문재인', '윤석열', '이재명',
];

function validateStudentIdentity(numStr, nameStr) {
  const num = Number(numStr);
  if (!Number.isInteger(num) || num < 1 || num > 45) {
    return { ok: false, error: '출석 번호(1~45번)를 정확히 입력해 주세요.' };
  }
  const cleanName = nameStr.replace(/\s+/g, '');
  if (!/^[가-힣]{2,5}$/.test(cleanName)) {
    return { ok: false, error: '이름은 자음/모음이나 특수문자 없이 한글 2~5자로 입력해 주세요.' };
  }
  if (/^(.)\1+$/.test(cleanName)) {
    return { ok: false, error: '같은 글자 반복은 사용할 수 없어요. 바른 이름을 입력해 주세요.' };
  }
  if (BANNED_NICKNAME_WORDS.some((word) => cleanName.includes(word))) {
    return { ok: false, error: '바르고 고운 실명을 입력해 주세요!' };
  }
  return { ok: true, formatted: `${num}번 ${cleanName}` };
}

export function FeedbackToast({ toast }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  if (isSuccess) {
    return (
      <div className="fixed top-14 sm:top-16 right-3 sm:right-6 z-50 pointer-events-none">
        <div className="rounded-2xl px-4 py-2.5 shadow-lg border border-emerald-400 bg-emerald-50/95 text-emerald-900 backdrop-blur-xl animate-popIn flex items-center gap-2">
          <span className="text-base">✨</span>
          <p className="text-xs sm:text-sm font-extrabold">{toast.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-50 pointer-events-none flex justify-center px-4">
      <div className="max-w-md w-full rounded-2xl p-3.5 sm:p-4 shadow-2xl border-2 border-rose-400 bg-rose-50/95 text-rose-900 backdrop-blur-xl animate-popIn text-center">
        <div className="text-xl mb-0.5">💡</div>
        <p className="text-xs sm:text-sm font-extrabold leading-relaxed break-keep">{toast.message}</p>
      </div>
    </div>
  );
}

export function StartModal({
  stages,
  unlockedStage,
  hasClearedAll,
  leaderboardCount,
  onStartStage,
  onStartTimeAttack,
  onOpenLeaderboard,
}) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-panel max-w-3xl w-full rounded-3xl p-5 sm:p-7 animate-popIn my-auto">
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-extrabold mb-2">
            초등 6학년 국어 · 독자를 고려해 글 쓰기 (총 {stages.length}단계)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            글의 흐름 테트리스
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            <strong>1단계부터 10단계까지 모두 완주</strong>해야 <strong>명예의 전당</strong>에 기록을 남길 수 있어요!
          </p>
        </div>

        {/* 타임어택 도전 (10단계 완주 후 해금) & 명예의 전당 (항상 열림) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          <button
            type="button"
            disabled={!hasClearedAll}
            onClick={onStartTimeAttack}
            className={`sm:col-span-2 flex items-center justify-between gap-3 p-3.5 rounded-2xl text-left transition-all ${
              hasClearedAll
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-md hover:brightness-105 active:scale-[0.99]'
                : 'bg-slate-200/80 border border-slate-300/80 text-slate-500 cursor-not-allowed'
            }`}
          >
            <div>
              <div className="text-xs font-extrabold opacity-90">
                {hasClearedAll ? '⏱️ 명예의 전당 도전 가능!' : '🔒 10단계 완주 후 해금'}
              </div>
              <div className="text-base sm:text-lg font-black">
                {hasClearedAll ? '1~10단계 타임어택 도전하기' : '명예의 전당 타임어택 도전'}
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 ${
                hasClearedAll ? 'bg-white/20 backdrop-blur' : 'bg-slate-300/80 text-slate-500'
              }`}
            >
              {hasClearedAll ? '도전하기 →' : '🔒 잠김'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border bg-white/85 hover:bg-white border-amber-300/80 text-slate-800 shadow-sm hover:shadow-md transition-all font-extrabold"
          >
            <div className="flex items-center gap-1.5 text-sm">
              <span>🏆</span>
              <span>명예의 전당</span>
              {leaderboardCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                  {leaderboardCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-amber-700 mt-0.5">친구들 기록 보기</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
          <span>단계별 연습 (이전 단계를 깨면 다음 단계가 열려요)</span>
          <span className="text-sky-600">{unlockedStage} / {stages.length} 해금됨</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[40vh] overflow-y-auto pr-1 mb-4">
          {stages.map((st) => {
            const isLocked = st.id > unlockedStage;
            return (
              <button
                key={st.id}
                type="button"
                disabled={isLocked}
                onClick={() => onStartStage(st.id - 1)}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  isLocked
                    ? 'bg-slate-100/70 border-slate-200/70 opacity-60 cursor-not-allowed'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-md group'
                }`}
              >
                <ReaderAvatar type={st.readerType} className={`w-11 h-11 shrink-0 ${isLocked ? 'grayscale' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-extrabold text-sky-600">STAGE {st.id}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                      {st.difficulty}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-800 truncate">{st.title}</div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {isLocked ? `${st.id - 1}단계를 먼저 깨면 열려요!` : st.topic}
                  </p>
                </div>
                {isLocked ? (
                  <span className="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold shrink-0">
                    🔒
                  </span>
                ) : (
                  <span className="px-2.5 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold group-hover:bg-sky-600 transition-colors shrink-0">
                    연습
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl bg-slate-900/5 p-3 text-xs text-slate-600 leading-relaxed space-y-1 text-center">
          <div>
            <strong className="text-slate-800">💻 PC 키보드:</strong>{' '}
            <span className="font-semibold">↑</span>(말투) ·{' '}
            <span className="font-semibold">← / →</span>(이동) ·{' '}
            <span className="font-semibold">↓ / Space</span>(빠르게/즉시 착지) ·{' '}
            <span className="font-semibold">P</span>(일시정지)
          </div>
          <div>
            <strong className="text-slate-800">📱 태블릿 터치:</strong>{' '}
            하단 조작 버튼 또는 <span className="font-semibold">문장 블록 터치</span>(말투) ·{' '}
            <span className="font-semibold">원고지/휴지통 터치</span>(이동)
          </div>
        </div>
        <div className="mt-2.5 text-center text-[11px] font-bold text-slate-400">
          출처: 하모쌤
        </div>
      </div>
    </div>
  );
}

export function PauseModal({ onResume, onRestart }) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-sm w-full rounded-3xl p-6 text-center animate-popIn">
        <div className="text-3xl mb-2">⏸️</div>
        <h2 className="text-xl font-black text-slate-800">잠시 멈춤</h2>
        <p className="text-sm text-slate-600 mt-1.5 mb-5">
          문장을 천천히 읽고 어떤 말투가 어울릴지 생각해 보세요!
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md transition-colors"
          >
            계속하기 (P)
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 font-bold text-sm transition-colors"
          >
            이 스테이지 처음부터 다시
          </button>
        </div>
      </div>
    </div>
  );
}

export function StageClearModal({
  stage,
  landedBlocks,
  score,
  isTimeAttack,
  elapsedMs,
  hasNextStage,
  onNextStage,
  onHome,
  onSaveRecord,
}) {
  const [studentNum, setStudentNum] = useState('');
  const [studentName, setStudentName] = useState('');
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const check = validateStudentIdentity(studentNum, studentName);
    if (!check.ok) {
      setFormError(check.error);
      return;
    }
    setFormError('');
    onSaveRecord(check.formatted);
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-xl w-full rounded-3xl p-6 sm:p-7 animate-popIn my-auto">
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold mb-2">
            STAGE {stage.id} 클리어! 🎉
          </span>
          <h2 className="text-2xl font-black text-slate-800">완성된 한 편의 글</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            주제: {stage.topic} · 누적 점수 <strong className="text-sky-600">{score.toLocaleString()}점</strong>
            {isTimeAttack && (
              <>
                {' '}
                · 누적 시간 <strong className="text-orange-600 tabular-nums">{formatTime(elapsedMs)}</strong>
              </>
            )}
          </p>
        </div>

        {/* 완성된 글 카드 */}
        <div className="rounded-2xl bg-white/90 border border-slate-200 p-4 sm:p-5 shadow-inner mb-4 space-y-3">
          {landedBlocks.map((block) => (
            <div key={block.part} className="flex items-start gap-2.5">
              <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[11px] font-bold mt-0.5">
                {block.part}
              </span>
              <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">
                {block.text}
              </p>
            </div>
          ))}
        </div>

        {/* 독자의 최종 감상평 */}
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 p-3.5 mb-4">
          <ReaderAvatar type={stage.readerType} className="w-12 h-12 shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-emerald-700 mb-0.5">{stage.title}의 감상평</div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-snug">
              "{stage.finalReview}"
            </p>
          </div>
        </div>

        {/* 타임어택 10단계 완주 시 기록 등록 (번호 + 한글 실명 검증) */}
        {!hasNextStage && isTimeAttack && !saved && (
          <form onSubmit={handleSubmit} className="rounded-2xl bg-amber-50/90 border border-amber-300 p-4 mb-4">
            <div className="text-xs font-extrabold text-amber-800 mb-2">
              🏆 1~10단계 완주! 최종 기록: {formatTime(elapsedMs)} ({score.toLocaleString()}점)
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="45"
                value={studentNum}
                onChange={(e) => {
                  setStudentNum(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="번호"
                className="w-20 px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm font-bold text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                maxLength={5}
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (formError) setFormError('');
                }}
                placeholder="한글 이름 (예: 김민준)"
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-colors shrink-0"
              >
                기록 등록
              </button>
            </div>
            {formError && (
              <p className="mt-2 text-xs font-bold text-rose-600">{formError}</p>
            )}
          </form>
        )}

        {saved && (
          <div className="rounded-2xl bg-emerald-100/80 border border-emerald-300 p-3 mb-4 text-center text-xs font-extrabold text-emerald-800">
            명예의 전당에 기록이 등록되었습니다! 🎉
          </div>
        )}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onHome}
            className="px-4 py-3 rounded-2xl bg-white/85 hover:bg-white border border-slate-200 text-slate-700 font-bold text-sm transition-colors"
          >
            스테이지 목록
          </button>
          {hasNextStage ? (
            <button
              type="button"
              onClick={onNextStage}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:brightness-105 text-white font-extrabold text-sm shadow-md transition-all"
            >
              다음 독자 만나기 →
            </button>
          ) : (
            <button
              type="button"
              onClick={onHome}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-105 text-white font-extrabold text-sm shadow-md transition-all"
            >
              모든 독자 정복 완료! 🏆
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LeaderboardModal({
  records,
  sheetApiUrl,
  isSyncing,
  onRefresh,
  onClose,
  onClear,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-lg w-full rounded-3xl p-6 animate-popIn my-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-600">1~10단계 타임어택</span>
              {sheetApiUrl ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                  🌐 학급 실시간 공유 중
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                  💻 이 기기만 저장
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-slate-800 mt-0.5">🏆 우리 반 명예의 전당</h2>
          </div>

          <div className="flex items-center gap-1.5">
            {sheetApiUrl && (
              <button
                type="button"
                disabled={isSyncing}
                onClick={onRefresh}
                className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-bold text-sky-700 disabled:opacity-50"
              >
                {isSyncing ? '불러오는 중...' : '↻ 새로고침'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200 text-xs font-bold text-slate-600"
            >
              닫기
            </button>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="rounded-2xl bg-white/70 border border-dashed border-slate-300 py-10 px-4 text-center text-sm text-slate-500">
            아직 등록된 기록이 없어요!
            <br />
            <strong>1~10단계 타임어택</strong>을 완주해 첫 번째 1등에 도전해 보세요.
          </div>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {records.map((rec, idx) => {
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}위`;
              return (
                <div
                  key={rec.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${
                    idx === 0
                      ? 'bg-amber-50/90 border-amber-300 shadow-sm'
                      : 'bg-white/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 text-center text-base font-black shrink-0">{medal}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-slate-800 truncate">{rec.name}</div>
                      <div className="text-[11px] text-slate-400">{rec.date}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="text-sm font-black text-orange-600 tabular-nums">
                      ⏱️ {formatTime(rec.timeMs)}
                    </div>
                    <div className="text-[11px] font-bold text-slate-500 tabular-nums">
                      {rec.score.toLocaleString()}점
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!sheetApiUrl && records.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex justify-end">
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
            >
              기록 전체 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function GameOverModal({ stage, onRetry, onHome }) {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-sm w-full rounded-3xl p-6 text-center animate-popIn">
        <div className="text-4xl mb-2">💔</div>
        <h2 className="text-xl font-black text-slate-800">하트를 모두 사용했어요!</h2>
        <p className="text-sm text-slate-600 mt-2 mb-5 leading-relaxed">
          <strong>{stage.title}</strong>의 입장에서 어떤 낱말과 말투가 알맞을지 다시 한 번 생각해 볼까요?
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-sm shadow-md transition-colors"
          >
            이 스테이지 다시 도전하기
          </button>
          <button
            type="button"
            onClick={onHome}
            className="w-full py-2.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 font-bold text-sm transition-colors"
          >
            다른 독자 고르기
          </button>
        </div>
      </div>
    </div>
  );
}
