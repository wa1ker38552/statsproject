/* ─────────────────────────────────────────────
   AP Stats Time Perception Study
   Chi-Square Test of Homogeneity
   ───────────────────────────────────────────── */

const TARGET = 30.000; // seconds

// ── State ──
let timerInterval = null;
let startTime = null;
let currentMusic = null; // 'slow' | 'fast'
let sessionData = []; // in-memory only, cleared on page refresh

// ── DOM refs ──
const screens = {
  welcome: document.getElementById('screen-welcome'),
  timer:   document.getElementById('screen-timer'),
  result:  document.getElementById('screen-result'),
};

const audioSlow = document.getElementById('audio-slow');
const audioFast = document.getElementById('audio-fast');

// ── Screen router ──
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── Random assignment (50/50) ──
function assignMusic() {
  return Math.random() < 0.5 ? 'slow' : 'fast';
}

// ── Timer ──
function startTimer() {
  startTime = performance.now();
  timerInterval = setInterval(() => {}, 1000); // keep interval alive
}
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  return (performance.now() - startTime) / 1000;
}

// ── Music ──
function playMusic(type) {
  stopMusic();
  currentMusic = type;
  const audio = type === 'slow' ? audioSlow : audioFast;
  audio.currentTime = 0;
  audio.play().catch(() => {
    console.warn('Audio play was blocked.');
  });
}
function stopMusic() {
  audioSlow.pause();
  audioFast.pause();
  audioSlow.currentTime = 0;
  audioFast.currentTime = 0;
}

// ── Verdict ──
function getVerdict(elapsed) {
  return elapsed < TARGET ? 'Underestimate' : 'Overestimate';
}

// ── Begin ──
document.getElementById('btn-begin').addEventListener('click', () => {
  const type = assignMusic();
  showScreen('timer');
  playMusic(type);
  startTimer();
});

// ── Stop ──
document.getElementById('btn-stop').addEventListener('click', () => {
  const elapsed = stopTimer();
  stopMusic();

  const verdict = getVerdict(elapsed);
  const diff    = elapsed - TARGET;

  sessionData.push({
    id:      sessionData.length + 1,
    music:   currentMusic,
    elapsed: parseFloat(elapsed.toFixed(3)),
    diff:    parseFloat(diff.toFixed(3)),
    verdict: verdict,
  });

  const diffStr = (diff >= 0 ? '+' : '') + diff.toFixed(3) + ' s';
  document.getElementById('result-time').textContent = elapsed.toFixed(3) + ' s';

  const verdictEl = document.getElementById('result-verdict');
  verdictEl.textContent = verdict + '  (' + diffStr + ')';
  verdictEl.className = 'result-verdict ' + (verdict === 'Underestimate' ? 'under' : 'over');

  const musicEl = document.getElementById('result-music');
  musicEl.textContent = 'Song type: ' + (currentMusic === 'slow' ? 'Slow' : 'Fast');

  showScreen('result');
});

// ── Next participant ──
document.getElementById('btn-another').addEventListener('click', () => {
  showScreen('welcome');
});
