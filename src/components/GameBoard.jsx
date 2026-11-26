import React from 'react';

export function GameBoard({
  activeBlock,
  displayPart,
  isFever,
  lane,
  progress,
  versionIndex,
  flipKey,
  isShaking,
  landedBlocks,
  onSelectLane,
  onTransform,
}) {
  const currentVersion = activeBlock ? activeBlock.versions[versionIndex] : null;
  const badgeLabel = activeBlock ? displayPart : '';

  // 함정 블록과 일반 블록의 색상을 완전히 통일해 문장을 직접 읽고 판단하게 함
  const badgeStyle = 'bg-sky-100 text-sky-800 border-sky-300';

  // 낙하 위치 계산: 0 -> 1 사이를 부드럽게 이동 (상단 헤더 아래 ~ 착지선 위)
  const topPercent = 8 + progress * 54;
  const remainingPct = Math.max(0, Math.round((1 - progress) * 100));

  return (
    <div
      className={`glass-panel rounded-3xl p-3 sm:p-4 flex flex-col flex-1 min-h-[440px] sm:min-h-[500px] relative overflow-hidden select-none transition-all duration-300 ${
        isFever ? 'ring-4 ring-amber-400/60 shadow-amber-200/50' : ''
      }`}
    >
      {/* 2개 레인 배경 (원고지 보드 + 휴지통 구역) */}
      <div className="relative flex-1 grid grid-cols-12 gap-2.5 sm:gap-3 rounded-2xl overflow-hidden">
        {/* 좌측 넓은 영역: 원고지 보드 (8/12 = 66.7%) */}
        <div
          onClick={() => onSelectLane('manuscript')}
          className={`col-span-8 rounded-2xl manuscript-grid border-2 transition-all duration-200 flex flex-col justify-between p-2.5 sm:p-3.5 cursor-pointer ${
            lane === 'manuscript'
              ? 'border-sky-400/80 bg-white/65 shadow-inner'
              : 'border-slate-200/70 bg-white/40 opacity-85'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-700">원고지 보드</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              알맞은 말투로 착지!
            </span>
          </div>

          {/* 하단 착지 영역: 완성된 문장 블록들 */}
          <div className="mt-auto pt-3 border-t-2 border-dashed border-sky-300/70">
            <div className="text-[11px] font-bold text-sky-600/80 mb-1.5 flex items-center justify-between">
              <span>완성 중인 글 ({landedBlocks.length} / 3)</span>
              {lane === 'manuscript' && activeBlock && (
                <span className="text-sky-600 animate-pulse">▼ 여기에 착지</span>
              )}
            </div>

            {landedBlocks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300/80 bg-white/45 py-3 px-3 text-center text-xs font-medium text-slate-400">
                독자에게 알맞은 문장 블록이 이곳에 차곡차곡 쌓입니다.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {landedBlocks.map((item) => (
                  <div
                    key={item.part}
                    className="rounded-xl bg-emerald-50/90 border border-emerald-200 px-3 py-2 shadow-sm animate-popIn"
                  >
                    <div className="flex items-start gap-2">
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold mt-0.5">
                        {item.part}
                      </span>
                      <p className="text-xs sm:text-[13px] font-semibold text-slate-700 leading-snug">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 우측 좁은 영역: 휴지통 구역 (4/12 = 33.3%) */}
        <div
          onClick={() => onSelectLane('trash')}
          className={`col-span-4 rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-between p-2.5 sm:p-3.5 cursor-pointer ${
            lane === 'trash'
              ? 'border-rose-400 bg-rose-50/75 shadow-inner'
              : 'border-slate-300/80 bg-slate-100/45 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-full flex items-center justify-center gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-slate-700">휴지통</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto px-1">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-200 ${
                lane === 'trash'
                  ? 'bg-rose-500 text-white scale-110 shadow-md'
                  : 'bg-white/80 text-slate-400 border border-slate-200'
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-600 leading-snug">
              관련 없는 내용
              <br />
              버리는 곳
            </p>
            {lane === 'trash' && activeBlock && (
              <span className="mt-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                여기에 버리기
              </span>
            )}
          </div>

          <div className="w-full border-t border-dashed border-slate-300/70 pt-2 text-center text-[10px] font-semibold text-slate-400">
            함정 블록 주의!
          </div>
        </div>

        {/* 낙하 중인 문장 블록 */}
        {activeBlock && currentVersion && (
          <div
            style={{ top: `${topPercent}%` }}
            className={`absolute z-20 transition-[left,width] duration-200 ease-out pointer-events-auto ${
              lane === 'manuscript'
                ? 'left-[2%] w-[62.5%]'
                : 'left-[48%] sm:left-[52%] w-[50%] sm:w-[46%]'
            }`}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onTransform();
              }}
              title="클릭하거나 ↑ 키를 눌러 말투를 바꾸세요"
              className={`rounded-2xl p-3 sm:p-4 shadow-lg border-2 cursor-pointer transition-colors ${
                isShaking
                  ? 'animate-shake bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                  : lane === 'trash'
                    ? 'bg-white/95 border-rose-400 ring-4 ring-rose-100/80'
                    : 'bg-white/95 border-sky-400 ring-4 ring-sky-100/80'
              }`}
            >
              {/* 블록 상단 뱃지 & 말투 인디케이터 */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold border ${badgeStyle}`}>
                    [{badgeLabel}]
                  </span>
                  {activeBlock.isLightning && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-violet-100 text-violet-700 border border-violet-300">
                      ⚡ 2배속 보너스
                    </span>
                  )}
                  {lane === 'trash' && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-700">
                      휴지통 이동 중
                    </span>
                  )}
                </div>

                {/* 3가지 말투 인디케이터 */}
                <div className="flex items-center gap-1" aria-label={`말투 버전 ${versionIndex + 1} / 3`}>
                  {[0, 1, 2].map((idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        idx === versionIndex ? 'w-4 bg-sky-500' : 'w-1.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 문장 본문 (말투 변경 시 플립 애니메이션) */}
              <div key={flipKey} className="animate-flipIn">
                <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed break-keep">
                  {currentVersion.text}
                </p>
              </div>

              {/* 하단 힌트 & 남은 시간 게이지 바 */}
              <div className="mt-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-slate-400 mb-1.5">
                  <span>↑ 또는 터치로 말투 바꾸기</span>
                  <span className="tabular-nums">{versionIndex + 1} / 3</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${remainingPct}%` }}
                    className={`h-full rounded-full transition-colors duration-200 ${
                      remainingPct < 25 ? 'bg-rose-500' : activeBlock.isLightning ? 'bg-violet-500' : 'bg-sky-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
