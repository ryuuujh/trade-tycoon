// 게임 흐름 : 타이틀 → 캐릭터 선택 → 회사명 → 항구 게임
//            (계약 상황 → 대응 선택 → 피드백 연출 → 결과 팝업 → [돌발 이벤트] → 다음 계약) → 엔딩
import { missions, events, EVENT_EVERY_MIN, EVENT_EVERY_MAX } from './data.js';
import { getBuyer } from './buyers.js';
import { characters, getCharacter } from './characters.js';
import {
  renderHUD, renderCompany, renderProgress, renderMission, notify,
  showFeedback, showResult, showEvent, showEnding, setCeoMood, setBuyerMood, setSysLine,
  renderTitle, renderSelect, renderNaming, showScreen,
  bindReset, bindKeyboard, bindSound, resetHUDMemory, confirmDialog
} from './ui.js';

const SAVE_KEY = 'trade-tycoon-save';
const SAVE_VERSION = 3;
const DEFAULT_COMPANY = '제발통관해줘무역';
const WIN_TARGET = 10;        // 성공 계약 10건 → 무역왕 엔딩
const BASE_LOSS = 2000000;    // 오답 기본 손실
const BASE_MENTAL_DMG = 15;   // 오답 기본 멘탈 피해
const MENTAL_GAIN = 5;        // 정답 멘탈 회복
const CRISIS_RATIO = 0.3;     // 최대 멘탈의 30% 이하 → 위기 대사
const EXP_PER_CONTRACT = 1;   // 계약 1건 = 경험치 1 (3개마다 레벨업, 기존 로직)

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const rollEventGap = () => EVENT_EVERY_MIN + Math.floor(Math.random() * (EVENT_EVERY_MAX - EVENT_EVERY_MIN + 1));

/* ---------------------------------------------------------
   저장 / 불러오기 (구버전 저장 데이터 호환)
   --------------------------------------------------------- */
function loadSave() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); }
  catch { raw = null; }
  if (!raw || typeof raw !== 'object' || typeof raw.cash !== 'number') return null;
  const save = {
    version: SAVE_VERSION,
    characterId: typeof raw.characterId === 'string' && getCharacter(raw.characterId).id === raw.characterId ? raw.characterId : 'kim',
    company: typeof raw.company === 'string' && raw.company.trim() ? raw.company.slice(0, 20) : DEFAULT_COMPANY,
    cash: Math.max(0, Math.floor(raw.cash)),
    mental: Math.max(0, Math.floor(typeof raw.mental === 'number' ? raw.mental : 100)),
    level: Math.max(1, Math.floor(raw.level || 1)),
    round: Math.max(0, Math.floor(raw.round || 0)),
    wins: Math.max(0, Math.floor(raw.wins || 0)),
    sinceEvent: Math.max(0, Math.floor(raw.sinceEvent || 0)),
    eventIn: raw.eventIn >= EVENT_EVERY_MIN ? Math.floor(raw.eventIn) : rollEventGap(),
    status: raw.status === 'ended' ? 'ended' : 'playing',
    ending: raw.ending || null
  };
  if (save.status === 'ended') return null;
  return save;
}

function persist() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function clearSave() { localStorage.removeItem(SAVE_KEY); }

function newState(characterId, company) {
  const c = getCharacter(characterId);
  return {
    version: SAVE_VERSION,
    characterId: c.id,
    company,
    cash: c.cash,
    mental: c.mentalStart,
    level: 1,
    round: 0,
    wins: 0,
    sinceEvent: 0,
    eventIn: rollEventGap(),
    status: 'playing',
    ending: null
  };
}

let state = null;
let character = null;
let endingShown = false;

const isCrisis = () => state.mental <= Math.ceil(character.mentalMax * CRISIS_RATIO);

/* ---------------------------------------------------------
   메뉴 흐름
   --------------------------------------------------------- */
function goTitle() {
  const save = loadSave();
  renderTitle(
    { save, character: save ? getCharacter(save.characterId) : null },
    {
      onNew: () => {
        if (save && !confirmDialog('저장된 기록이 있습니다. 삭제하고 새 게임을 시작할까요?')) return;
        goSelect();
      },
      onContinue: () => startGame(save, true)
    }
  );
}

function goSelect(initialId) {
  renderSelect({ onBack: goTitle, onConfirm: (id) => goNaming(id) }, initialId);
}

function goNaming(characterId) {
  renderNaming(getCharacter(characterId), DEFAULT_COMPANY, {
    onBack: () => goSelect(characterId),
    onStart: (company) => {
      clearSave();
      startGame(newState(characterId, company), false);
    }
  });
}

function startGame(save, resumed) {
  state = save;
  character = getCharacter(state.characterId);
  endingShown = false;
  resetHUDMemory();
  renderCompany(state, character);
  renderProgress(state.wins, WIN_TARGET);
  persist();
  showScreen(null);
  notify(resumed
    ? `${state.company}의 ${character.name} 사장님, 복귀를 환영합니다. DAY ${state.round + 1}!`
    : `${state.company} 창업! ${character.name} 사장님, 첫 바이어가 항구에 도착했습니다.`);
  setSysLine(resumed ? `DAY ${state.round + 1} 저장 지점에서 이어서 진행합니다.` : '첫 계약이 도착했습니다. 조건을 읽고 대응을 선택하세요.');
  nextMission();
}

/* ---------------------------------------------------------
   엔딩 판정 (중복 실행 방지)
   --------------------------------------------------------- */
function checkEnding() {
  if (endingShown) return true;
  let ending = null;
  if (state.cash <= 0) {
    ending = { kind: 'bankrupt', eyebrow: 'GAME OVER · 파산', title: '파산 엔딩', mood: 'sad',
      text: '사장님은 무역을 접고 붕어빵 장사를 시작했습니다. 🐟' };
  } else if (state.mental <= 0) {
    ending = { kind: 'burnout', eyebrow: 'GAME OVER · 퇴사', title: '퇴사 엔딩', mood: 'sad',
      text: '사장님은 회사 메신저를 삭제하고 잠적했습니다. 📵' };
  } else if (state.wins >= WIN_TARGET) {
    ending = { kind: 'king', eyebrow: 'CONGRATULATIONS', title: '무역왕 엔딩', mood: 'happy',
      text: '세계 무역을 정복했습니다. 하지만 월요일은 여전히 옵니다. 👑' };
  }
  if (!ending) return false;

  endingShown = true;
  state.status = 'ended';
  state.ending = ending.kind;
  persist();
  showEnding({
    ...ending,
    character,
    summary: [
      ['회사', state.company],
      ['사장님', `${character.name} (${character.type})`],
      ['진행', `DAY ${state.round + 1} · LV ${state.level}`],
      ['최종 자본', `₩${state.cash.toLocaleString('ko-KR')}`],
      ['성공 계약', `${state.wins}건 / ${WIN_TARGET}건`]
    ]
  }, () => {
    clearSave();
    state = null;
    goTitle();
  });
  return true;
}

/* ---------------------------------------------------------
   계약 루프
   --------------------------------------------------------- */
function nextMission() {
  renderHUD(state, character);
  renderProgress(state.wins, WIN_TARGET);
  if (checkEnding()) return;

  const mission = missions[state.round % missions.length];
  const buyer = getBuyer(mission.buyerId);
  const crisis = isCrisis();
  const expectedReward = Math.floor(mission.reward * character.rewardMult);

  renderMission(mission, {
    contractNo: state.round + 1,
    expectedReward,
    character,
    buyer,
    intro: pick(crisis ? character.lines.crisis : character.lines.intro),
    mood: crisis ? 'sad' : 'normal'
  }, (selected) => {
    const correct = selected === mission.answer;
    const before = { cash: state.cash, mental: state.mental, level: state.level };

    // 캐릭터 패시브는 여기서 한 번만 적용 (정수 처리)
    if (correct) {
      state.cash += expectedReward;
      state.mental = Math.min(character.mentalMax, state.mental + MENTAL_GAIN);
      state.wins += 1;
    } else {
      const loss = Math.floor(BASE_LOSS * character.lossMult);
      const dmg = Math.round(BASE_MENTAL_DMG * character.mentalDmgMult);
      state.cash = Math.max(0, state.cash - loss);
      state.mental = Math.max(0, state.mental - dmg);
    }
    state.round += 1;
    state.level = Math.floor(state.round / 3) + 1;
    persist();

    const cashDelta = state.cash - before.cash;
    const mentalDelta = state.mental - before.mental;
    const levelUp = state.level > before.level;
    const nowCrisis = isCrisis();
    const mood = nowCrisis ? 'sad' : character.moods[correct ? 'success' : 'fail'];

    const buyerLine = pick(buyer.react[correct ? 'success' : 'fail']);

    renderHUD(state, character);          // 수치 갱신 + 플로팅 텍스트 + 경험치 바
    renderProgress(state.wins, WIN_TARGET);
    setCeoMood(character, mood, 3200, nowCrisis ? 'sad' : 'normal');
    setBuyerMood(buyer, correct ? 'happy' : 'angry', buyerLine);
    setSysLine(
      correct
        ? `계약 #${state.round} 성공 · ${mission.company} · +₩${cashDelta.toLocaleString('ko-KR')} · EXP +${EXP_PER_CONTRACT}`
        : `계약 #${state.round} 실패 · ${mission.company} · -₩${Math.abs(cashDelta).toLocaleString('ko-KR')} · 멘탈 ${mentalDelta}`,
      correct ? 'ok' : 'bad'
    );

    showFeedback({ correct, cashDelta, expGain: EXP_PER_CONTRACT, mentalDelta, levelUp, level: state.level }, () => {
      showResult({
        correct,
        cashDelta,
        expGain: EXP_PER_CONTRACT,
        mentalDelta,
        line: buyerLine,
        explanation: mission.explanation,
        buyer,
        buyerName: mission.person,
        character,
        reaction: pick(character.lines[nowCrisis ? 'crisis' : correct ? 'success' : 'fail']),
        mood,
        crisis: nowCrisis
      }, afterResult);
    });
  });
}

function afterResult() {
  // 엔딩 조건이면 이벤트 없이 바로 판정
  if (state.cash <= 0 || state.mental <= 0 || state.wins >= WIN_TARGET) { nextMission(); return; }

  state.sinceEvent += 1;
  if (state.sinceEvent < state.eventIn) { persist(); nextMission(); return; }

  // 2~3 계약마다 선택형 돌발 이벤트
  state.sinceEvent = 0;
  state.eventIn = rollEventGap();
  const event = pick(events);
  setSysLine(`돌발 이벤트 발생 · ${event.title}`, 'warn');
  showEvent(event, (option) => {
    const before = { cash: state.cash, mental: state.mental };
    state.cash = Math.max(0, state.cash + option.cash);
    state.mental = Math.max(0, Math.min(character.mentalMax, state.mental + option.mental));
    persist();
    renderHUD(state, character);
    const applied = { cash: state.cash - before.cash, mental: state.mental - before.mental };
    const crisis = isCrisis();
    setCeoMood(character, applied.mental < 0 || crisis ? 'sad' : applied.mental > 0 ? 'happy' : 'normal', 3000, crisis ? 'sad' : 'normal');
    setSysLine(`${event.title} → ${option.label} · ${option.result}`, applied.cash + applied.mental * 100000 >= 0 ? 'ok' : 'bad');
    return applied;
  }, nextMission);
}

/* ---------------------------------------------------------
   부팅
   --------------------------------------------------------- */
bindReset(() => {
  if (!confirmDialog('현재 진행 상황을 삭제하고 타이틀로 돌아갈까요?')) return;
  clearSave();
  state = null;
  goTitle();
});
bindKeyboard();
bindSound();

const gameEl = document.getElementById('game');
gameEl.addEventListener('animationend', (e) => { if (e.target === gameEl) gameEl.classList.remove('boot'); });
setTimeout(() => gameEl.classList.remove('boot'), 1200);

// 기본 HUD 값(타이틀 뒤에서 보이는 항구 위 HUD)을 첫 캐릭터 기준으로 채워 둠
renderCompany({ company: DEFAULT_COMPANY }, characters[0]);
renderHUD(newState('kim', DEFAULT_COMPANY), characters[0]);
renderProgress(0, WIN_TARGET);
resetHUDMemory();
goTitle();
