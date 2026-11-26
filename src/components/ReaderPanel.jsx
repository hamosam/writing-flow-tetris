import React from 'react';
import { ReaderAvatar } from './ReaderAvatar';

const PART_ORDER = ['처음', '가운데', '끝'];

export function ReaderPanel({
  stage,
  totalStages,
  score,
  hearts,
  combo,
  completedParts,
  currentPart,
  bubbleText,
  bubbleTone,
}) {
  const accentMap = {
    amber: 'from-amber-400/20 to-orange-300/15 border-amber-300/60 text-amber-800',
    sky: 'from-sky-400/20 to-cyan-300/15 border-sky-300/60 text-sky-800',
    indigo: 'from-indigo-400/20 to-violet-300/15 border-indigo-300/60 text-indigo-800',
    emerald: 'from-emerald-400/20 to-teal-300/15 border-emerald-300/60 text-emerald-800',
    rose: 'from-rose-400/20 to-pink-300/15 border-rose-300/60 text-rose-800',
  };

  const bubbleStyle =
    bubbleTone === 'praise'
      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
      : bubbleTone === 'warn'
        ? 'bg-rose-50/90 border-rose-200 text-rose-900'
        : 'bg-white/85 border-slate-200/80 text-slate-700';

  return (
    <aside className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col gap-4 h-full justify-between">
      <div className="flex flex-col gap-4">
        {/* 상단: 스테이지 & 점수/하트 */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r border ${accentMap[stage.accentColor] || accentMap.sky}`}
          >
            STAGE {stage.id} / {totalStages} · {stage.difficulty}
          </span>

          <div className="flex items-center gap-3">
            {/* 하트 3개 */}
            <div className="flex items-center gap-1" aria-label={`남은 하트 ${hearts}개`}>
              {[0, 1, 2].map((idx) => {
                const active = idx < hearts;
                return (
                  <svg
                    key={idx}
                    viewBox="0 0 24 24"
                    className={`w-5 h-5 transition-all duration-300 ${
                      active ? 'text-rose-500 scale-100 drop-shadow-sm' : 'text-slate-300 scale-90 opacity-50'
                    }`}
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                );
              })}
            </div>

            {/* 점수 */}
            <div className="px-3 py-1 rounded-full bg-slate-900/5 border border-slate-200/70 text-xs font-bold text-slate-700 tabular-nums">
              {score.toLocaleString()}점
            </div>
          </div>
        </div>

        {combo >= 2 && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400/25 to-orange-400/20 border border-amber-300/70 animate-popIn">
            <span className="text-xs font-extrabold text-amber-800">
              {combo >= 3 ? '🔥 집중 피버! 점수 1.5배' : '⚡ 연속 정답 콤보!'}
            </span>
            <span className="text-xs font-black text-orange-700 tabular-nums">{combo} COMBO</span>
          </div>
        )}

        {/* 독자 프로필 카드 */}
        <div className="flex items-center gap-3.5 bg-white/60 rounded-2xl p-3 border border-white/80">
          <ReaderAvatar type={stage.readerType} className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">예상 독자</p>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 truncate">{stage.title}</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 leading-snug">
              주제: <span className="font-bold text-slate-800">{stage.topic}</span>
            </p>
          </div>
        </div>

        {/* 독자 특징 태그 */}
        <div className="flex flex-wrap gap-1.5">
          {stage.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-xl bg-white/75 border border-slate-200/70 text-xs font-semibold text-slate-600 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 독자 실시간 반응 말풍선 */}
        <div className={`relative rounded-2xl p-3.5 border transition-colors duration-300 ${bubbleStyle}`}>
          <div className="text-[11px] font-bold opacity-60 mb-1">독자의 한마디</div>
          <p className="text-sm font-semibold leading-relaxed">{bubbleText}</p>
        </div>
      </div>

      {/* 하단: 글의 흐름 진행 단계 (처음 → 가운데 → 끝) */}
      <div className="bg-white/55 rounded-2xl p-3 border border-white/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500">글의 흐름 진행</span>
          <span className="text-[11px] font-semibold text-slate-400">
            {completedParts.length} / 3 완성
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PART_ORDER.map((part, idx) => {
            const isDone = completedParts.includes(part);
            const isCurrent = currentPart === part;
            return (
              <div
                key={part}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : isCurrent
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md ring-2 ring-sky-200'
                      : 'bg-white/70 text-slate-400 border-slate-200/70'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{part}</span>
                {isDone && <span>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
