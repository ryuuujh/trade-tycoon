// 화면 렌더링 : HUD / 계약 이벤트 창 / 피드백 연출 / 결과·이벤트 팝업 / 타이틀·캐릭터 선택·회사명 / 엔딩
import { characters, spriteSVG } from './characters.js';
import { buyerSVG } from './buyers.js';
import * as audio from './audio.js';

const $ = (id) => document.getElementById(id);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const XP_PER_LEVEL = 3;
const KEYS = ['A', 'B', 'C', 'D', 'E'];

let prev = null;          // 직전 렌더 값 (플로팅 텍스트용)
let typingTimer = null;
let toastTimer = null;
let ceoMoodTimer = null;
let activeChoices = null; // 키보드 선택용
let popupHandler = null;  // Enter 로 팝업 닫기
let selectKeyHandler = null;

const formatCash = (n) => `₩${n.toLocaleString('ko-KR')}`;
const signed = (n, prefix = '') => `${n > 0 ? '+' : n < 0 ? '-' : ''}${prefix}${Math.abs(n).toLocaleString('ko-KR')}`;
const deltaClass = (n) => `delta ${n > 0 ? 'up' : n < 0 ? 'down' : 'flat'}`;
const wait = (ms) => (reducedMotion.matches ? Math.min(ms, 120) : ms);

/* ---------------------------------------------------------
   연출 유틸
   --------------------------------------------------------- */
function restartAnimation(el, className) {
  el.classList.remove(className);
  void el.offsetWidth; // 리플로우 강제 → 애니메이션 재생
  el.classList.add(className);
}

function spawnFloat(anchor, text, kind) {
  const fx = $('fx');
  if (!fx || !anchor) return;
  const gameRect = $('game').getBoundingClientRect();
  const rect = anchor.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = `float ${kind}`;
  el.textContent = text;
  el.style.left = `${rect.left - gameRect.left + rect.width / 2}px`;
  el.style.top = `${rect.top - gameRect.top - 4}px`;
  fx.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
  setTimeout(() => el.remove(), 2200);
}

function typeText(el, text, speed = 22) {
  clearInterval(typingTimer);
  el.textContent = '';
  if (reducedMotion.matches) { el.textContent = text; return; }
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);
  let i = 0;
  typingTimer = setInterval(() => {
    i += 1;
    el.textContent = text.slice(0, i);
    if (i < text.length) el.appendChild(cursor);
    else clearInterval(typingTimer);
  }, speed);
}

function openPopup(overlayId, btnId, onClose) {
  const overlay = $(overlayId);
  const btn = $(btnId);
  overlay.hidden = false;
  const close = () => {
    if (overlay.hidden) return;
    overlay.hidden = true;
    popupHandler = null;
    onClose();
  };
  popupHandler = close;
  btn.onclick = close;
  btn.focus();
}

function makeChoiceCard(index, icon, text) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'choice';
  btn.innerHTML = `
    <span class="choice-top"><span class="key">${KEYS[index] || index + 1}</span><span class="choice-icon" aria-hidden="true"></span></span>
    <span class="text"></span>
    <span class="arrow" aria-hidden="true">▶ 선택</span>`;
  btn.querySelector('.choice-icon').textContent = icon || '📄';
  btn.querySelector('.text').textContent = text;
  return btn;
}

/* ---------------------------------------------------------
   화면 전환 (타이틀 / 캐릭터 선택 / 회사명 / 게임)
   --------------------------------------------------------- */
const SCREENS = ['title', 'select', 'naming'];

export function showScreen(name) {
  SCREENS.forEach((id) => { $(id).hidden = id !== name; });
  $('game').classList.toggle('in-menu', name !== null);
  if (name !== 'select' && selectKeyHandler) {
    document.removeEventListener('keydown', selectKeyHandler);
    selectKeyHandler = null;
  }
}

/* ---------------------------------------------------------
   타이틀 화면
   --------------------------------------------------------- */
export function renderTitle({ save, character }, { onNew, onContinue }) {
  const cont = $('title-continue');
  const info = $('title-save');
  if (save) {
    cont.disabled = false;
    info.textContent = `💾 ${save.company} · ${character.name} 사장 · DAY ${save.round + 1} · ${formatCash(save.cash)}`;
  } else {
    cont.disabled = true;
    info.textContent = '저장된 기록이 없습니다. 새 게임으로 시작하세요.';
  }
  $('title-new').onclick = onNew;
  cont.onclick = () => { if (!cont.disabled) onContinue(); };
  $('title-help').onclick = () => { $('help').hidden = false; $('help-close').focus(); };
  $('help-close').onclick = () => { $('help').hidden = true; $('title-help').focus(); };
  showScreen('title');
  (save ? cont : $('title-new')).focus();
}

/* ---------------------------------------------------------
   캐릭터 선택 화면 (레트로 RPG 스타일)
   --------------------------------------------------------- */
export function renderSelect({ onBack, onConfirm }, initialId = characters[0].id) {
  const grid = $('char-grid');
  const detail = $('char-detail');
  grid.replaceChildren();
  let current = Math.max(0, characters.findIndex((c) => c.id === initialId));

  const cards = characters.map((c, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'char-card';
    card.setAttribute('role', 'radio');
    card.innerHTML = `
      <span class="char-cursor" aria-hidden="true">▶</span>
      <span class="char-stage">${spriteSVG(c, 'normal', 'sprite-lg')}</span>
      <span class="char-name">${c.name}</span>
      <span class="char-type">${c.type}</span>`;
    card.addEventListener('click', () => { pick(i); });
    card.addEventListener('dblclick', () => onConfirm(characters[current].id));
    grid.appendChild(card);
    return card;
  });

  function pick(i) {
    current = i;
    const c = characters[i];
    cards.forEach((card, j) => {
      card.classList.toggle('selected', j === i);
      card.setAttribute('aria-checked', j === i ? 'true' : 'false');
      card.tabIndex = j === i ? 0 : -1;
    });
    restartAnimation(cards[i], 'pop');
    detail.innerHTML = `
      <div class="detail-head">
        <span class="detail-sprite">${spriteSVG(c, 'happy')}</span>
        <div>
          <h3>${c.name} <small>${c.type}</small></h3>
          <p class="detail-quote">"${c.tagline}"</p>
          <p class="detail-look">${c.look}</p>
        </div>
      </div>
      <dl class="detail-stats">
        <div><dt>기본 자본</dt><dd>${formatCash(c.cash)}</dd></div>
        <div><dt>시작 / 최대 멘탈</dt><dd>${c.mentalStart} / ${c.mentalMax}</dd></div>
        <div><dt>성공 수익</dt><dd>${Math.round(c.rewardMult * 100)}%</dd></div>
        <div><dt>실패 손실</dt><dd>${Math.round(c.lossMult * 100)}%</dd></div>
        <div><dt>멘탈 피해</dt><dd>${Math.round(c.mentalDmgMult * 100)}%</dd></div>
      </dl>
      <p class="detail-ability">★ ${c.abilityText}</p>`;
  }

  pick(current);
  $('select-back').onclick = onBack;
  $('select-confirm').onclick = () => onConfirm(characters[current].id);

  if (selectKeyHandler) document.removeEventListener('keydown', selectKeyHandler);
  selectKeyHandler = (e) => {
    if ($('select').hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick((current + 1) % characters.length); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick((current - 1 + characters.length) % characters.length); }
    else if (e.key === 'Enter') { e.preventDefault(); onConfirm(characters[current].id); }
    else if (e.key === 'Escape') { onBack(); }
  };
  document.addEventListener('keydown', selectKeyHandler);
  showScreen('select');
  cards[current].focus();
}

/* ---------------------------------------------------------
   회사명 입력 화면
   --------------------------------------------------------- */
export function renderNaming(character, defaultName, { onBack, onStart }) {
  const input = $('company-input');
  const count = $('company-count');
  $('naming-sprite').innerHTML = spriteSVG(character, 'normal', 'sprite-lg');
  $('naming-quote').textContent = `${character.tagline} 회사 이름은 뭐로 할까요?`;
  input.value = defaultName;
  const update = () => { count.textContent = `${input.value.length} / 20`; };
  input.oninput = update;
  update();
  const start = () => {
    const name = input.value.trim().slice(0, 20) || defaultName;
    onStart(name);
  };
  input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); start(); } };
  $('naming-back').onclick = onBack;
  $('naming-start').onclick = start;
  showScreen('naming');
  input.focus();
  input.select();
}

/* ---------------------------------------------------------
   HUD
   --------------------------------------------------------- */
export function renderCompany(state, character) {
  $('company-name').textContent = state.company;
  $('ceo-name').textContent = `사장 ${character.name} · ${character.type}`;
  $('ceo-sprite').innerHTML = spriteSVG(character, 'normal', 'sprite-sm');
}

// HUD 사장님 표정을 잠시 바꿨다가 기본(또는 위기) 표정으로 복귀
export function setCeoMood(character, mood, ms = 3200, restMood = 'normal') {
  clearTimeout(ceoMoodTimer);
  const slot = $('ceo-sprite');
  slot.innerHTML = spriteSVG(character, mood, 'sprite-sm');
  restartAnimation(slot, 'react');
  if (ms > 0) ceoMoodTimer = setTimeout(() => { slot.innerHTML = spriteSVG(character, restMood, 'sprite-sm'); }, ms);
}

export function renderProgress(wins, target) {
  const track = $('progress-track');
  if (track.children.length !== target) {
    track.replaceChildren();
    for (let i = 0; i < target; i++) {
      const b = document.createElement('i');
      if (i === target - 1) b.className = 'goal';
      track.appendChild(b);
    }
  }
  [...track.children].forEach((b, i) => {
    const on = i < wins;
    if (on && !b.classList.contains('on')) { b.classList.add('on'); restartAnimation(b, 'lit'); }
    else if (!on) b.classList.remove('on');
  });
  $('progress-count').textContent = `${wins} / ${target}`;
}

export function renderHUD(state, character) {
  const cashEl = $('cash-value');
  const mentalEl = $('mental-value');
  const mentalBar = $('mental-bar');
  const xpEl = $('xp-value');
  const xpBar = $('xp-bar');
  const dayEl = $('day-value');
  const levelEl = $('level-value');
  const xp = state.round % XP_PER_LEVEL;
  const mentalMax = character ? character.mentalMax : 100;
  const mentalPct = Math.max(0, Math.min(100, Math.round((state.mental / mentalMax) * 100)));
  const leveledUp = prev && state.level > prev.level;

  cashEl.textContent = formatCash(state.cash);
  mentalEl.textContent = `${state.mental} / ${mentalMax}`;
  mentalBar.style.width = `${mentalPct}%`;
  mentalBar.classList.toggle('warn', mentalPct <= 50 && mentalPct > 25);
  mentalBar.classList.toggle('danger', mentalPct <= 25);
  mentalBar.parentElement.setAttribute('aria-valuemax', mentalMax);
  mentalBar.parentElement.setAttribute('aria-valuenow', state.mental);
  xpEl.textContent = `${xp} / ${XP_PER_LEVEL}`;
  xpBar.parentElement.setAttribute('aria-valuenow', xp);
  dayEl.textContent = state.round + 1;
  levelEl.textContent = state.level;

  // 경험치 바 : 레벨업이면 가득 찬 뒤 비워지는 연출
  if (leveledUp) {
    xpBar.style.width = '100%';
    restartAnimation(xpBar, 'full');
    setTimeout(() => { xpBar.classList.remove('full'); xpBar.style.width = `${(xp / XP_PER_LEVEL) * 100}%`; }, wait(900));
  } else {
    xpBar.style.width = `${(xp / XP_PER_LEVEL) * 100}%`;
    if (prev && state.round !== prev.round) restartAnimation(xpBar, 'gain');
  }

  if (prev) {
    const dCash = state.cash - prev.cash;
    const dMental = state.mental - prev.mental;
    if (dCash !== 0) {
      spawnFloat(cashEl, signed(dCash, '₩'), dCash > 0 ? 'up' : 'down');
      restartAnimation(cashEl, dCash > 0 ? 'pulse-up' : 'pulse-down');
    }
    if (dMental !== 0) {
      spawnFloat(mentalEl, `멘탈 ${signed(dMental)}`, dMental > 0 ? 'up' : 'down');
      restartAnimation(mentalBar.closest('.stat'), dMental > 0 ? 'heal' : 'hit');
    }
    if (leveledUp) {
      spawnFloat(levelEl, 'LEVEL UP!', 'gold');
      restartAnimation(levelEl, 'bump');
    }
    if (state.round !== prev.round) restartAnimation(dayEl, 'bump');
  }
  prev = { cash: state.cash, mental: state.mental, level: state.level, round: state.round };

  const save = $('save-indicator');
  if (save) {
    save.classList.add('saved');
    setTimeout(() => save.classList.remove('saved'), 900);
  }
}

export function resetHUDMemory() { prev = null; }

/* ---------------------------------------------------------
   계약 상황 이벤트 창
   --------------------------------------------------------- */
export function setSysLine(text, tone = '') {
  const line = $('sys-line');
  $('sys-text').textContent = text;
  line.className = `sys-line ${tone}`;
  restartAnimation(line, 'flash');
}

/* ---------------------------------------------------------
   바이어 초상화 카드
   --------------------------------------------------------- */
function renderBuyerCard(buyer, mission) {
  const card = $('buyer-card');
  const box = $('buyer-portrait-box');
  box.style.setProperty('--bg-a', buyer.bg[0]);
  box.style.setProperty('--bg-b', buyer.bg[1]);
  $('buyer-portrait').innerHTML = buyerSVG(buyer, 'normal');
  $('buyer-flag').textContent = `${buyer.flag} ${buyer.code}`;
  $('buyer-name').textContent = mission.person;
  $('buyer-company').textContent = `${mission.company} · ${buyer.country}`;
  $('buyer-tag').textContent = buyer.tag;
  $('buyer-quip').textContent = `"${buyer.quip}"`;
  card.classList.remove('mood-happy', 'mood-angry');
  restartAnimation(card, 'enter');
}

// 선택 결과에 따라 계약 창의 바이어 표정/한마디 갱신
export function setBuyerMood(buyer, mood, line) {
  $('buyer-portrait').innerHTML = buyerSVG(buyer, mood);
  const card = $('buyer-card');
  card.classList.toggle('mood-happy', mood === 'happy');
  card.classList.toggle('mood-angry', mood === 'angry');
  if (line) $('buyer-quip').textContent = `"${line}"`;
  restartAnimation($('buyer-portrait-box'), mood === 'happy' ? 'nod' : 'shake');
}

export function renderMission(mission, { contractNo, expectedReward, character, intro, mood, buyer }, onAnswer) {
  $('contract-heading').textContent = `📦 계약 #${contractNo}`;
  $('contract-meta').textContent = `${mission.flag} ${mission.country} · ${mission.company}`;
  $('strip-reward').textContent = formatCash(expectedReward);
  const risk = $('strip-risk');
  risk.textContent = '★'.repeat(mission.risk) + '☆'.repeat(3 - mission.risk);
  risk.className = `risk risk-${mission.risk}`;
  const terms = $('strip-terms');
  terms.replaceChildren();
  mission.terms.forEach((t) => {
    const chip = document.createElement('span');
    chip.className = 'term';
    chip.textContent = t;
    terms.appendChild(chip);
  });
  $('strip-cargo').textContent = mission.cargo;

  renderBuyerCard(buyer, mission);
  typeText($('buyer-message'), mission.message);

  $('ceo-say-sprite').innerHTML = spriteSVG(character, mood, 'sprite-sm');
  $('ceo-say-name').textContent = character.name;
  $('ceo-say-line').textContent = intro;
  $('ceo-say').classList.toggle('crisis', mood === 'sad');
  restartAnimation($('ceo-say'), 'pop');

  const choices = $('choices');
  choices.replaceChildren();
  let locked = false;
  const buttons = [];

  mission.options.forEach((option, index) => {
    const data = typeof option === 'string' ? { icon: '📄', text: option } : option;
    const btn = makeChoiceCard(index, data.icon, data.text);
    btn.style.animationDelay = `${index * 90}ms`;
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      activeChoices = null;
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === mission.answer) b.classList.add('correct');
        else if (i === index) b.classList.add('wrong');
      });
      btn.classList.add('picked');
      onAnswer(index);
    });
    buttons.push(btn);
    choices.appendChild(btn);
  });
  activeChoices = buttons;
  restartAnimation($('mission'), 'new-contract');
}

/* ---------------------------------------------------------
   선택 직후 피드백 : 보상/손실 배너 → (레벨업) → 완료 콜백
   --------------------------------------------------------- */
function burst(text, kind, delay) {
  setTimeout(() => {
    const layer = $('burst');
    const el = document.createElement('div');
    el.className = `burst-banner ${kind}`;
    el.textContent = text;
    layer.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 2600);
  }, wait(delay));
}

export function showFeedback({ correct, cashDelta, expGain, mentalDelta, levelUp, level }, done) {
  audio.play(correct ? 'success' : 'fail');
  const game = $('game');
  if (correct) {
    restartAnimation(game, 'flash');
    const ship = document.querySelector('.ship');
    if (ship) restartAnimation(ship, 'cheer');
  } else {
    restartAnimation(game, 'shake');
    restartAnimation(game, 'flash-bad');
  }
  setTimeout(() => game.classList.remove('flash', 'flash-bad', 'shake'), 700);

  burst(correct ? `계약 성공! ${signed(cashDelta, '₩')}` : `계약 실패! ${signed(cashDelta, '₩')}`, correct ? 'up' : 'down', 0);
  burst(`EXP ${signed(expGain)}`, correct ? 'exp' : 'exp dim', 260);
  if (mentalDelta !== 0) burst(`멘탈 ${signed(mentalDelta)}`, mentalDelta > 0 ? 'mental up' : 'mental down', 520);

  let total = mentalDelta !== 0 ? 1250 : 1000;
  if (levelUp) {
    setTimeout(() => showLevelUp(level), wait(total + 100));
    total += 1800;
  }
  setTimeout(done, wait(total));
}

export function showLevelUp(level) {
  audio.play('levelup');
  const box = $('levelup');
  $('levelup-value').textContent = `LV ${level}`;
  $('levelup-sub').textContent = level >= 4 ? '이제 항구에서 사장님을 알아봅니다!' : '회사가 성장했습니다!';
  const confetti = box.querySelector('.levelup-confetti');
  confetti.replaceChildren();
  const colors = ['#ffd25a', '#7cfc8b', '#67e8f9', '#ff6b6b', '#8e5bd3', '#ffffff'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('i');
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 400}ms`;
    p.style.animationDuration = `${900 + Math.random() * 700}ms`;
    confetti.appendChild(p);
  }
  box.hidden = false;
  restartAnimation(box, 'show');
  setTimeout(() => { box.hidden = true; }, wait(1600));
}

/* ---------------------------------------------------------
   계약 결과 팝업 : 보상/손실 + 사장님 반응
   --------------------------------------------------------- */
export function showResult({ correct, cashDelta, expGain, mentalDelta, line, explanation, character, reaction, mood, crisis, buyer, buyerName }, onNext) {
  const box = $('result').querySelector('.result-box');
  box.classList.toggle('ok', correct);
  box.classList.toggle('bad', !correct);
  $('result-stamp').textContent = correct ? '계약 성공' : '계약 실패';
  $('result-title').textContent = correct ? '계약 성공!' : '계약 실패!';
  $('result-cash').textContent = signed(cashDelta, '₩');
  $('result-cash').className = deltaClass(cashDelta);
  $('result-exp').textContent = `EXP ${signed(expGain)}`;
  $('result-exp').className = `delta ${correct ? 'exp' : 'flat'}`;
  $('result-mental').textContent = `멘탈 ${signed(mentalDelta)}`;
  $('result-mental').className = deltaClass(mentalDelta);
  $('result-line').textContent = line;
  $('result-explain').textContent = explanation;
  $('buyer-react-art').innerHTML = buyerSVG(buyer, correct ? 'happy' : 'angry');
  $('buyer-react-name').textContent = `${buyer.flag} ${buyerName}`;
  $('buyer-react').classList.toggle('angry', !correct);

  $('reaction-sprite').innerHTML = spriteSVG(character, mood, 'sprite-md');
  $('reaction-name').textContent = character.name;
  $('reaction-line').textContent = reaction;
  $('reaction').classList.toggle('crisis', !!crisis);

  audio.play('pop');
  openPopup('result', 'result-btn', onNext);
}

/* ---------------------------------------------------------
   선택형 돌발 이벤트 팝업
   --------------------------------------------------------- */
export function showEvent(event, onPick, onNext) {
  $('event-icon').textContent = event.icon || '📣';
  $('event-title').textContent = event.title;
  $('event-text').textContent = event.text;
  const pickStep = $('event-pick');
  const outcome = $('event-outcome');
  pickStep.hidden = false;
  outcome.hidden = true;
  const box = $('event').querySelector('.result-box');
  box.classList.remove('ok', 'bad');

  const list = $('event-choices');
  list.replaceChildren();
  let locked = false;
  const buttons = event.options.map((opt, index) => {
    const btn = makeChoiceCard(index, opt.icon, opt.label);
    btn.classList.add('event-choice');
    btn.style.animationDelay = `${index * 90}ms`;
    btn.addEventListener('click', () => {
      if (locked) return;
      locked = true;
      activeChoices = null;
      buttons.forEach((b) => { b.disabled = true; });
      btn.classList.add('picked');
      const applied = onPick(opt);
      const good = applied.cash + applied.mental * 100000 >= 0;
      box.classList.toggle('ok', good);
      box.classList.toggle('bad', !good);
      $('event-result').textContent = opt.result;
      $('event-cash').textContent = signed(applied.cash, '₩');
      $('event-cash').className = deltaClass(applied.cash);
      $('event-mental').textContent = `멘탈 ${signed(applied.mental)}`;
      $('event-mental').className = deltaClass(applied.mental);
      setTimeout(() => {
        pickStep.hidden = true;
        outcome.hidden = false;
        restartAnimation(outcome, 'reveal');
        popupHandler = null;
        const overlay = $('event');
        const close = () => { if (overlay.hidden) return; overlay.hidden = true; popupHandler = null; onNext(); };
        popupHandler = close;
        $('event-btn').onclick = close;
        $('event-btn').focus();
      }, wait(350));
    });
    list.appendChild(btn);
    return btn;
  });

  $('event').hidden = false;
  audio.play('event');
  popupHandler = null;       // 선택 전에는 Enter 로 닫히지 않음
  activeChoices = buttons;   // A/B/C 키로 이벤트 선택 가능
  buttons[0].focus();
}

/* ---------------------------------------------------------
   시스템 토스트
   --------------------------------------------------------- */
export function notify(message, duration = 2800) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ---------------------------------------------------------
   엔딩
   --------------------------------------------------------- */
export function showEnding({ kind, title, text, eyebrow, character, mood, summary }, onRestart) {
  const box = $('ending').querySelector('.ending-box');
  box.className = `panel ending-box ending-${kind}`;
  $('ending-eyebrow').textContent = eyebrow;
  $('ending-title').textContent = title;
  $('ending-text').textContent = text;
  $('ending-sprite').innerHTML = spriteSVG(character, mood, 'sprite-lg');
  const dl = $('ending-summary');
  dl.replaceChildren();
  summary.forEach(([k, v]) => {
    const row = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = k;
    const dd = document.createElement('dd'); dd.textContent = v;
    row.append(dt, dd);
    dl.appendChild(row);
  });
  audio.play(kind === 'king' ? 'ending_king' : 'ending_bad');
  openPopup('ending', 'ending-btn', onRestart);
}

/* ---------------------------------------------------------
   새 게임 버튼 + 키보드 입력
   --------------------------------------------------------- */
export function bindReset(onReset) {
  const btn = $('reset-btn');
  if (!btn) return;
  btn.addEventListener('click', onReset);
}

export function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (popupHandler && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      popupHandler();
      return;
    }
    if (!activeChoices || $('game').classList.contains('in-menu')) return;
    const key = e.key.toUpperCase();
    let index = KEYS.indexOf(key);
    if (index < 0 && /^[1-9]$/.test(key)) index = Number(key) - 1;
    if (index >= 0 && activeChoices[index]) activeChoices[index].click();
  });
}

export const confirmDialog = (message) => window.confirm(message);

/* ---------------------------------------------------------
   사운드 컨트롤 (우측 상단) + 버튼 클릭음
   --------------------------------------------------------- */
export function bindSound() {
  const toggleBtn = $('sound-toggle');
  const gearBtn = $('sound-settings');
  const panel = $('sound-panel');
  const musicVol = $('music-vol');
  const sfxVol = $('sfx-vol');

  const render = (st) => {
    const on = !st.muted;
    $('sound-icon').textContent = on ? '🔊' : '🔇';
    $('sound-label').textContent = on ? 'ON' : 'OFF';
    toggleBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', on ? '음악 끄기' : '음악 켜기');
    toggleBtn.title = on ? '음악 끄기' : '음악 켜기';
    toggleBtn.classList.toggle('on', on);
    toggleBtn.dataset.running = st.running ? 'true' : 'false';
    musicVol.value = Math.round(st.music * 100);
    sfxVol.value = Math.round(st.sfx * 100);
    $('music-vol-value').textContent = Math.round(st.music * 100);
    $('sfx-vol-value').textContent = Math.round(st.sfx * 100);
    $('sound-note').textContent = !on
      ? '음악은 버튼을 눌러야 재생됩니다. 설정은 자동 저장돼요.'
      : st.running ? '재생 중 · 설정은 자동 저장돼요.' : '화면을 한 번 클릭하면 음악이 이어서 재생됩니다.';
  };
  audio.onChange(render);
  render(audio.getState());

  toggleBtn.addEventListener('click', async () => {
    const wasMuted = audio.getState().muted;
    await audio.toggle();
    if (wasMuted) {
      audio.play('click');
      toggleBtn.classList.add('pulse');
      setTimeout(() => toggleBtn.classList.remove('pulse'), 600);
    }
  });
  gearBtn.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    gearBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    audio.play('click');
  });
  musicVol.addEventListener('input', () => audio.setVolume('music', musicVol.value / 100));
  sfxVol.addEventListener('input', () => audio.setVolume('sfx', sfxVol.value / 100));
  sfxVol.addEventListener('change', () => audio.play('click'));

  // 패널 바깥 클릭 시 닫기
  document.addEventListener('pointerdown', (e) => {
    if (!panel.hidden && !$('sound').contains(e.target)) { panel.hidden = true; gearBtn.setAttribute('aria-expanded', 'false'); }
  });

  // 모든 버튼 / 카드에 클릭음 (사운드 버튼 자체는 제외)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled || btn.hasAttribute('data-silent')) return;
    audio.play('click');
  }, true);

  // 이전에 켜 둔 상태면 첫 상호작용에서 재개
  audio.armAutoResume();
}
