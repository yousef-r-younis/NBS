
// ════════════════════════════════════════
// CONFIG & STATE
// ════════════════════════════════════════
const ADMIN_PASSWORD = '8xg76Wrva';
const STORAGE = {
  groups:    'lns_groups',
  codes:     'lns_codes',
  sheetUrl:  'lns_sheet_url',
  judgeProgress: 'lns_judge_progress'
};

let state = {
  currentCode: null,
  codeType: null, // 'student' | 'judge'
  groups: [],
  codes: {}, // Local fallback only
  sheetUrl: '',
  judgeScored: [], 
};

const CRITERIA = [
  { key: 'problem',     name: 'Problem Clarity',        hint: 'Real, specific, compelling — not vague or generic' },
  { key: 'solution',    name: 'AI Solution + ML Type',  hint: 'ML type named, justified, and clearly explained' },
  { key: 'data',        name: 'Data & Bias',             hint: 'Data sources named + bias type + specific mitigation' },
  { key: 'ethics',      name: 'Ethics & Impact',         hint: 'Specific harm scenario named + safeguards explained' },
  { key: 'limitations', name: 'Limitations & Risks',     hint: '2+ specific failure scenarios given' },
  { key: 'future',      name: 'Future Work',             hint: 'Ambitious, specific, and grounded — not generic' },
  { key: 'realworld',   name: 'Real-World Examples',     hint: 'Named + meaningfully compared to their system' },
];

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
window.addEventListener('load', () => {
  loadFromStorage();
  renderCriteria();
  renderGroupInputs();
  populateGroupDropdowns();
  document.getElementById('codeInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') submitCode();
  });
  document.getElementById('adminPwInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAdminPw();
  });
});

function loadFromStorage() {
  try {
    const g = localStorage.getItem(STORAGE.groups);
    if (g) state.groups = JSON.parse(g);
    else state.groups = Array.from({length: 12}, (_, i) => `Group ${i + 1}`);
  } catch (e) {
    console.warn("Could not load groups:", e);
    state.groups = Array.from({length: 12}, (_, i) => `Group ${i + 1}`);
  }

  try {
    const c = localStorage.getItem(STORAGE.codes);
    if (c) state.codes = JSON.parse(c);
  } catch (e) {
    console.warn("Could not load codes:", e);
  }

  try {
    const u = localStorage.getItem(STORAGE.sheetUrl);
    if (u) {
      state.sheetUrl = u;
      document.getElementById('sheetsUrl').value = u;
    }
  } catch(e) {}
}

// ════════════════════════════════════════
// VIEWS
// ════════════════════════════════════════
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showAdmin() {
  showView('adminView');
}

function exitAdmin() {
  document.getElementById('adminPwInput').value = '';
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('adminDashboard').classList.remove('visible');
  showView('landingView');
}

function goHome() {
  // Clear stored temporary state
  state.currentCode = null;
  state.codeType = null;
  document.getElementById('codeInput').value = '';
  
  // Reset Student View Form
  document.getElementById('studentAlreadyVoted').style.display = 'none';
  document.getElementById('studentSuccess').style.display = 'none';
  document.getElementById('studentVoteForm').style.display = 'block';
  document.getElementById('submitVoteBtn').style.display = 'flex';
  document.getElementById('voteSubmitting').style.display = 'none';
  ['vote1', 'vote2', 'vote3'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('submitVoteBtn').disabled = true;

  // Reset Judge View Form
  document.getElementById('judgeSuccess').style.display = 'none';
  document.getElementById('judgeScoreForm').style.display = 'block';
  document.getElementById('submitJudgeBtn').style.display = 'flex';
  document.getElementById('judgeGroupSelect').value = '';
  document.getElementById('judgeNotes').value = '';
  document.querySelectorAll('.score-btn').forEach(b => b.className = 'score-btn');
  judgeScores = {};
  
  showView('landingView');
}

// ════════════════════════════════════════
// CODE VALIDATION
// ════════════════════════════════════════
async function submitCode() {
  const raw = document.getElementById('codeInput').value.trim().toUpperCase();
  const errEl = document.getElementById('codeError');
  const btn = document.getElementById('btnEnterCode');
  errEl.textContent = '';

  if (!raw) {
    errEl.textContent = 'Please enter your code.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Checking...';

  let codeData = null;

  // If a Sheet URL is connected, verify against Google Sheets, otherwise fallback to local
  if (state.sheetUrl) {
    try {
      const res = await fetch(`${state.sheetUrl}?action=verifyCode&code=${raw}`);
      const data = await res.json();
      
      if (!data.valid) {
        errEl.textContent = data.error || 'Code not recognised. Check your card and try again.';
        btn.disabled = false;
        btn.textContent = 'Go →';
        return;
      }
      codeData = { type: data.type, used: data.used };
    } catch(e) {
      console.error(e);
      errEl.textContent = 'Network error verifying code. Try again.';
      btn.disabled = false;
      btn.textContent = 'Go →';
      return;
    }
  } else {
    // Fallback to local storage verification if no Sheets URL
    codeData = state.codes[raw];
    if (!codeData) {
      errEl.textContent = 'Code not recognised. Check your card and try again.';
      btn.disabled = false;
      btn.textContent = 'Go →';
      return;
    }
  }

  if (codeData.used && codeData.type === 'student') {
    errEl.textContent = 'This code has already been used.';
    showView('studentView');
    document.getElementById('studentAlreadyVoted').style.display = 'block';
    document.getElementById('studentVoteForm').style.display = 'none';
    btn.disabled = false;
    btn.textContent = 'Go →';
    return;
  }

  state.currentCode = raw;
  state.codeType = codeData.type;

  if (codeData.type === 'student') {
    document.getElementById('studentCodeBadge').textContent = raw;
    populateVoteDropdowns();
    showView('studentView');
  } else if (codeData.type === 'judge') {
    document.getElementById('judgeCodeBadge').textContent = raw;
    loadJudgeProgress();
    populateJudgeDropdown();
    showView('judgeView');
  }
  
  btn.disabled = false;
  btn.textContent = 'Go →';
}

// ════════════════════════════════════════
// STUDENT VOTING
// ════════════════════════════════════════
function populateVoteDropdowns() {
  ['vote1', 'vote2', 'vote3'].forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">— Select a group —</option>';
    state.groups.forEach(g => {
      if (g.trim()) sel.innerHTML += `<option value="${g}">${g}</option>`;
    });
  });
}

function validateVotes() {
  const v1 = document.getElementById('vote1').value;
  const v2 = document.getElementById('vote2').value;
  const v3 = document.getElementById('vote3').value;
  const err = document.getElementById('voteError');
  const btn = document.getElementById('submitVoteBtn');

  err.textContent = '';
  btn.disabled = true;

  if (!v1 || !v2 || !v3) return;

  const vals = [v1, v2, v3];
  const unique = new Set(vals);
  if (unique.size < 3) {
    err.textContent = 'You must choose three different groups.';
    return;
  }

  btn.disabled = false;
}

async function submitStudentVote() {
  const v1 = document.getElementById('vote1').value;
  const v2 = document.getElementById('vote2').value;
  const v3 = document.getElementById('vote3').value;

  document.getElementById('submitVoteBtn').style.display = 'none';
  document.getElementById('voteSubmitting').style.display = 'block';

  const payload = {
    type: 'student_vote',
    code: state.currentCode,
    first: v1,
    second: v2,
    third: v3,
    timestamp: new Date().toISOString()
  };

  const success = await sendToSheets(payload);

  if (success) {
    markCodeUsedLocal(state.currentCode);
    document.getElementById('studentVoteForm').style.display = 'none';
    document.getElementById('studentSuccess').style.display = 'flex';
  } else {
    document.getElementById('voteSubmitting').style.display = 'none';
    document.getElementById('submitVoteBtn').style.display = 'flex';
    document.getElementById('voteError').textContent = 'Submission failed. Please try again or ask your teacher.';
  }
}

// ════════════════════════════════════════
// JUDGE SCORING
// ════════════════════════════════════════
function renderCriteria() {
  const list = document.getElementById('criteriaList');
  list.innerHTML = CRITERIA.map((c, i) => `
    <div class="criteria-item" id="ci-${c.key}">
      <div class="c-name">${c.name}</div>
      <div class="c-hint">${c.hint}</div>
      <div class="score-btns">
        <button class="score-btn" onclick="selectScore('${c.key}', 1, this)">1<br><span style="font-weight:400; font-size:0.7rem;">Weak</span></button>
        <button class="score-btn" onclick="selectScore('${c.key}', 2, this)">2<br><span style="font-weight:400; font-size:0.7rem;">Developing</span></button>
        <button class="score-btn" onclick="selectScore('${c.key}', 3, this)">3<br><span style="font-weight:400; font-size:0.7rem;">Strong</span></button>
      </div>
    </div>
  `).join('');
}

let judgeScores = {};

function selectScore(key, val, btn) {
  const ci = document.getElementById(`ci-${key}`);
  ci.querySelectorAll('.score-btn').forEach(b => b.className = 'score-btn');
  btn.classList.add(`sel-${val}`);
  judgeScores[key] = val;
}

function populateJudgeDropdown() {
  const sel = document.getElementById('judgeGroupSelect');
  sel.innerHTML = '<option value="">— Choose a group —</option>';
  state.groups.forEach(g => {
    if (g.trim()) {
      const scored = state.judgeScored && state.judgeScored.includes(g);
      sel.innerHTML += `<option value="${g}">${scored ? '✓ ' : ''}${g}</option>`;
    }
  });
}

function loadJudgeProgress() {
  const key = `judge_progress_${state.currentCode}`;
  const saved = localStorage.getItem(key);
  state.judgeScored = saved ? JSON.parse(saved) : [];
  updateJudgeProgress();
}

function updateJudgeProgress() {
  const total = state.groups.filter(g => g.trim()).length;
  const done = state.judgeScored ? state.judgeScored.length : 0;
  document.getElementById('judgeProgressText').textContent = `${done} / ${total}`;
}

async function submitJudgeScore() {
  const group = document.getElementById('judgeGroupSelect').value;
  const notes = document.getElementById('judgeNotes').value;
  const err = document.getElementById('judgeError');

  err.textContent = '';

  if (!group) { err.textContent = 'Please select a group.'; return; }

  const missing = CRITERIA.filter(c => !judgeScores[c.key]);
  if (missing.length > 0) {
    err.textContent = `Please score all criteria. Missing: ${missing.map(c => c.name).join(', ')}.`;
    return;
  }

  const total = CRITERIA.reduce((sum, c) => sum + (judgeScores[c.key] || 0), 0);

  const payload = {
    type: 'judge_score',
    code: state.currentCode,
    group,
    scores: { ...judgeScores },
    total,
    notes,
    timestamp: new Date().toISOString()
  };

  document.getElementById('submitJudgeBtn').disabled = true;
  document.getElementById('submitJudgeBtn').textContent = 'Submitting...';

  const success = await sendToSheets(payload);

  if (success) {
    if (!state.judgeScored) state.judgeScored = [];
    if (!state.judgeScored.includes(group)) state.judgeScored.push(group);
    localStorage.setItem(`judge_progress_${state.currentCode}`, JSON.stringify(state.judgeScored));
    updateJudgeProgress();

    document.getElementById('judgeSuccessMsg').textContent = `Score of ${total}/21 recorded for ${group}.`;
    document.getElementById('judgeScoreForm').style.display = 'none';
    document.getElementById('judgeSuccess').style.display = 'flex';
  } else {
    err.textContent = 'Submission failed. Please try again.';
  }
  
  document.getElementById('submitJudgeBtn').disabled = false;
  document.getElementById('submitJudgeBtn').textContent = '✓ Submit Score for This Group';
}

function judgeScoreAnother() {
  judgeScores = {};
  document.getElementById('judgeGroupSelect').value = '';
  document.getElementById('judgeNotes').value = '';
  document.getElementById('judgeError').textContent = '';
  renderCriteria();
  populateJudgeDropdown();
  document.getElementById('judgeSuccess').style.display = 'none';
  document.getElementById('judgeScoreForm').style.display = 'block';
}

// ════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════
function checkAdminPw() {
  const pw = document.getElementById('adminPwInput').value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').classList.add('visible');
    renderGroupInputs();
    refreshResults();
  } else {
    document.getElementById('adminPwError').textContent = 'Incorrect password.';
  }
}

function adminTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['results', 'setup', 'codes'].forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
}

async function refreshResults() {
  if (!state.sheetUrl) {
    renderLocalResults();
    return;
  }
  try {
    const res = await fetch(`${state.sheetUrl}?action=getResults`);
    const data = await res.json();
    renderResults(data);
  } catch(e) {
    renderLocalResults();
  }
}

function renderLocalResults() {
  const groups = state.groups.filter(g => g.trim());
  document.getElementById('statGroups').textContent = groups.length;
  document.getElementById('statVotes').textContent = '—';
  document.getElementById('statJudge').textContent = '—';
  document.getElementById('statCodesLeft').textContent = Object.values(state.codes).filter(c => !c.used && c.type === 'student').length || '—';

  const tbody = document.getElementById('resultsBody');
  if (!groups.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--muted); padding:32px;">No groups configured yet. Go to Setup tab.</td></tr>';
    return;
  }
  tbody.innerHTML = groups.map((g, i) => `
    <tr>
      <td><span class="rank-badge rn">${i+1}</span></td>
      <td><div class="group-name">${g}</div></td>
      <td style="color:var(--muted);">—</td>
      <td style="color:var(--muted);">—</td>
      <td class="final-score">—</td>
    </tr>
  `).join('');
}

function renderResults(data) {
  if (!data || !data.groups) { renderLocalResults(); return; }

  document.getElementById('statVotes').textContent = data.totalVotes || 0;
  document.getElementById('statJudge').textContent = data.totalJudgeScores || 0;
  document.getElementById('statGroups').textContent = data.groups.length;
  
  // Calculate remaining codes based on valid codes synced from server
  const totalCodesCount = data.totalCodes || 0;
  document.getElementById('statCodesLeft').textContent = (totalCodesCount - (data.totalVotes || 0)) || '—';

  // Absolute Max for Judges (21)
  const maxJudge = 21;
  // Theoretical Max for Audience (Total Students * 3 points)
  const maxAudience = Math.max((data.totalVotes || 0) * 3, 1);

  const scored = data.groups.map(g => {
    const judgeNorm = ((g.avgJudge || 0) / maxJudge) * 100;
    const audienceNorm = ((g.audiencePts || 0) / maxAudience) * 100;
    const final = (judgeNorm * 0.5) + (audienceNorm * 0.5);
    return { ...g, judgeNorm, audienceNorm, final };
  }).sort((a, b) => b.final - a.final);

  const tbody = document.getElementById('resultsBody');
  tbody.innerHTML = scored.map((g, i) => {
    const rank = i + 1;
    const rankClass = rank <= 3 ? `r${rank}` : 'rn';
    const judgeBar = Math.round((g.judgeNorm || 0));
    const audBar = Math.round((g.audienceNorm || 0));
    return `
    <tr>
      <td><span class="rank-badge ${rankClass}">${rank}</span></td>
      <td><div class="group-name">${g.name}</div></td>
      <td>
        <div class="score-bar-wrap">
          <div class="score-bar"><div class="score-bar-fill" style="width:${judgeBar}%"></div></div>
          <span class="score-val">${g.avgJudge ? g.avgJudge.toFixed(1) : '—'}</span>
        </div>
      </td>
      <td>
        <div class="score-bar-wrap">
          <div class="score-bar"><div class="score-bar-fill audience" style="width:${audBar}%"></div></div>
          <span class="score-val">${g.audiencePts || 0}</span>
        </div>
      </td>
      <td class="final-score">${g.final ? g.final.toFixed(1) : '—'}</td>
    </tr>`;
  }).join('');
}

// ════════════════════════════════════════
// SETUP — GROUPS
// ════════════════════════════════════════
function renderGroupInputs() {
  const wrap = document.getElementById('groupNameInputs');
  if (!wrap) return;
  wrap.innerHTML = Array.from({length: 12}, (_, i) => `
    <input class="setup-input" id="gname-${i}" placeholder="Group ${i+1}" value="${state.groups[i] || ''}">
  `).join('');
}

function saveGroups() {
  state.groups = Array.from({length: 12}, (_, i) => {
    const el = document.getElementById(`gname-${i}`);
    return el ? el.value.trim() : '';
  });
  localStorage.setItem(STORAGE.groups, JSON.stringify(state.groups));
  populateGroupDropdowns();
  document.getElementById('setupMsg').textContent = '✓ Group names saved.';
  setTimeout(() => document.getElementById('setupMsg').textContent = '', 3000);
}

function populateGroupDropdowns() {
  populateVoteDropdowns();
  populateJudgeDropdown();
}

function saveSheetUrl() {
  state.sheetUrl = document.getElementById('sheetsUrl').value.trim();
  localStorage.setItem(STORAGE.sheetUrl, state.sheetUrl);
  document.getElementById('sheetUrlMsg').textContent = '✓ URL saved.';
  setTimeout(() => document.getElementById('sheetUrlMsg').textContent = '', 3000);
}

// ════════════════════════════════════════
// CODE GENERATION
// ════════════════════════════════════════
function generateCode(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function fetchExistingCodes() {
  if (!state.sheetUrl) {
    alert("Please configure a Google Sheets URL in the Setup tab first.");
    return;
  }
  const btn = document.getElementById('btnFetchCodes');
  btn.disabled = true;
  btn.textContent = 'Fetching...';

  try {
    const res = await fetch(`${state.sheetUrl}?action=getCodes`);
    const data = await res.json();
    
    if (data.codes) {
      const studentCodes = [];
      const judgeCodes = [];
      const newCodes = {};
      
      data.codes.forEach(c => {
        newCodes[c.code] = { type: c.type, used: c.used };
        
        let displayHtml = `<div>${c.code}`;
        if (c.used) {
          displayHtml += ` <span style="font-size:0.7em; color:var(--muted);">(used)</span>`;
        }
        displayHtml += `</div>`;

        if (c.type === 'student') studentCodes.push(displayHtml);
        if (c.type === 'judge') judgeCodes.push(displayHtml);
      });

      state.codes = newCodes;
      localStorage.setItem(STORAGE.codes, JSON.stringify(state.codes));

      document.getElementById('studentCodesList').innerHTML = studentCodes.join('');
      document.getElementById('judgeCodesList').innerHTML = judgeCodes.join('');
      
      document.getElementById('studentCodesCount').textContent = `(${studentCodes.length} total)`;
      document.getElementById('judgeCodesCount').textContent = `(${judgeCodes.length} total)`;
      
      document.getElementById('codesOutput').style.display = 'block';
    } else {
      alert("No codes found on the server.");
    }
  } catch (e) {
    console.error(e);
    alert("Error fetching codes. Check console.");
  }
  
  btn.disabled = false;
  btn.textContent = '🔄 Fetch Existing Codes';
}

async function generateCodes(append = false) {
  const btn = append ? document.getElementById('btnGenMoreCodes') : document.getElementById('btnGenCodes');
  btn.disabled = true;
  btn.textContent = 'Generating & Saving...';

  const nStudent = parseInt(document.getElementById('numStudentCodes').value) || 38;
  const nJudge = parseInt(document.getElementById('numJudgeCodes').value) || 5;

  let newCodes = append ? { ...state.codes } : {};
  let studentHtml = [];
  let judgeHtml = [];
  const payloadCodes = [];

  for (let i = 0; i < nStudent; i++) {
    let code;
    do { code = generateCode(4); } while (newCodes[code]);
    newCodes[code] = { type: 'student', used: false };
    studentHtml.push(`<div>${code}</div>`);
    payloadCodes.push({ code: code, type: 'student' });
  }

  for (let i = 0; i < nJudge; i++) {
    let code;
    do { code = generateCode(6); } while (newCodes[code]);
    newCodes[code] = { type: 'judge', used: false };
    judgeHtml.push(`<div>${code}</div>`);
    payloadCodes.push({ code: code, type: 'judge' });
  }

  state.codes = newCodes;
  localStorage.setItem(STORAGE.codes, JSON.stringify(state.codes));

  // Sync to Google Sheets!
  if (state.sheetUrl) {
    await sendToSheets({ type: append ? 'append_codes' : 'save_codes', codes: payloadCodes });
  }

  if (append) {
    document.getElementById('studentCodesList').innerHTML += studentHtml.join('');
    document.getElementById('judgeCodesList').innerHTML += judgeHtml.join('');
  } else {
    document.getElementById('studentCodesList').innerHTML = studentHtml.join('');
    document.getElementById('judgeCodesList').innerHTML = judgeHtml.join('');
  }
  
  // Update counts
  const totalStudent = Object.values(state.codes).filter(c => c.type === 'student').length;
  const totalJudge = Object.values(state.codes).filter(c => c.type === 'judge').length;
  
  document.getElementById('studentCodesCount').textContent = `(${totalStudent} total)`;
  document.getElementById('judgeCodesCount').textContent = `(${totalJudge} total)`;
  
  document.getElementById('codesOutput').style.display = 'block';

  btn.textContent = append ? 'Generate More Codes (Add)' : 'Generate New Codes';
  btn.disabled = false;
}

async function deleteCodes() {
  if (!confirm("Are you sure you want to delete ALL codes from the Google Sheet? This cannot be undone.")) return;
  
  const btn = document.getElementById('btnDeleteCodes');
  btn.textContent = 'Deleting...';
  btn.disabled = true;

  if (state.sheetUrl) {
    await sendToSheets({ type: 'delete_codes' });
  }

  state.codes = {};
  localStorage.removeItem(STORAGE.codes);
  document.getElementById('codesOutput').style.display = 'none';

  btn.textContent = '🗑️ Delete All Codes';
  btn.disabled = false;
  alert("Codes successfully deleted.");
}

function copyStudentCodes() {
  const container = document.getElementById('studentCodesList');
  const codes = Array.from(container.children).map(div => div.textContent).join('\n');
  navigator.clipboard.writeText(codes);
}

function copyJudgeCodes() {
  const container = document.getElementById('judgeCodesList');
  const codes = Array.from(container.children).map(div => div.textContent).join('\n');
  navigator.clipboard.writeText(codes);
}

function printCodes(type) {
  const keys = Object.keys(state.codes).filter(k => state.codes[k].type === type);
  if (keys.length === 0) {
    alert("No codes generated to print.");
    return;
  }
  
  const titleName = type === 'student' ? 'AUDIENCE' : 'JUDGE';
  const bgColor = type === 'student' ? '#1A154F' : '#F5BA38';
  const txColor = type === 'student' ? '#FFFFFF' : '#1A154F';
  const acColor = type === 'student' ? '#F5BA38' : '#1A154F';

  const cardsHtml = keys.map(code => `
    <div class="card">
      <div class="header" style="background:${bgColor}; color:${txColor};">
        <span class="lns">LNS AI CHALLENGE</span>
        <span class="ctype" style="color:${acColor};">${titleName} VOTE</span>
      </div>
      <div class="code-wrap">
        <div class="code">${code}</div>
      </div>
    </div>
  `).join('');

  const w = window.open('', '_blank');
  w.document.write(`
    <html>
      <head>
        <title>Print ${type} Codes</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700&display=swap');
          @page { margin: 0.5cm; }
          body { font-family: 'Barlow Condensed', sans-serif; margin: 0; background: #fff; }
          .grid { 
            display: flex; 
            flex-wrap: wrap; 
          }
          .card {
            width: 2.8cm; 
            height: 2.8cm; 
            border: 1px dashed #bbb;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            page-break-inside: avoid;
            margin: -0.5px; /* overlap dashed lines */
          }
          .header {
            width: 100%;
            padding: 4px 0;
            display: flex;
            flex-direction: column;
            line-height: 1.1;
            border-bottom: 1px solid #1A154F;
          }
          .lns { font-size: 7px; font-weight: 700; letter-spacing: 1px; }
          .ctype { font-size: 8px; font-family: sans-serif; font-weight: 900; margin-top: 1px; margin-bottom: 2px;}
          .code-wrap { 
            flex: 1; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            width: 100%;
          }
          .code { 
            font-size: 20px; 
            font-family: 'Bebas Neue', sans-serif; 
            letter-spacing: 3px; 
            color: #000;
          }
        </style>
      </head>
      <body>
        <div class="grid">
          ${cardsHtml}
        </div>
        <script>
          setTimeout(() => { window.print(); }, 500);
        </scr` + `ipt>
      </body>
    </html>
  `);
  w.document.close();
}

function markCodeUsedLocal(code) {
  if (state.codes[code]) {
    state.codes[code].used = true;
    localStorage.setItem(STORAGE.codes, JSON.stringify(state.codes));
  }
}

// ════════════════════════════════════════
// GOOGLE SHEETS
// ════════════════════════════════════════
async function sendToSheets(payload) {
  if (!state.sheetUrl) {
    console.warn('No Google Sheets URL configured. Submission stored locally only.');
    const key = `pending_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(payload));
    return true; 
  }
  try {
    const res = await fetch(state.sheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return true;
  } catch(e) {
    console.error('Sheets error:', e);
    const key = `pending_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(payload));
    return true; 
  }
}

// ════════════════════════════════════════
// EXPORT
// ════════════════════════════════════════
function exportCSV() {
  const rows = [['Group', 'Judge Score (avg)', 'Audience Points', 'Final Score']];
  const tbody = document.getElementById('resultsBody');
  tbody.querySelectorAll('tr').forEach(tr => {
    const cells = tr.querySelectorAll('td');
    if (cells.length >= 5) {
      rows.push([
        cells[1].textContent.trim(),
        cells[2].textContent.trim(),
        cells[3].textContent.trim(),
        cells[4].textContent.trim()
      ]);
    }
  });
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lns_ai_results.csv';
  a.click();
}
