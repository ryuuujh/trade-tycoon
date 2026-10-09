// 사운드 시스템 : Web Audio API 로 합성한 칩튠 배경음악 + 효과음
// - 외부 음원 파일 없이 오실레이터/노이즈로 실시간 합성 (저작권 문제 없음)
// - 기본은 음소거. 사용자가 버튼을 누르면(브라우저 자동재생 정책 준수) AudioContext 를 만들고 재생
// - 음악 시퀀서는 화면 전환과 무관하게 계속 돌아가므로 곡이 처음부터 다시 시작되지 않음
// - 음소거 / 음량 설정은 localStorage 에 저장

const STORE_KEY = 'trade-tycoon-audio';
const DEFAULTS = { muted: true, music: 0.5, sfx: 0.7 };
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

let settings = loadSettings();
let ctx = null;
let master = null;
let musicBus = null;
let sfxBus = null;
let listeners = [];

function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return { ...DEFAULTS };
    return {
      muted: raw.muted !== false,
      music: clamp01(typeof raw.music === 'number' ? raw.music : DEFAULTS.music),
      sfx: clamp01(typeof raw.sfx === 'number' ? raw.sfx : DEFAULTS.sfx)
    };
  } catch { return { ...DEFAULTS }; }
}
function saveSettings() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(settings)); } catch { /* 저장 불가 환경 무시 */ }
}
/* ---------------------------------------------------------
   컨텍스트 (사용자 제스처 안에서만 생성/재개)
   --------------------------------------------------------- */
function ensureContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.connect(ctx.destination);
  musicBus = ctx.createGain();
  musicBus.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.connect(master);
  applyVolumes();
  return ctx;
}

function applyVolumes() {
  if (!ctx) return;
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(settings.muted ? 0 : 1, t, 0.03);
  musicBus.gain.setTargetAtTime(settings.music * 0.9, t, 0.03);
  sfxBus.gain.setTargetAtTime(settings.sfx, t, 0.03);
}

function emit() { listeners.forEach((fn) => fn(getState())); }

/* ---------------------------------------------------------
   효과음 합성
   --------------------------------------------------------- */
function tone({ type = 'square', freq = 440, start = 0, dur = 0.1, gain = 0.2, slideTo = null, bus = sfxBus, attack = 0.005, release = 0.03 }) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.setValueAtTime(gain, t0 + Math.max(attack, dur - release));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 0.02);
  osc.connect(g).connect(bus);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

let noiseBuffer = null;
function noise({ start = 0, dur = 0.08, gain = 0.15, filter = 6000, type = 'highpass', bus = sfxBus }) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t0 = ctx.currentTime + start;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = filter;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(bus);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

const SFX = {
  // 버튼 / 카드 선택 : 짧은 클릭
  click() {
    tone({ type: 'square', freq: 880, dur: 0.045, gain: 0.12 });
    tone({ type: 'square', freq: 1320, start: 0.03, dur: 0.04, gain: 0.07 });
  },
  // 계약 성공 : 코인 소리 (B5 → E6)
  success() {
    tone({ type: 'square', freq: 987.8, dur: 0.09, gain: 0.16 });
    tone({ type: 'square', freq: 1318.5, start: 0.09, dur: 0.32, gain: 0.16, release: 0.2 });
    tone({ type: 'triangle', freq: 2637, start: 0.12, dur: 0.25, gain: 0.05, release: 0.2 });
  },
  // 계약 실패 : 코믹한 "와~ 와~ 와아~" 하강 + 둔탁한 마무리
  fail() {
    tone({ type: 'sawtooth', freq: 392, dur: 0.18, gain: 0.12, slideTo: 370 });
    tone({ type: 'sawtooth', freq: 370, start: 0.2, dur: 0.18, gain: 0.12, slideTo: 349 });
    tone({ type: 'sawtooth', freq: 349, start: 0.4, dur: 0.45, gain: 0.13, slideTo: 262, release: 0.3 });
    tone({ type: 'sine', freq: 90, start: 0.78, dur: 0.18, gain: 0.3, slideTo: 40 });
    noise({ start: 0.78, dur: 0.12, gain: 0.12, filter: 400, type: 'lowpass' });
  },
  // 레벨업 : 승리 팡파르 (C E G C 상행 + 화음)
  levelup() {
    const seq = [523.3, 659.3, 784, 1046.5];
    seq.forEach((f, i) => tone({ type: 'square', freq: f, start: i * 0.11, dur: 0.12, gain: 0.14 }));
    tone({ type: 'square', freq: 1046.5, start: 0.46, dur: 0.6, gain: 0.14, release: 0.35 });
    tone({ type: 'square', freq: 1318.5, start: 0.46, dur: 0.6, gain: 0.1, release: 0.35 });
    tone({ type: 'triangle', freq: 784, start: 0.46, dur: 0.6, gain: 0.12, release: 0.35 });
    noise({ start: 0.46, dur: 0.25, gain: 0.08, filter: 5000 });
  },
  // 돌발 이벤트 : 짧은 경고 스팅
  event() {
    tone({ type: 'square', freq: 660, dur: 0.08, gain: 0.12 });
    tone({ type: 'square', freq: 660, start: 0.12, dur: 0.08, gain: 0.12 });
    tone({ type: 'square', freq: 880, start: 0.24, dur: 0.2, gain: 0.12, release: 0.12 });
  },
  // 팝업 열림
  pop() {
    tone({ type: 'triangle', freq: 523, dur: 0.06, gain: 0.12, slideTo: 784 });
  },
  // 무역왕 엔딩
  ending_king() {
    const seq = [523.3, 659.3, 784, 1046.5, 784, 1046.5, 1318.5];
    seq.forEach((f, i) => tone({ type: 'square', freq: f, start: i * 0.13, dur: 0.14, gain: 0.14 }));
    tone({ type: 'square', freq: 1568, start: 0.95, dur: 0.9, gain: 0.14, release: 0.5 });
    tone({ type: 'triangle', freq: 523.3, start: 0.95, dur: 0.9, gain: 0.14, release: 0.5 });
  },
  // 파산 / 퇴사 엔딩
  ending_bad() {
    [392, 349, 311, 262].forEach((f, i) => tone({ type: 'sawtooth', freq: f, start: i * 0.28, dur: 0.28, gain: 0.12, slideTo: f * 0.97 }));
    tone({ type: 'sine', freq: 70, start: 1.1, dur: 0.6, gain: 0.3, slideTo: 35, release: 0.4 });
  }
};

/* ---------------------------------------------------------
   배경음악 시퀀서 : 밝은 칩튠 (C장조, 132 BPM, 8마디 루프)
   --------------------------------------------------------- */
const BPM = 132;
const STEP = 60 / BPM / 4; // 16분음표 길이(초)
const BAR = 16;            // 16분음표 16개 = 1마디

// 코드 진행 (마디별 루트 midi, 코드 구성음 offset)
const CHORDS = [
  [48, [0, 4, 7]],  // C
  [43, [0, 4, 7]],  // G
  [45, [0, 3, 7]],  // Am
  [41, [0, 4, 7]],  // F
  [48, [0, 4, 7]],  // C
  [43, [0, 4, 7]],  // G
  [41, [0, 4, 7]],  // F
  [43, [0, 4, 7]]   // G
];

// 멜로디 : [midi(또는 null=쉼표), 16분음표 길이] — 마디당 16스텝
const E = (n) => [n, 2]; // 8분음표
const Q = (n) => [n, 4]; // 4분음표
const MELODY = [
  // 1 C
  E(76), E(79), E(81), E(79), E(76), E(74), E(72), E(74),
  // 2 G
  E(74), E(79), E(83), E(79), E(74), E(71), E(67), E(71),
  // 3 Am
  E(81), E(76), E(72), E(76), E(81), E(79), E(76), E(79),
  // 4 F
  E(77), E(81), E(84), E(81), E(77), E(76), E(74), E(76),
  // 5 C
  E(76), E(79), E(84), E(79), E(76), E(79), Q(84),
  // 6 G
  E(83), E(79), E(74), E(79), E(83), E(81), E(79), E(81),
  // 7 F
  E(77), E(81), E(84), E(81), E(79), E(77), E(76), E(74),
  // 8 G
  Q(74), Q(79), [83, 6], [null, 2]
];

// 멜로디를 스텝 인덱스 → 노트로 전개
const MELODY_MAP = new Map();
let acc = 0;
MELODY.forEach(([note, len]) => { if (note !== null) MELODY_MAP.set(acc, { note, len }); acc += len; });
const LOOP_STEPS = acc; // 128

let seq = { running: false, step: 0, nextTime: 0, timer: null };

function scheduleStep(step, time) {
  const bar = Math.floor(step / BAR) % CHORDS.length;
  const inBar = step % BAR;
  const [root, offsets] = CHORDS[bar];
  const loopStep = step % LOOP_STEPS;

  // 리드 (사각파)
  const m = MELODY_MAP.get(loopStep);
  if (m) {
    const dur = m.len * STEP * 0.9;
    playNote('square', m.note, time, dur, 0.11);
  }
  // 베이스 (삼각파) : 8분음표, 루트 ↔ 5도/옥타브 바운스
  if (inBar % 2 === 0) {
    const pattern = [0, 0, 7, 0, 0, 0, 12, 7];
    const b = root - 12 + pattern[(inBar / 2) % 8];
    playNote('triangle', b, time, STEP * 1.8, 0.2);
  }
  // 아르페지오 (얇은 펄스) : 16분음표
  {
    const idx = [0, 1, 2, 1][inBar % 4];
    const n = root + 12 + offsets[idx];
    playNote('square', n, time, STEP * 0.8, 0.035, 5);
  }
  // 드럼
  if (inBar === 0 || inBar === 8 || inBar === 14) drumKick(time);
  if (inBar === 4 || inBar === 12) drumSnare(time);
  if (inBar % 2 === 0) drumHat(time, inBar % 4 === 0 ? 0.035 : 0.02);
}

function playNote(type, midi, time, dur, gain, detune = 0) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = midiToHz(midi);
  if (detune) osc.detune.value = detune;
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(gain, time + 0.008);
  g.gain.setValueAtTime(gain, time + Math.max(0.01, dur - 0.04));
  g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
  osc.connect(g).connect(musicBus);
  osc.start(time);
  osc.stop(time + dur + 0.02);
}
function drumKick(time) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.12);
  g.gain.setValueAtTime(0.35, time);
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);
  osc.connect(g).connect(musicBus);
  osc.start(time);
  osc.stop(time + 0.16);
}
function drumSnare(time) {
  noise({ start: time - ctx.currentTime, dur: 0.09, gain: 0.09, filter: 1800, type: 'bandpass', bus: musicBus });
}
function drumHat(time, gain) {
  noise({ start: time - ctx.currentTime, dur: 0.03, gain, filter: 7000, type: 'highpass', bus: musicBus });
}

function tick() {
  if (!seq.running || !ctx) return;
  const lookahead = 0.12;
  while (seq.nextTime < ctx.currentTime + lookahead) {
    scheduleStep(seq.step, seq.nextTime);
    seq.nextTime += STEP;
    seq.step += 1;
  }
  seq.timer = setTimeout(tick, 30);
}

function startMusic() {
  if (!ctx || seq.running) return;
  seq.running = true;
  seq.nextTime = ctx.currentTime + 0.05;
  tick();
}
function stopMusic() {
  seq.running = false;
  clearTimeout(seq.timer);
}

/* ---------------------------------------------------------
   공개 API
   --------------------------------------------------------- */
export function getState() {
  return { ...settings, ready: !!ctx, running: !!(ctx && ctx.state === 'running' && !settings.muted) };
}

export function onChange(fn) { listeners.push(fn); }

// 사용자 제스처에서 호출 : 음소거 해제 + 컨텍스트 생성/재개 + 음악 시작
export async function unmute() {
  settings.muted = false;
  saveSettings();
  const c = ensureContext();
  if (!c) { emit(); return false; }
  try { if (c.state !== 'running') await c.resume(); } catch { /* 제스처 밖이면 실패할 수 있음 */ }
  applyVolumes();
  startMusic();
  emit();
  return c.state === 'running';
}

export function mute() {
  settings.muted = true;
  saveSettings();
  applyVolumes();
  // 음소거 중에는 시퀀서를 멈춰 CPU 를 아낀다 (재개 시 같은 위치에서 이어서 재생)
  stopMusic();
  emit();
}

export function toggle() { return settings.muted ? unmute() : (mute(), Promise.resolve(false)); }

export function setVolume(kind, value) {
  settings[kind] = clamp01(value);
  saveSettings();
  applyVolumes();
  emit();
}

export function play(name) {
  if (!ctx || settings.muted || !SFX[name]) return;
  if (ctx.state !== 'running') return;
  try { SFX[name](); } catch { /* 합성 실패는 무시 */ }
}

// 탭이 숨겨지면 일시정지, 돌아오면 같은 위치에서 재개 (곡이 처음부터 다시 시작되지 않음)
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) { stopMusic(); ctx.suspend().catch(() => {}); }
  else if (!settings.muted) { ctx.resume().then(() => startMusic()).catch(() => {}); }
});

// 이전에 켜 둔 상태라면 첫 상호작용(클릭/키/터치)에서 자동 재개 — 브라우저 자동재생 정책 준수
export function armAutoResume() {
  if (settings.muted) return;
  const once = () => {
    document.removeEventListener('pointerdown', once);
    document.removeEventListener('keydown', once);
    unmute();
  };
  document.addEventListener('pointerdown', once);
  document.addEventListener('keydown', once);
}
