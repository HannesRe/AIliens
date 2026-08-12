function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function translate(key) {
  return window.AIFakeGameI18n?.t?.(key) ?? key;
}

function renderCard(prefix, data, fallbackTotal) {
  const scoreEl = document.getElementById(`${prefix}-score`);
  const detailEl = document.getElementById(`${prefix}-detail`);

  if (!scoreEl || !detailEl) return null;

  if (!data) {
    scoreEl.textContent = "-";
    detailEl.textContent = translate("summary.noData");
    return null;
  }

  const total = data.total ?? fallbackTotal ?? 0;
  const correct = data.correct ?? 0;
  const percent = data.percent ?? (total > 0 ? Math.round((correct / total) * 100) : 0);

  scoreEl.textContent = `${percent}%`;
  detailEl.textContent = `${correct}/${total} ${translate("summary.correctSuffix")}`;

  return percent;
}

document.addEventListener("DOMContentLoaded", () => {
  const phase1 = readJson("quizPhase1Summary");
  const training = readJson("trainingData");
  const phase2 = readJson("quizPhase2Summary");

  const values = [];

  const p1 = renderCard("phase1", phase1);
  if (p1 !== null) values.push(p1);

  const trainingAdapted = training
    ? {
        correct: training.score,
        total: training.total,
        percent: training.percent
      }
    : null;

  const tr = renderCard("training", trainingAdapted);
  if (tr !== null) values.push(tr);

  const p2 = renderCard("phase2", phase2);
  if (p2 !== null) values.push(p2);

  const overallEl = document.getElementById("overall-score");
  if (overallEl) {
    if (values.length === 0) {
      overallEl.textContent = "-";
    } else {
      const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
      overallEl.textContent = `${avg}%`;
    }
  }

  document.getElementById("home-btn")?.addEventListener("click", () => {
    localStorage.removeItem("quizRunPhase");
    window.location.href = "index.html";
  });

  document.getElementById("learn-more-btn")?.addEventListener("click", () => {
    window.location.href = "additional_information.html";
  });
});
