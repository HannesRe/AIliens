const trainingColors = [
    ["#0f0c29", "#302b63"],
    ["#1a1a2e", "#16213e"],
    ["#1f005c", "#5b0060"],
    ["#070024", "#2c005b"],
    ["#0f2027", "#203a43"]
];

function t(key) {
    return window.AIFakeGameI18n?.t?.(key) ?? key;
}

const TRAINING_STEPS = [
    t("training.navigator1"),
    t("training.navigator2"),
    t("training.navigator3")
];
const TRAINING_NAVIGATOR_TEXTS = [
    t("training.navigator1"),
    t("training.navigator2"),
    t("training.navigator3")
];
const TRAINING_IMAGES_PER_STEP = 3;
const TRAINING_TOTAL_IMAGES = 6;
const TRAINING_IMAGE_CONFIG = [
    {
        file: "1.png",
        correctAnswer: "Fake",
        explanationKey: "training.item1.explanation",
        hintKey: "training.item1.hint"
    },
    {
        file: "2.png",
        correctAnswer: "Real",
        explanationKey: "training.item2.explanation",
        hintKey: "training.item2.hint"
    },
    {
        file: "3.png",
        correctAnswer: "Fake",
        explanationKey: "training.item3.explanation",
        hintKey: "training.item3.hint"
    },
    {
        file: "4.png",
        correctAnswer: "Real",
        explanationKey: "training.item4.explanation",
        hintKey: "training.item4.hint"
    },
    {
        file: "5.png",
        correctAnswer: "Fake",
        explanationKey: "training.item5.explanation",
        hintKey: "training.item5.hint"
    },
    {
        file: "6.png",
        correctAnswer: "Fake",
        explanationKey: "training.item6.explanation",
        hintKey: "training.item6.hint"
    }
];

let trainingSet = [];
let trainingIndex = 0;
let selectedAnswer = null;
let trainingScore = 0;
let resultShown = false;

const trainingAnswers = [];
let phaseTwoIntroShown = false;

function buildTrainingSet() {
    const sourcePool = TRAINING_IMAGE_CONFIG.map((item) => ({
        challengePath: `Img4Learning/Challenge/${item.file}`,
        resultPath: `Img4Learning/Result/${item.file}`,
        fileName: item.file,
        correctAnswer: item.correctAnswer,
        explanation: t(item.explanationKey),
        hint: t(item.hintKey)
    }));

    if (sourcePool.length === 0) {
        trainingSet = [];
        return;
    }

    // Keep the order from TRAINING_IMAGE_CONFIG so each step gets fixed images.
    if (sourcePool.length >= TRAINING_TOTAL_IMAGES) {
        trainingSet = sourcePool.slice(0, TRAINING_TOTAL_IMAGES);
        return;
    }

    const expandedSet = [];
    for (let i = 0; i < TRAINING_TOTAL_IMAGES; i++) {
        expandedSet.push({ ...sourcePool[i % sourcePool.length] });
    }
    trainingSet = expandedSet;
}

function setGradientBackground() {
    const randomIndex = Math.floor(Math.random() * trainingColors.length);
    document.body.style.background = `linear-gradient(to bottom, ${trainingColors[randomIndex][0]}, ${trainingColors[randomIndex][1]})`;
}

function updateProgress() {
    const progressEl = document.getElementById("training-progress");

    if (!progressEl) {
        return;
    }

    const currentStep = Math.floor(trainingIndex / TRAINING_IMAGES_PER_STEP) + 1;
    progressEl.textContent = TRAINING_NAVIGATOR_TEXTS[currentStep - 1];

    setStepInfoText(TRAINING_STEPS[currentStep - 1] || "");
}

function setStepInfoText(text, stateClass = "") {
    const stepInfoEl = document.getElementById("training-step-info");
    if (!stepInfoEl) {
        return;
    }

    stepInfoEl.classList.remove("training-step-hint", "training-step-correct", "training-step-wrong");
    if (stateClass) {
        stepInfoEl.classList.add(stateClass);
    }

    stepInfoEl.textContent = text;
}

function resetAnswerButtons() {
    document.getElementById("real-btn")?.classList.remove("selected");
    document.getElementById("fake-btn")?.classList.remove("selected");
}

function showImage() {
    const imageEl = document.getElementById("quiz-image");
    const continueBtn = document.getElementById("continue-btn");

    const hintBtn = document.getElementById("hint-btn");
    const realBtn = document.getElementById("real-btn");
    const fakeBtn = document.getElementById("fake-btn");

    if (!imageEl) {
        return;
    }

    setGradientBackground();
    updateProgress();

    if (trainingSet.length === 0) {
        imageEl.removeAttribute("src");
        return;
    }

    imageEl.src = trainingSet[trainingIndex].challengePath;
    selectedAnswer = null;
    resultShown = false;
        setStepInfoText(t("training.defaultMessage"));
    if (hintBtn) {
        hintBtn.style.display = "inline-block";
    }
    if (realBtn) {
        realBtn.style.display = "inline-block";
    }
    if (fakeBtn) {
        fakeBtn.style.display = "inline-block";
    }
    resetAnswerButtons();

    if (continueBtn) {
        continueBtn.style.display = "none";
        continueBtn.disabled = true;
    }
}

function showHint() {
    const currentItem = trainingSet[trainingIndex];
    const hintBtn = document.getElementById("hint-btn");

    if (!currentItem) {
        return;
    }

    setStepInfoText(`${t("training.hintPrefix")} ${currentItem.hint}`, "training-step-hint");

    if (hintBtn) {
        hintBtn.style.display = "none";
    }
}

function selectAnswer(answer) {
    if (resultShown) {
        return;
    }

    selectedAnswer = answer;

    resetAnswerButtons();

    if (answer === "Real") {
        document.getElementById("real-btn")?.classList.add("selected");
    } else {
        document.getElementById("fake-btn")?.classList.add("selected");
    }

    showResult();
}

function showResult() {
    const currentItem = trainingSet[trainingIndex];
    const continueBtn = document.getElementById("continue-btn");
    const hintBtn = document.getElementById("hint-btn");
    const imageEl = document.getElementById("quiz-image");
    const realBtn = document.getElementById("real-btn");
    const fakeBtn = document.getElementById("fake-btn");

    if (!currentItem || !selectedAnswer || !imageEl) {
        return;
    }

    if (resultShown) {
        return;
    }

    const isCorrect = selectedAnswer === currentItem.correctAnswer;
    if (isCorrect) {
        trainingScore += 1;
    }

    const resultText = isCorrect
        ? t("training.result.correct")
        : `${t("training.result.incorrectPrefix")} ${currentItem.correctAnswer === "Real" ? t("quiz.real") : t("quiz.fake")}.`;
    const stepStateClass = isCorrect ? "training-step-correct" : "training-step-wrong";
    setStepInfoText(`${resultText} ${t("training.result.explanation")} ${currentItem.explanation}`, stepStateClass);

    if (hintBtn) {
        hintBtn.style.display = "none";
    }

    trainingAnswers[trainingIndex] = {
        challengeImagePath: currentItem.challengePath,
        resultImagePath: currentItem.resultPath,
        fileName: currentItem.fileName,
        selectedAnswer,
        correctAnswer: currentItem.correctAnswer,
        explanation: currentItem.explanation,
        correct: isCorrect
    };

    // Show result image with same filename from the Result folder.
    imageEl.src = currentItem.resultPath;

    resultShown = true;

    if (realBtn) {
        realBtn.style.display = "none";
    }
    if (fakeBtn) {
        fakeBtn.style.display = "none";
    }

    if (continueBtn) {
        continueBtn.style.display = "inline-block";
        continueBtn.disabled = false;
    }
}

function nextTrainingImage() {
    if (!resultShown) {
        return;
    }

    trainingIndex += 1;

    if (trainingIndex >= trainingSet.length) {
        finishTraining();
        return;
    }

    if (!phaseTwoIntroShown && trainingIndex === TRAINING_IMAGES_PER_STEP) {
        const phaseIntroTwoEl = document.getElementById("phase-intro-2");
        const quizContainerEl = document.getElementById("training-quiz-container");

        phaseTwoIntroShown = true;

        if (phaseIntroTwoEl && quizContainerEl) {
            quizContainerEl.classList.add("is-hidden");
            quizContainerEl.style.display = "none";
            phaseIntroTwoEl.classList.remove("is-hidden");
            phaseIntroTwoEl.style.display = "block";
            return;
        }
    }

    showImage();
}

function finishTraining() {
    const container = document.querySelector(".quiz-container");
    if (!container) {
        return;
    }

    const total = trainingSet.length;
    const percent = Math.round((trainingScore / total) * 100);

    localStorage.setItem("trainingData", JSON.stringify({
        timestamp: new Date().toISOString(),
        score: trainingScore,
        total,
        percent,
        answers: trainingAnswers
    }));
    const correctEl = document.getElementById("training-complete-correct");
    if (correctEl) correctEl.textContent = `${trainingScore}/${total}`;
    const accuracyEl = document.getElementById("training-complete-accuracy");
    if (accuracyEl) accuracyEl.textContent = `${percent}%`;
    const quizContainerEl = document.getElementById("training-quiz-container");
    if (quizContainerEl) quizContainerEl.style.setProperty("display", "none");
    const completePanel = document.getElementById("training-complete-panel");
    if (completePanel) completePanel.style.setProperty("display", "block");

    document.getElementById("go-quiz-btn")?.addEventListener("click", () => {
        localStorage.setItem("quizRunPhase", "phase2");
        window.location.href = "quiz.html";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    buildTrainingSet();

    document.getElementById("real-btn")?.addEventListener("click", () => selectAnswer("Real"));
    document.getElementById("fake-btn")?.addEventListener("click", () => selectAnswer("Fake"));
    document.getElementById("hint-btn")?.addEventListener("click", showHint);
    document.getElementById("continue-btn")?.addEventListener("click", nextTrainingImage);

    const phaseIntroOneEl = document.getElementById("phase-intro-1");
    const phaseIntroTwoEl = document.getElementById("phase-intro-2");
    const quizContainerEl = document.getElementById("training-quiz-container");
    const startPhaseOneBtn = document.getElementById("start-phase-1-btn");
    const startPhaseTwoBtn = document.getElementById("start-phase-2-btn");
   // const toggleButtons = document.querySelectorAll('.toggle-image-btn');

    if (!startPhaseOneBtn || !quizContainerEl) {
        if (quizContainerEl) {
            quizContainerEl.style.display = "block";
            quizContainerEl.classList.remove("is-hidden");
        }
        showImage();
        return;
    }

    phaseIntroOneEl?.classList.remove("is-hidden");
    phaseIntroOneEl?.style.setProperty("display", "block");
    phaseIntroTwoEl?.classList.add("is-hidden");
    phaseIntroTwoEl?.style.setProperty("display", "none");
    quizContainerEl.style.display = "none";
    quizContainerEl.classList.add("is-hidden");

    startPhaseOneBtn.addEventListener("click", () => {
        phaseIntroOneEl?.classList.add("is-hidden");
        phaseIntroOneEl?.style.setProperty("display", "none");
        quizContainerEl.classList.remove("is-hidden");
        quizContainerEl.style.display = "block";
        showImage();
    });

    startPhaseTwoBtn?.addEventListener("click", () => {
        phaseIntroTwoEl?.classList.add("is-hidden");
        phaseIntroTwoEl?.style.setProperty("display", "none");
        quizContainerEl.classList.remove("is-hidden");
        quizContainerEl.style.display = "block";
        showImage();
    });

   
});

