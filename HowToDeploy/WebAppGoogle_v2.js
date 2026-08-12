/**
 * Google Apps Script endpoint for quiz submissions.
 *
 * This version is adapted for the current frontend payload:
 * - Supports demographic field aliases (altersgruppe/ageGroup/age) plus status and playedBefore
 * - Supports variable question counts (e.g. 5, 10, 12)
 * - Appends one row per submission in sheet "QuizData"
 */

function doPost(e) {
  try {
    var params = normalizeParameters_(e);

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      spreadsheet = SpreadsheetApp.create("Quiz Results");
    }

    var sheetName = "QuizData";
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    var questionCount = getQuestionCount_(params);

    ensureHeader_(sheet, questionCount);
    ensureQuestionColumns_(sheet, questionCount);

    var rowData = buildRowData_(params, questionCount);
    sheet.appendRow(rowData);

    return jsonResponse_(200, {
      status: "success",
      message: "Quiz data saved successfully",
      questionCount: questionCount
    });
  } catch (error) {
    return jsonResponse_(500, {
      status: "error",
      message: String(error)
    });
  }
}

/**
 * Optional helper to (re)create headers from scratch.
 * Run manually in Apps Script editor if needed.
 */
function setupQuizSheetV2() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.create("Quiz Results");
  }

  var sheetName = "QuizData";
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet) {
    spreadsheet.deleteSheet(sheet);
  }

  sheet = spreadsheet.insertSheet(sheetName);

  // Start with base header only; question columns are expanded automatically by doPost.
  var baseHeader = getBaseHeader_();
  sheet.getRange(1, 1, 1, baseHeader.length).setValues([baseHeader]);
}

function normalizeParameters_(e) {
  var p = (e && e.parameters) ? e.parameters : {};
  var out = {};

  for (var key in p) {
    if (!Object.prototype.hasOwnProperty.call(p, key)) {
      continue;
    }
    var value = p[key];
    out[key] = (Array.isArray(value) && value.length > 0) ? String(value[0]) : String(value || "");
  }

  return out;
}

function getQuestionCount_(params) {
  var maxQ = 0;

  for (var key in params) {
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      continue;
    }

    var m = key.match(/^q(\d+)_(image|answer|confidence|correct)$/);
    if (m) {
      var idx = parseInt(m[1], 10);
      if (idx > maxQ) {
        maxQ = idx;
      }
    }
  }

  return maxQ;
}

function ensureHeader_(sheet, questionCount) {
  if (sheet.getLastRow() === 0) {
    var header = getFullHeader_(questionCount);
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    return;
  }

  // If row 1 exists but is empty, initialize it.
  var firstRowValues = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var isEmpty = true;
  for (var i = 0; i < firstRowValues.length; i++) {
    if (String(firstRowValues[i]).trim() !== "") {
      isEmpty = false;
      break;
    }
  }

  if (isEmpty) {
    var fullHeader = getFullHeader_(questionCount);
    sheet.getRange(1, 1, 1, fullHeader.length).setValues([fullHeader]);
  }
}

function ensureQuestionColumns_(sheet, questionCount) {
  if (questionCount <= 0) {
    return;
  }

  var existingColumns = sheet.getLastColumn();
  var neededColumns = getFullHeader_(questionCount).length;

  if (existingColumns < neededColumns) {
    sheet.insertColumnsAfter(existingColumns, neededColumns - existingColumns);
  }

  var fullHeader = getFullHeader_(questionCount);
  sheet.getRange(1, 1, 1, fullHeader.length).setValues([fullHeader]);
}

function buildRowData_(params, questionCount) {
  var timestampIso = firstNonEmpty_(
    params.timestamp,
    params.registrationDate,
    new Date().toISOString()
  );

  var timestamp = parseDateSafe_(timestampIso);

    var altersgruppe = firstNonEmpty_(params.altersgruppe, params.ageGroup, params.age, "");
    var status = firstNonEmpty_(params.status, "");
    var playedBefore = firstNonEmpty_(params.playedBefore, "");
    var phase1_score = firstNonEmpty_(params.phase1_score, "");
    var phase1_time = firstNonEmpty_(params.phase1_timeTaken, params.phase1_time, "");
    var phase1_play = firstNonEmpty_(params.phase1_playNumber, "");
    var phase1_answers = firstNonEmpty_(params.phase1_answers, "");
    var phase2_score = firstNonEmpty_(params.phase2_score, "");
    var phase2_time = firstNonEmpty_(params.phase2_timeTaken, params.phase2_time, "");
    var phase2_play = firstNonEmpty_(params.phase2_playNumber, "");
    var phase2_answers = firstNonEmpty_(params.phase2_answers, "");

  var row = [
    timestamp,
    firstNonEmpty_(params.playerId, ""),
    firstNonEmpty_(params.sessionId, ""),
    firstNonEmpty_(params.playNumber, ""),
    altersgruppe,
    status,
    playedBefore,
    firstNonEmpty_(params.gameType, ""),
      firstNonEmpty_(params.score, ""),
      firstNonEmpty_(phase1_score, ""),
      firstNonEmpty_(phase1_time, ""),
      firstNonEmpty_(phase1_play, ""),
      firstNonEmpty_(phase1_answers, ""),
      firstNonEmpty_(phase2_score, ""),
      firstNonEmpty_(phase2_time, ""),
      firstNonEmpty_(phase2_play, ""),
      firstNonEmpty_(phase2_answers, ""),
      firstNonEmpty_(params.timeTaken, "")
  ];

  for (var i = 1; i <= questionCount; i++) {
    row.push(firstNonEmpty_(params["q" + i + "_image"], ""));
    row.push(firstNonEmpty_(params["q" + i + "_answer"], ""));
    row.push(firstNonEmpty_(params["q" + i + "_confidence"], ""));
    row.push(firstNonEmpty_(params["q" + i + "_correct"], ""));
  }

  return row;
}

function getBaseHeader_() {
  return [
    "Timestamp",
    "Player ID",
    "Session ID",
    "Play Number",
    "Altersgruppe",
    "Status",
    "Played Before",
    "Game Type",
    "Score Phase 1",
    "Time Phase 1 (seconds)",
    "Play Number Phase 1",
    "Answers Phase 1",
    "Score Phase 2",
    "Time Phase 2 (seconds)",
    "Play Number Phase 2",
    "Answers Phase 2",
    "Total Score",
    "Time Taken (seconds)"
  ];
}

function getFullHeader_(questionCount) {
  var header = getBaseHeader_();

  for (var i = 1; i <= questionCount; i++) {
    header.push("Q" + i + " Image");
    header.push("Q" + i + " Answer");
    header.push("Q" + i + " Confidence");
    header.push("Q" + i + " Correct");
  }

  return header;
}

function parseDateSafe_(value) {
  var d = new Date(value);
  if (isNaN(d.getTime())) {
    return new Date();
  }
  return d;
}

function firstNonEmpty_() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i];
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return v;
    }
  }
  return "";
}

function jsonResponse_(statusCode, payload) {
  // ContentService does not expose custom status codes directly for Web Apps,
  // but we keep statusCode in the payload for client-side handling.
  payload.httpStatus = statusCode;

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
