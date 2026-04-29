// ============================================================
// LNS AI Innovation Challenge — Voting System Backend
// Google Apps Script Web App
// ============================================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

const SHEETS = {
  votes:  'Student Votes',
  judges: 'Judge Scores',
  codes:  'Codes',
  groups: 'Groups'
};

// ════════════════════════════════════════
// ENTRY POINTS
// ════════════════════════════════════════

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.type === 'student_vote') {
      return handleStudentVote(payload);
    }

    if (payload.type === 'judge_score') {
      return handleJudgeScore(payload);
    }

    if (payload.type === 'save_codes') {
      return handleSaveCodes(payload, false);
    }

    if (payload.type === 'append_codes') {
      return handleSaveCodes(payload, true);
    }

    if (payload.type === 'delete_codes') {
      return handleDeleteCodes(payload);
    }

    if (payload.type === 'save_groups') {
      return handleSaveGroups(payload);
    }

    return jsonResponse({ success: false, error: 'Unknown payload type' });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getResults') {
    return handleGetResults();
  }

  if (action === 'getCodes') {
    return handleGetCodes();
  }

  if (action === 'verifyCode') {
    return handleVerifyCode(e.parameter.code);
  }

  if (action === 'getGroups') {
    return handleGetGroups();
  }

  if (action === 'setup') {
    setupSheets();
    return jsonResponse({ success: true, message: 'Sheets created.' });
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

// ════════════════════════════════════════
// CODE ACTIONS
// ════════════════════════════════════════

function handleVerifyCode(code) {
  const sheet = getOrCreateSheet(SHEETS.codes, ['Code', 'Type', 'Used']);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === code) {
      const isUsed = data[i][2] === true || data[i][2] === 'TRUE' || data[i][2] === 'true';
      return jsonResponse({
        valid: true,
        type: data[i][1],
        used: isUsed
      });
    }
  }

  return jsonResponse({ valid: false, error: 'Code not recognised. Check your card and try again.' });
}

function handleGetGroups() {
  const sheet = getOrCreateSheet(SHEETS.groups, ['Name', 'Members', 'Section', 'Photo']);

  // If sheet is empty (only header), initialize with defaults
  if (sheet.getLastRow() <= 1) {
    for (let i = 1; i <= 11; i++) {
      sheet.appendRow([`Group ${i}`, '', 'Grade 10+11+12', `group${i}.jpg`]);
    }
  }

  const data = sheet.getDataRange().getValues();
  const groups = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      groups.push({
        name: data[i][0].toString().trim(),
        members: (data[i][1] || '').toString().trim(),
        section: (data[i][2] || 'Grade 10+11+12').toString().trim(),
        photo: (data[i][3] || `group${i}.jpg`).toString().trim()
      });
    }
  }
  return jsonResponse({ success: true, groups: groups });
}

function handleSaveGroups(payload) {
  const sheet = getOrCreateSheet(SHEETS.groups, ['Name', 'Members', 'Section', 'Photo']);
  const groups = payload.groups || [];

  // Clear existing data (keep header)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 4).clearContent();
  }

  // Add new groups
  if (groups.length > 0) {
    const rows = groups.map(g => [
      g.name || '',
      g.members || '',
      g.section || 'Grade 10+11+12',
      g.photo || ''
    ]);
    sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  }

  return jsonResponse({ success: true });
}

function handleGetCodes() {
  const sheet = getOrCreateSheet(SHEETS.codes, ['Code', 'Type', 'Used']);
  const data = sheet.getDataRange().getValues();
  const codes = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      codes.push({
        code: data[i][0],
        type: data[i][1],
        used: data[i][2] === true || data[i][2] === 'TRUE' || data[i][2] === 'true'
      });
    }
  }
  return jsonResponse({ success: true, codes: codes });
}

function handleSaveCodes(payload, append) {
  const sheet = getOrCreateSheet(SHEETS.codes, ['Code', 'Type', 'Used']);
  
  if (!append) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 3).clearContent();
    }
  }
  
  const rows = payload.codes.map(c => [c.code, c.type, false]);
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 3).setValues(rows);
  }
  return jsonResponse({ success: true });
}

function handleDeleteCodes(payload) {
  const sheet = getOrCreateSheet(SHEETS.codes, ['Code', 'Type', 'Used']);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 3).clearContent();
  }
  return jsonResponse({ success: true });
}

// ════════════════════════════════════════
// STUDENT VOTE HANDLER
// ════════════════════════════════════════

function handleStudentVote(payload) {
  const sheet = getOrCreateSheet(SHEETS.votes, [
    'Timestamp', 'Code', 'First (3pts)', 'Second (2pts)', 'Third (1pt)'
  ]);

  // Check for duplicate code
  const existing = sheet.getDataRange().getValues();
  const alreadyVoted = existing.slice(1).some(row => row[1] === payload.code);

  if (alreadyVoted) {
    return jsonResponse({ success: false, error: 'Code already used.' });
  }

  sheet.appendRow([
    payload.timestamp || new Date().toISOString(),
    payload.code,
    payload.first,
    payload.second,
    payload.third
  ]);
  
  // Mark the code as used in the Codes sheet
  const codeSheet = getOrCreateSheet(SHEETS.codes, ['Code', 'Type', 'Used']);
  const codeData = codeSheet.getDataRange().getValues();
  for (let i = 1; i < codeData.length; i++) {
    if (codeData[i][0] === payload.code) {
      codeSheet.getRange(i + 1, 3).setValue(true); // Mark Used as true
      break;
    }
  }

  return jsonResponse({ success: true });
}

// ════════════════════════════════════════
// JUDGE SCORE HANDLER
// ════════════════════════════════════════

function handleJudgeScore(payload) {
  const headers = [
    'Timestamp', 'Judge Code', 'Group',
    'Problem', 'AI Solution', 'Data & Bias',
    'Ethics', 'Limitations', 'Future Work', 'Real-World',
    'Total (/21)', 'Notes'
  ];

  const sheet = getOrCreateSheet(SHEETS.judges, headers);

  // Check if this judge already scored this group
  const existing = sheet.getDataRange().getValues();
  const alreadyScored = existing.slice(1).some(
    row => row[1] === payload.code && row[2] === payload.group
  );

  if (alreadyScored) {
    // Update existing row instead of duplicating
    const rowIdx = existing.findIndex(
      (row, i) => i > 0 && row[1] === payload.code && row[2] === payload.group
    );
    if (rowIdx >= 0) {
      const s = payload.scores;
      sheet.getRange(rowIdx + 1, 1, 1, 12).setValues([[
        payload.timestamp || new Date().toISOString(),
        payload.code,
        payload.group,
        s.problem || 0, s.solution || 0, s.data || 0,
        s.ethics || 0, s.limitations || 0, s.future || 0, s.realworld || 0,
        payload.total || 0,
        payload.notes || ''
      ]]);
    }
    return jsonResponse({ success: true, updated: true });
  }

  const s = payload.scores;
  sheet.appendRow([
    payload.timestamp || new Date().toISOString(),
    payload.code,
    payload.group,
    s.problem || 0, s.solution || 0, s.data || 0,
    s.ethics || 0, s.limitations || 0, s.future || 0, s.realworld || 0,
    payload.total || 0,
    payload.notes || ''
  ]);

  return jsonResponse({ success: true });
}

// ════════════════════════════════════════
// GET RESULTS HANDLER
// ════════════════════════════════════════

function handleGetResults() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Get groups list with all fields
  const groupsSheet = ss.getSheetByName(SHEETS.groups);
  let groupsList = [];
  if (groupsSheet) {
    const gData = groupsSheet.getDataRange().getValues();
    groupsList = gData.slice(1).map(r => ({
      name: (r[0] || '').toString().trim(),
      members: (r[1] || '').toString().trim(),
      section: (r[2] || 'Grade 10+11+12').toString().trim(),
      photo: (r[3] || '').toString().trim()
    })).filter(g => g.name);
  }

  if (!groupsList.length) {
    return jsonResponse({ success: false, error: 'No groups configured.' });
  }

  // ── AUDIENCE VOTE TALLY ──
  const votesSheet = ss.getSheetByName(SHEETS.votes);
  const audiencePts = {};
  groupsList.forEach(g => audiencePts[g.name] = 0);

  if (votesSheet && votesSheet.getLastRow() > 1) {
    const voteData = votesSheet.getDataRange().getValues().slice(1);
    voteData.forEach(row => {
      const first  = row[2];
      const second = row[3];
      const third  = row[4];
      if (audiencePts.hasOwnProperty(first))  audiencePts[first]  += 3;
      if (audiencePts.hasOwnProperty(second)) audiencePts[second] += 2;
      if (audiencePts.hasOwnProperty(third))  audiencePts[third]  += 1;
    });
  }

  const totalVotes = votesSheet && votesSheet.getLastRow() > 1
    ? votesSheet.getLastRow() - 1 : 0;

  // ── JUDGE SCORE AVERAGE ──
  const judgesSheet = ss.getSheetByName(SHEETS.judges);
  const judgeData = {};
  groupsList.forEach(g => judgeData[g.name] = { scores: [], count: 0 });

  let totalJudgeScores = 0;

  if (judgesSheet && judgesSheet.getLastRow() > 1) {
    const jData = judgesSheet.getDataRange().getValues().slice(1);
    jData.forEach(row => {
      const group = row[2];
      const total = parseFloat(row[10]) || 0;
      if (judgeData.hasOwnProperty(group)) {
        judgeData[group].scores.push(total);
        judgeData[group].count++;
        totalJudgeScores++;
      }
    });
  }

  // ── TOTAL VALID CODES ──
  const codesSheet = ss.getSheetByName(SHEETS.codes);
  const totalCodes = codesSheet && codesSheet.getLastRow() > 1
    ? (codesSheet.getDataRange().getValues().slice(1).filter(r => r[1] === 'student').length) : 0;

  // ── COMBINE & CALCULATE FINAL ──
  const maxAudience = Math.max(...groupsList.map(g => audiencePts[g.name] || 0), 1);
  const maxJudge = 21;

  const result = groupsList.map(g => {
    const scores = judgeData[g.name] ? judgeData[g.name].scores : [];
    const avgJudge = scores.length
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

    const judgeNorm  = avgJudge !== null ? (avgJudge / maxJudge) * 100 : null;
    const audNorm    = (audiencePts[g.name] / maxAudience) * 100;

    let final = null;
    if (judgeNorm !== null) {
      final = (judgeNorm * 0.5) + (audNorm * 0.5);
    }

    return {
      name:        g.name,
      members:     g.members,
      section:     g.section,
      photo:       g.photo,
      avgJudge:    avgJudge !== null ? Math.round(avgJudge * 10) / 10 : null,
      judgeCount:  scores.length,
      audiencePts: audiencePts[g.name],
      final:       final !== null ? Math.round(final * 10) / 10 : null
    };
  });

  // Sort by final score descending (nulls last)
  result.sort((a, b) => {
    if (a.final === null && b.final === null) return 0;
    if (a.final === null) return 1;
    if (b.final === null) return -1;
    return b.final - a.final;
  });

  return jsonResponse({
    success: true,
    groups: result,
    totalVotes,
    totalJudgeScores,
    totalCodes
  });
}

// ════════════════════════════════════════
// SHEET UTILITIES
// ════════════════════════════════════════

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);

    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1A154F');
    headerRange.setFontColor('#F5BA38');
    headerRange.setFontWeight('bold');
    headerRange.setFontFamily('Arial');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function setupSheets() {
  getOrCreateSheet(SHEETS.votes, [
    'Timestamp', 'Code', 'First (3pts)', 'Second (2pts)', 'Third (1pt)'
  ]);

  getOrCreateSheet(SHEETS.judges, [
    'Timestamp', 'Judge Code', 'Group',
    'Problem', 'AI Solution', 'Data & Bias',
    'Ethics', 'Limitations', 'Future Work', 'Real-World',
    'Total (/21)', 'Notes'
  ]);

  getOrCreateSheet(SHEETS.groups, ['Name', 'Members', 'Section', 'Photo']);
  getOrCreateSheet(SHEETS.codes,  ['Code', 'Type', 'Used']);

  // Add sample groups to Groups sheet if empty
  const groupsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.groups);
  if (groupsSheet.getLastRow() <= 1) {
    for (let i = 1; i <= 11; i++) {
      groupsSheet.appendRow([`Group ${i}`, '', 'Grade 10+11+12', `group${i}.jpg`]);
    }
  }
}

// ════════════════════════════════════════
// HELPER
// ════════════════════════════════════════

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}