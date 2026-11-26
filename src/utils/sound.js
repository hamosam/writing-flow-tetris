// Web Audio API 기반 사운드 합성 유틸리티 (외부 오디오 파일 없음)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  getContext() {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  playTone(freq, duration, type = 'sine', volume = 0.14, delay = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // 말투 변환음: 경쾌한 상승 팝 사운드
  playTransform() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 좌우 레인 이동음: 부드러운 틱 사운드
  playMove() {
    this.playTone(340, 0.055, 'sine', 0.08);
  }

  // 원고지 착지 성공음: 맑고 경쾌한 화음 (콤보에 따라 음정 상승)
  playSuccess(combo = 1) {
    const boost = Math.min(combo - 1, 5) * 45;
    this.playTone(523.25 + boost, 0.14, 'sine', 0.14, 0); // C5
    this.playTone(659.25 + boost, 0.16, 'sine', 0.14, 0.07); // E5
    this.playTone(783.99 + boost, 0.24, 'triangle', 0.14, 0.14); // G5
  }

  // 휴지통 함정 제거 성공음
  playTrashSuccess() {
    this.playTone(493.88, 0.1, 'triangle', 0.12, 0); // B4
    this.playTone(739.99, 0.18, 'sine', 0.14, 0.08); // F#5
  }

  // 오답 효과음: 부드러운 하강음
  playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 스테이지 클리어 팡파레
  playStageClear() {
    const notes = [
      { freq: 523.25, delay: 0, dur: 0.16 }, // C5
      { freq: 659.25, delay: 0.11, dur: 0.16 }, // E5
      { freq: 783.99, delay: 0.22, dur: 0.16 }, // G5
      { freq: 1046.5, delay: 0.34, dur: 0.45 }, // C6
    ];
    notes.forEach((n) => this.playTone(n.freq, n.dur, 'triangle', 0.16, n.delay));
  }
}

export const soundEngine = new SoundEngine();
