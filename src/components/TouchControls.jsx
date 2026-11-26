import React from 'react';

export function TouchControls({
  lane,
  isPaused,
  disabled,
  onMoveLeft,
  onMoveRight,
  onTransform,
  onSoftDropStart,
  onSoftDropEnd,
  onHardDrop,
  onTogglePause,
}) {
  return (
    <div className="glass-panel rounded-3xl p-2.5 sm:p-3.5 select-none">
      <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
        {/* 원고지 이동 (←) */}
        <button
          type="button"
          disabled={disabled}
          onClick={onMoveLeft}
          className={`flex flex-col items-center justify-center py-2.5 sm:py-3 px-2 rounded-2xl border font-bold transition-all active:scale-95 disabled:opacity-45 ${
            lane === 'manuscript'
              ? 'bg-sky-500 text-white border-sky-500 shadow-md'
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
          }`}
        >
          <span className="text-base sm:text-lg leading-none">←</span>
          <span className="text-[11px] sm:text-xs mt-1">원고지</span>
        </button>

        {/* 말투 바꾸기 (↑) */}
        <button
          type="button"
          disabled={disabled}
          onClick={onTransform}
          className="col-span-2 flex flex-col items-center justify-center py-2.5 sm:py-3 px-3 rounded-2xl bg-gradient-to-b from-indigo-500 to-sky-500 text-white border border-indigo-400 shadow-md font-extrabold transition-all active:scale-95 hover:brightness-105 disabled:opacity-45"
        >
          <span className="text-base sm:text-lg leading-none">↑ 말투 바꾸기</span>
          <span className="text-[10px] sm:text-[11px] font-medium opacity-90 mt-1">
            3가지 문장 순환
          </span>
        </button>

        {/* 휴지통 이동 (→) */}
        <button
          type="button"
          disabled={disabled}
          onClick={onMoveRight}
          className={`flex flex-col items-center justify-center py-2.5 sm:py-3 px-2 rounded-2xl border font-bold transition-all active:scale-95 disabled:opacity-45 ${
            lane === 'trash'
              ? 'bg-rose-500 text-white border-rose-500 shadow-md'
              : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
          }`}
        >
          <span className="text-base sm:text-lg leading-none">→</span>
          <span className="text-[11px] sm:text-xs mt-1">휴지통</span>
        </button>

        {/* 즉시 내리기 (Space) & 빠르게 (↓) */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={disabled}
            onClick={onHardDrop}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-500 text-white font-extrabold text-[11px] sm:text-xs shadow-sm transition-all active:scale-95 hover:bg-emerald-600 disabled:opacity-45"
          >
            <span>착지</span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onPointerDown={onSoftDropStart}
            onPointerUp={onSoftDropEnd}
            onPointerLeave={onSoftDropEnd}
            onPointerCancel={onSoftDropEnd}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-white/85 text-slate-700 border border-slate-200 font-bold text-[11px] sm:text-xs transition-all active:scale-95 hover:bg-white disabled:opacity-45"
          >
            <span>↓ 빠르게</span>
          </button>
        </div>
      </div>

      {/* 키보드 단축키 안내 + 일시정지 */}
      <div className="mt-2 flex items-center justify-between px-1 text-[11px] font-medium text-slate-500">
        <div className="hidden sm:flex items-center gap-3">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-slate-300 text-[10px] font-bold">↑</kbd> 말투
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-slate-300 text-[10px] font-bold">←</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-slate-300 text-[10px] font-bold">→</kbd> 이동
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-slate-300 text-[10px] font-bold">↓</kbd> 빠르게
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-slate-300 text-[10px] font-bold">Space</kbd> 즉시 내리기
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/80 border border-slate-300 text-[10px] font-bold">P</kbd> 일시정지
          </span>
        </div>
        <span className="sm:hidden text-[11px] text-slate-400">터치 버튼으로 조작하세요</span>

        <button
          type="button"
          onClick={onTogglePause}
          className="px-2.5 py-1 rounded-lg bg-white/75 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
        >
          {isPaused ? '▶ 계속하기' : '⏸ 일시정지 (P)'}
        </button>
      </div>
    </div>
  );
}
