import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STAGES } from './data/stages';
import { soundEngine } from './utils/sound';
import { ReaderPanel } from './components/ReaderPanel';
import { GameBoard } from './components/GameBoard';
import { TouchControls } from './components/TouchControls';
import {
  FeedbackToast,
  StartModal,
  PauseModal,
  StageClearModal,
  GameOverModal,
  LeaderboardModal,
  formatTime,
} from './components/Modals';

const LEADERBOARD_KEY = 'writing-flow-tetris-leaderboard-v1';
const SHEET_URL_KEY = 'writing-flow-tetris-sheet-url-v1';
const UNLOCKED_STAGE_KEY = 'writing-flow-tetris-unlocked-v1';
const CLEARED_ALL_KEY = 'writing-flow-tetris-cleared10-v1';

// 모든 학생에게 자동 연결하려면 아래 따옴표 안에 Google Apps Script 웹 앱 URL을 넣어 주세요.
const DEFAULT_SHEET_API_URL =
  'https://script.google.com/macros/s/AKfycbwv3XAOb8qap2JjnW9bCNeVLDkkHl8VNw9HKu9awY6CD7FXwc99G9TBqIXEK7jp8C-x/exec';

function loadClearedAll() {
  try {
    return localStorage.getItem(CLEARED_ALL_KEY) === '1';
  } catch {
    return false;
  }
}

function loadUnlockedStage() {
  try {
    const val = Number(localStorage.getItem(UNLOCKED_STAGE_KEY));
    return val >= 1 && val <= STAGES.length ? val : 1;
  } catch {
    return 1;
  }
}

function loadInitialSheetUrl() {
  if (DEFAULT_SHEET_API_URL) return DEFAULT_SHEET_API_URL;
  try {
    return localStorage.getItem(SHEET_URL_KEY) || '';
  } catch {
    return '';
  }
}

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// 스테이지용 블록 큐 생성: 처음 -> 가운데 -> 끝 순서 유지 + 함정 블록 1~3개 무작위 삽입
function buildStageQueue(stage) {
  const normalBlocks = stage.steps.map((step, index) => ({
    ...step,
    stepIndex: index,
    isTrap: false,
  }));

  const trapBlocks = stage.traps.map((trap) => ({
    ...trap,
    isTrap: true,
  }));

  const shuffledTraps = [...trapBlocks].sort(() => Math.random() - 0.5);
  const queue = [normalBlocks[0]];

  if (shuffledTraps[0]) queue.push(shuffledTraps[0]);
  if (shuffledTraps[2]) queue.push(shuffledTraps[2]);
  queue.push(normalBlocks[1]);
  if (shuffledTraps[1]) queue.push(shuffledTraps[1]);
  queue.push(normalBlocks[2]);

  // Stage 4 이상에서는 블록 중 하나를 무작위로 '⚡ 2배속 보너스 블록'으로 지정
  if (stage.id >= 4 && queue.length > 1) {
    const candidateIdx = 1 + Math.floor(Math.random() * (queue.length - 1));
    queue[candidateIdx] = { ...queue[candidateIdx], isLightning: true };
  }

  return queue;
}

// 초기 말투 인덱스 선택 (일반 블록은 가급적 오답 말투에서 시작해 읽고 고르게 유도)
function pickInitialVersionIndex(block) {
  if (!block || block.versions.length === 0) return 0;
  if (block.isTrap) {
    return Math.floor(Math.random() * block.versions.length);
  }
  const wrongIndices = block.versions
    .map((v, idx) => (!v.isCorrect ? idx : -1))
    .filter((idx) => idx !== -1);
  if (wrongIndices.length > 0) {
    return wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
  }
  return 0;
}

export default function App() {
  const [stageIndex, setStageIndex] = useState(0);
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'paused' | 'clear' | 'gameover'
  const [muted, setMuted] = useState(false);

  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [unlockedStage, setUnlockedStage] = useState(loadUnlockedStage);
  const [hasClearedAll, setHasClearedAll] = useState(loadClearedAll);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);
  const [sheetApiUrl, setSheetApiUrl] = useState(loadInitialSheetUrl);
  const [isSyncingLeaderboard, setIsSyncingLeaderboard] = useState(false);

  const [queue, setQueue] = useState([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [landedBlocks, setLandedBlocks] = useState([]);

  const [lane, setLane] = useState('manuscript'); // 'manuscript' | 'trash'
  const [progress, setProgress] = useState(0);
  const [versionIndex, setVersionIndex] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const [bubbleText, setBubbleText] = useState(STAGES[0].initialBubble);
  const [bubbleTone, setBubbleTone] = useState('normal'); // 'normal' | 'praise' | 'warn'
  const [toast, setToast] = useState(null);

  const isSoftDroppingRef = useRef(false);
  const isResolvingRef = useRef(false);
  const toastTimerRef = useRef(null);
  const progressRef = useRef(0);

  const stage = STAGES[stageIndex];
  const activeBlock = gameState === 'playing' || gameState === 'paused' ? queue[queueIdx] || null : null;

  const showToast = useCallback((message, type = 'error') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, type === 'success' ? 1300 : 2000);
  }, []);

  const initStage = useCallback((targetStageIndex, resetScore = false, timeAttackMode = null) => {
    const targetStage = STAGES[targetStageIndex];
    const newQueue = buildStageQueue(targetStage);
    setStageIndex(targetStageIndex);
    setQueue(newQueue);
    setQueueIdx(0);
    setLandedBlocks([]);
    setHearts(3);
    setCombo(0);
    if (resetScore) setScore(0);
    if (timeAttackMode !== null) {
      setIsTimeAttack(timeAttackMode);
      if (timeAttackMode) setElapsedMs(0);
    }

    setLane('manuscript');
    progressRef.current = 0;
    setProgress(0);
    setVersionIndex(pickInitialVersionIndex(newQueue[0]));
    setFlipKey((k) => k + 1);
    setIsShaking(false);
    isResolvingRef.current = false;
    isSoftDroppingRef.current = false;

    setBubbleText(targetStage.initialBubble);
    setBubbleTone('normal');
    setToast(null);
    setGameState('playing');
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  // 말투 바꾸기 (↑)
  const handleTransform = useCallback(() => {
    if (gameState !== 'playing' || isResolvingRef.current || !activeBlock) return;
    soundEngine.playTransform();
    setVersionIndex((prev) => (prev + 1) % activeBlock.versions.length);
    setFlipKey((k) => k + 1);
  }, [gameState, activeBlock]);

  // 레인 이동 (← / →)
  const handleSelectLane = useCallback(
    (targetLane) => {
      if (gameState !== 'playing' || isResolvingRef.current) return;
      setLane((prev) => {
        if (prev !== targetLane) {
          soundEngine.playMove();
        }
        return targetLane;
      });
    },
    [gameState]
  );

  // 착지 판정 로직
  const resolveLanding = useCallback(() => {
    if (isResolvingRef.current || !activeBlock) return;
    isResolvingRef.current = true;
    isSoftDroppingRef.current = false;

    const currentVersion = activeBlock.versions[versionIndex];
    const nextCombo = combo + 1;
    const feverMult = nextCombo >= 3 ? 1.5 : 1;
    const lightningMult = activeBlock.isLightning ? 2 : 1;
    const speedBonus = progressRef.current < 0.85 ? Math.round((1 - progressRef.current) * 80) : 0;

    const calcPoints = (base) => Math.round((base * lightningMult + speedBonus + nextCombo * 30) * feverMult);

    const respawnCurrentBlock = (nextHearts) => {
      setCombo(0);
      setTimeout(() => {
        setIsShaking(false);
        if (nextHearts <= 0) {
          setGameState('gameover');
          isResolvingRef.current = false;
          return;
        }
        progressRef.current = 0;
        setProgress(0);
        setLane('manuscript');
        isResolvingRef.current = false;
      }, 480);
    };

    const advanceToNextBlock = () => {
      const nextIdx = queueIdx + 1;
      if (nextIdx >= queue.length) {
        soundEngine.playStageClear();
        const nextUnlocked = Math.min(STAGES.length, stage.id + 1);
        setUnlockedStage((prev) => {
          const updated = Math.max(prev, nextUnlocked);
          try {
            localStorage.setItem(UNLOCKED_STAGE_KEY, String(updated));
          } catch {}
          return updated;
        });
        if (stage.id === STAGES.length) {
          setHasClearedAll(true);
          try {
            localStorage.setItem(CLEARED_ALL_KEY, '1');
          } catch {}
        }
        setGameState('clear');
        isResolvingRef.current = false;
      } else {
        const nextBlock = queue[nextIdx];
        setQueueIdx(nextIdx);
        setLane('manuscript');
        progressRef.current = 0;
        setProgress(0);
        setVersionIndex(pickInitialVersionIndex(nextBlock));
        setFlipKey((k) => k + 1);
        isResolvingRef.current = false;
      }
    };

    // 1) 함정 블록 판정
    if (activeBlock.isTrap) {
      if (lane === 'trash') {
        soundEngine.playTrashSuccess();
        const earned = calcPoints(150);
        setScore((s) => s + earned);
        setCombo(nextCombo);
        let msg = `불필요한 내용을 잘 걸러냈어요! (+${earned}점)`;
        if (nextCombo >= 3 && nextCombo % 3 === 0 && hearts < 3) {
          setHearts((h) => Math.min(3, h + 1));
          msg = `🔥 ${nextCombo}콤보 보너스! 하트 1개 회복! (+${earned}점)`;
        }
        showToast(msg, 'success');
        setBubbleText('맞아! 지금 주제와는 관련 없는 이야기였어. 잘 걸러냈네!');
        setBubbleTone('praise');
        advanceToNextBlock();
      } else {
        soundEngine.playError();
        setIsShaking(true);
        const nextHearts = hearts - 1;
        setHearts(nextHearts);
        showToast('이 독자가 궁금해하는 내용이 아니에요!', 'error');
        setBubbleText('음... 이 내용은 내가 궁금해하던 주제가 아닌 것 같아.');
        setBubbleTone('warn');
        respawnCurrentBlock(nextHearts);
      }
      return;
    }

    // 2) 일반 문장 블록 판정
    if (lane === 'trash') {
      soundEngine.playError();
      setIsShaking(true);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      showToast('글의 흐름에 꼭 필요한 내용이에요!', 'error');
      setBubbleText('잠깐! 그 문장은 글의 흐름에 꼭 필요한 내용이야!');
      setBubbleTone('warn');
      respawnCurrentBlock(nextHearts);
      return;
    }

    // 원고지 보드에 착지한 경우
    if (currentVersion.isCorrect) {
      soundEngine.playSuccess(nextCombo);
      const earned = calcPoints(200);
      setScore((s) => s + earned);
      setCombo(nextCombo);
      if (nextCombo >= 3 && nextCombo % 3 === 0 && hearts < 3) {
        setHearts((h) => Math.min(3, h + 1));
        showToast(`🔥 ${nextCombo}콤보 보너스! 하트 1개 회복! (+${earned}점)`, 'success');
      } else if (nextCombo >= 2 || speedBonus >= 40 || activeBlock.isLightning) {
        showToast(
          `${nextCombo >= 2 ? `${nextCombo} COMBO! ` : ''}+${earned}점${speedBonus >= 40 ? ' (스피드 보너스!)' : ''}`,
          'success'
        );
      }
      setLandedBlocks((prev) => [
        ...prev,
        { part: activeBlock.part, text: currentVersion.text },
      ]);
      const praiseMsg =
        stage.praiseBubbles[activeBlock.stepIndex] || '정말 알맞은 말투로 잘 썼구나!';
      setBubbleText(praiseMsg);
      setBubbleTone('praise');
      advanceToNextBlock();
    } else {
      soundEngine.playError();
      setIsShaking(true);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      showToast(currentVersion.feedback, 'error');
      setBubbleText('어? 이 말투는 나에게 조금 어울리지 않는 것 같아!');
      setBubbleTone('warn');
      respawnCurrentBlock(nextHearts);
    }
  }, [activeBlock, versionIndex, lane, queueIdx, queue, hearts, combo, stage, showToast]);

  // 즉시 내리기 (Space)
  const handleHardDrop = useCallback(() => {
    if (gameState !== 'playing' || isResolvingRef.current || !activeBlock) return;
    progressRef.current = 1;
    setProgress(1);
    resolveLanding();
  }, [gameState, activeBlock, resolveLanding]);

  // 일시정지 토글 (P)
  const handleTogglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'playing') return 'paused';
      if (prev === 'paused') return 'playing';
      return prev;
    });
  }, []);

  const fetchSharedLeaderboard = useCallback(async (urlOverride) => {
    const targetUrl = urlOverride !== undefined ? urlOverride : sheetApiUrl;
    if (!targetUrl) return;
    setIsSyncingLeaderboard(true);
    try {
      const res = await fetch(`${targetUrl}?t=${Date.now()}`);
      const json = await res.json();
      if (json && json.ok && Array.isArray(json.records)) {
        setLeaderboard(json.records);
      }
    } catch {
      // 네트워크 오류 시 기존 로컬 기록 유지
    } finally {
      setIsSyncingLeaderboard(false);
    }
  }, [sheetApiUrl]);

  useEffect(() => {
    if (sheetApiUrl) {
      fetchSharedLeaderboard(sheetApiUrl);
    }
  }, [sheetApiUrl, fetchSharedLeaderboard]);

  const handleSaveSheetUrl = useCallback(
    (newUrl) => {
      setSheetApiUrl(newUrl);
      try {
        if (newUrl) localStorage.setItem(SHEET_URL_KEY, newUrl);
        else localStorage.removeItem(SHEET_URL_KEY);
      } catch {}
      if (newUrl) {
        fetchSharedLeaderboard(newUrl);
      } else {
        setLeaderboard(loadLeaderboard());
      }
    },
    [fetchSharedLeaderboard]
  );

  const handleSaveRecord = useCallback(
    async (name) => {
      const now = new Date();
      const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newRecord = {
        id: Date.now(),
        name,
        timeMs: elapsedMs,
        score,
        date: dateStr,
      };
      setLeaderboard((prev) => {
        const updated = [...prev, newRecord]
          .sort((a, b) => a.timeMs - b.timeMs || b.score - a.score)
          .slice(0, 50);
        try {
          localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      if (sheetApiUrl) {
        try {
          const res = await fetch(sheetApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(newRecord),
          });
          const json = await res.json();
          if (json && json.ok && Array.isArray(json.records)) {
            setLeaderboard(json.records);
          }
        } catch {}
      }
    },
    [elapsedMs, score, sheetApiUrl]
  );

  const handleClearLeaderboard = useCallback(async () => {
    setLeaderboard([]);
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch {}
    if (sheetApiUrl) {
      try {
        await fetch(sheetApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'clear' }),
        });
      } catch {}
    }
  }, [sheetApiUrl]);

  // 타임어택 실시간 스톱워치 (플레이 중일 때만 측정)
  useEffect(() => {
    if (!isTimeAttack || gameState !== 'playing') return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now();
      const dt = now - last;
      last = now;
      setElapsedMs((prev) => prev + dt);
    }, 100);
    return () => clearInterval(timer);
  }, [isTimeAttack, gameState]);

  // requestAnimationFrame 기반 부드러운 낙하 루프 (약 12.5~14.5초)
  useEffect(() => {
    if (gameState !== 'playing' || !activeBlock) return;

    let animId;
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      if (!isResolvingRef.current) {
        const lightningMult = activeBlock.isLightning ? 1.4 : 1;
        const speedMultiplier = (isSoftDroppingRef.current ? 5.5 : 1) * lightningMult;
        const deltaProgress = (dt * speedMultiplier) / stage.fallDurationMs;
        const nextProgress = Math.min(1, progressRef.current + deltaProgress);
        progressRef.current = nextProgress;
        setProgress(nextProgress);

        if (nextProgress >= 1) {
          resolveLanding();
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [gameState, activeBlock, stage.fallDurationMs, resolveLanding]);

  // PC 키보드 이벤트 리스너
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing' || gameState === 'paused') {
          e.preventDefault();
          handleTogglePause();
        }
        return;
      }

      if (gameState !== 'playing') return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleTransform();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSelectLane('manuscript');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSelectLane('trash');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        isSoftDroppingRef.current = true;
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleHardDrop();
      }
    };

    const onKeyUp = (e) => {
      if (e.key === 'ArrowDown') {
        isSoftDroppingRef.current = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gameState, handleTransform, handleSelectLane, handleHardDrop, handleTogglePause]);

  const completedParts = landedBlocks.map((b) => b.part);
  const expectedNextPart = ['처음', '가운데', '끝'][landedBlocks.length] || '끝';
  const displayPart = activeBlock ? (activeBlock.isTrap ? expectedNextPart : activeBlock.part) : null;
  const currentPart = expectedNextPart;

  return (
    <div
      style={{ backgroundImage: "url('./bg.jpg')" }}
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-slate-800 flex flex-col relative overflow-x-hidden"
    >
      {/* 배경 주변 네온 테트리스 에셋 장식 */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
        <img
          src="./assets/block-cyan.png"
          alt=""
          className="hidden md:block absolute top-16 left-3 w-12 lg:w-14 opacity-75 -rotate-6 animate-float-slow drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
        />
        <img
          src="./assets/block-pink.png"
          alt=""
          style={{ animationDelay: '1.2s' }}
          className="hidden lg:block absolute top-36 right-4 w-20 opacity-75 rotate-12 animate-float-slow drop-shadow-[0_0_12px_rgba(244,114,182,0.45)]"
        />
        <img
          src="./assets/block-orange.png"
          alt=""
          style={{ animationDelay: '2.1s' }}
          className="hidden xl:block absolute top-10 left-[18%] w-24 opacity-60 -rotate-3 animate-float-slow drop-shadow-[0_0_12px_rgba(251,146,60,0.4)]"
        />
        <img
          src="./assets/block-purple-plus.png"
          alt=""
          style={{ animationDelay: '0.8s' }}
          className="hidden lg:block absolute bottom-24 right-5 w-20 opacity-75 -rotate-12 animate-float-slow drop-shadow-[0_0_12px_rgba(192,132,252,0.45)]"
        />
        <img
          src="./assets/block-purple-t.png"
          alt=""
          style={{ animationDelay: '1.7s' }}
          className="hidden md:block absolute bottom-8 left-4 w-24 opacity-70 rotate-6 animate-float-slow drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
        />
        <img
          src="./assets/block-yellow.png"
          alt=""
          style={{ animationDelay: '2.8s' }}
          className="hidden md:block absolute bottom-6 right-[16%] w-24 opacity-65 -rotate-6 animate-float-slow drop-shadow-[0_0_12px_rgba(250,204,21,0.4)]"
        />
      </div>

      {/* 상단 네비게이션 바 */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setGameState('start')}
            className="bg-white/85 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-white transition-colors shadow-sm"
          >
            ☰ 스테이지
          </button>
          <h1 className="text-base sm:text-lg font-black tracking-tight text-white drop-shadow-md">
            글의 흐름 테트리스
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isTimeAttack && gameState !== 'start' && (
            <div className="bg-white/90 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-xs font-black text-orange-600 tabular-nums flex items-center gap-1 shadow-sm">
              <span>⏱️</span>
              <span>{formatTime(elapsedMs)}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            title="명예의 전당 보기"
            className="bg-white/85 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-white transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>🏆</span>
            <span className="hidden sm:inline">랭킹</span>
          </button>
          {/* 우측 상단 음소거 토글 버튼 */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? '소리 켜기' : '음소거'}
            className="bg-white/85 backdrop-blur-md border border-white/80 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-slate-700 hover:bg-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>{muted ? '🔇' : '🔊'}</span>
            <span className="hidden sm:inline">{muted ? '음소거 됨' : '소리 켜짐'}</span>
          </button>
        </div>
      </header>

      {/* 메인 좌우 분할 레이아웃 */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 sm:gap-4">
        {/* 좌측 / 상단 패널: 독자 프로필 */}
        <div className="lg:col-span-4 flex flex-col">
          <ReaderPanel
            stage={stage}
            totalStages={STAGES.length}
            score={score}
            hearts={hearts}
            combo={combo}
            completedParts={completedParts}
            currentPart={currentPart}
            bubbleText={bubbleText}
            bubbleTone={bubbleTone}
          />
        </div>

        {/* 중앙 보드 (원고지 + 휴지통) & 하단 조작 버튼 */}
        <div className="lg:col-span-8 flex flex-col gap-3 flex-1">
          <GameBoard
            activeBlock={activeBlock}
            displayPart={displayPart}
            isFever={combo >= 3}
            lane={lane}
            progress={progress}
            versionIndex={versionIndex}
            flipKey={flipKey}
            isShaking={isShaking}
            landedBlocks={landedBlocks}
            onSelectLane={handleSelectLane}
            onTransform={handleTransform}
          />

          <TouchControls
            lane={lane}
            isPaused={gameState === 'paused'}
            disabled={gameState !== 'playing'}
            onMoveLeft={() => handleSelectLane('manuscript')}
            onMoveRight={() => handleSelectLane('trash')}
            onTransform={handleTransform}
            onSoftDropStart={() => {
              isSoftDroppingRef.current = true;
            }}
            onSoftDropEnd={() => {
              isSoftDroppingRef.current = false;
            }}
            onHardDrop={handleHardDrop}
            onTogglePause={handleTogglePause}
          />
        </div>
      </main>

      {/* 2초 피드백 토스트 */}
      <FeedbackToast toast={toast} />

      {/* 모달들 */}
      {gameState === 'start' && (
        <StartModal
          stages={STAGES}
          unlockedStage={unlockedStage}
          hasClearedAll={hasClearedAll}
          leaderboardCount={leaderboard.length}
          onStartStage={(idx) => initStage(idx, true, false)}
          onStartTimeAttack={() => initStage(0, true, true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {gameState === 'paused' && (
        <PauseModal
          onResume={() => setGameState('playing')}
          onRestart={() => initStage(stageIndex, false)}
        />
      )}

      {gameState === 'clear' && (
        <StageClearModal
          stage={stage}
          landedBlocks={landedBlocks}
          score={score}
          isTimeAttack={isTimeAttack}
          elapsedMs={elapsedMs}
          hasNextStage={stageIndex < STAGES.length - 1}
          onNextStage={() => initStage(stageIndex + 1, false)}
          onHome={() => setGameState('start')}
          onSaveRecord={handleSaveRecord}
        />
      )}

      {gameState === 'gameover' && (
        <GameOverModal
          stage={stage}
          onRetry={() => initStage(stageIndex, false)}
          onHome={() => setGameState('start')}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          records={leaderboard}
          sheetApiUrl={sheetApiUrl}
          isSyncing={isSyncingLeaderboard}
          onRefresh={() => fetchSharedLeaderboard()}
          onSaveSheetUrl={handleSaveSheetUrl}
          onClose={() => setShowLeaderboard(false)}
          onClear={handleClearLeaderboard}
        />
      )}
    </div>
  );
}
