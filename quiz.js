// Quiz Configuration
const colors = [
    ["#0f0c29", "#302b63"],
    ["#1a1a2e", "#16213e"],
    ["#1f005c", "#5b0060"],
    ["#070024", "#2c005b"],
    ["#0f2027", "#203a43"],
    ["#1a2a6c", "#b21f1f"],
    ["#3a1c71", "#d76d77"],
    ["#200122", "#6f0000"],
    ["#0f0c29", "#24243e"],
    ["#000428", "#004e92"]
];

// Quiz Variables
let score = 0;
let currentQuestionIndex = 0;
const formData = JSON.parse(localStorage.getItem('formData') || '{}');
const totalQuestions = formData.gameType === 'long' ? 12 : 5;
let imageFolder = "Img"; // Default image folder
let sessionId = localStorage.getItem('sessionId') || generateSessionId();
let playNumber = getPlayNumber();
let userAnswers = new Array(totalQuestions).fill(null);
let userConfidence = new Array(totalQuestions).fill(null);
let timerInterval;
const quizStartTime = Date.now();
let currentConfidence = null;
const FORCE_PLAY_NUMBER = "3.2";
let arrowListenersSetup = false; // Flag to prevent duplicate listeners
const quizRunPhase = localStorage.getItem("quizRunPhase");
const hasTrainingData = !!localStorage.getItem("trainingData");
const isSecondQuizPhase = quizRunPhase === "phase2" && hasTrainingData;
const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwQLcTXioExiC45xiM5z_tb3moZCv5pbxQqsFaAVZEHd73GZMz1g5S_-IQqaEFxHUcU/exec";

if (quizRunPhase === "phase2" && !hasTrainingData) {
    localStorage.setItem("quizRunPhase", "phase1");
}

function t(key) {
    return window.AIFakeGameI18n?.t?.(key) ?? key;
}

function setQuizAgentMessage(key) {
    const bubble = document.querySelector('.agent-callout-small .speech-bubble');
    if (!bubble) return;
    bubble.innerHTML = t(key);
}

// This will store our randomized image paths and their correct answers
let imageSet = [];
let correctAnswers = {};

// Store IDs in localStorage if not already set
if (!localStorage.getItem('sessionId')) {
    localStorage.setItem('sessionId', sessionId);
}

// Initialize the quiz when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get form data from localStorage
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');

    // Fresh run: clear old phase summaries so the final overview only shows current results.
    if (!isSecondQuizPhase) {
        localStorage.removeItem("quizPhase1Summary");
        localStorage.removeItem("quizPhase2Summary");
        localStorage.removeItem("trainingData");
    }
    
    // Always use the Img folder
    imageFolder = "Img";
    
    // Initialize the image set (5 from R folder, 5 from F folder)
    initializeImageSet();
    
    // Create navigation
    createNavigation();
    
    // Initialize timer
    initializeTimer();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update first question
    updateQuestion();
    // Set phase-specific agent message
    if (isSecondQuizPhase) {
        setQuizAgentMessage('quiz.phase2.agentMessage');
    } else {
        setQuizAgentMessage('quiz.phase1.agentMessage');
    }
    
    // Initialize player data in localStorage if not exists
    initPlayerData(formData);
});

// Highlight required containers function
function highlightRequiredContainers() {
    // Remove any existing highlights
    document.getElementById("answer-container").classList.remove("highlight-required");
    document.getElementById("confidence-container").classList.remove("highlight-required");
    
    const answerSelected = userAnswers[currentQuestionIndex] !== null;
    const confidenceSelected = userConfidence[currentQuestionIndex] !== null;
    
    if (!answerSelected && !confidenceSelected) {
        // Highlight both containers if nothing is selected
        document.getElementById("answer-container").classList.add("highlight-required");
        document.getElementById("confidence-container").classList.add("highlight-required");
        return false;
    } else if (!answerSelected) {
        // Highlight only answer container
        document.getElementById("answer-container").classList.add("highlight-required");
        return false;
    } else if (!confidenceSelected) {
        // Highlight only confidence container
        document.getElementById("confidence-container").classList.add("highlight-required");
        return false;
    }
    
    return true; // Both are selected
}

// Initialize player data in localStorage
function initPlayerData(formData) {
    let playerData = JSON.parse(localStorage.getItem('playerData')) || {
        playerId: localStorage.getItem('playerId') || generatePlayerId(),
        scores: [],
        sessions: [],
        attempts: 0,
        formData: {
            altersgruppe: formData.ageGroup || formData.altersgruppe || formData.age || null,
            playedBefore: (typeof formData.playedBefore === 'boolean') ? formData.playedBefore : null,
            status: formData.status || null
        }
    };
    
    // Store playerId in localStorage if not already set
    if (!localStorage.getItem('playerId')) {
        localStorage.setItem('playerId', playerData.playerId);
    }
    
    localStorage.setItem('playerData', JSON.stringify(playerData));
}

function generatePlayerId() {
    const id = 'player_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    localStorage.setItem('playerId', id);
    return id;
}

function generateSessionId() {
    const id = 'session_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    localStorage.setItem('sessionId', id);
    return id;
}

function getPlayNumber() {
    let playData = localStorage.getItem('playNumberData');
    
    if (!playData) {
        // Initialize if no data exists
        playData = {
            base: 1,
            increment: 0
        };
        localStorage.setItem('playNumberData', JSON.stringify(playData));
    } else {
        playData = JSON.parse(playData);
    }
    
    // Return current play number
    return `${playData.base}.${playData.increment}`;
}

function incrementPlayNumber() {
    let playData = JSON.parse(localStorage.getItem('playNumberData')) || {
        base: 1,
        increment: 0
    };
    
    // Increment the decimal part for "Play Again"
    playData.increment += 1;
    
    localStorage.setItem('playNumberData', JSON.stringify(playData));
}

function resetPlayNumber() {
    let playData = JSON.parse(localStorage.getItem('playNumberData')) || {
        base: 1,
        increment: 0
    };
    
    // Increment the whole number and reset decimal for "Finish"
    playData.base += 0;
    playData.increment = 0;
    
    localStorage.setItem('playNumberData', JSON.stringify(playData));
}

// Initialize the randomized image set with complete shuffling
function initializeImageSet() {
    // Total number of images available in each folder
    const totalImages = 50;
    const targetQuestions = totalQuestions; // 10 questions
    
    // Generate random counts for Real and Fake images (they must sum to 10)
    const numReal = Math.floor(Math.random() * (totalQuestions - 2)) + 2; // 2-8 real images
    const numFake = totalQuestions - numReal; // Remaining are fake
    
    // Create separate arrays for R and F folder images
    const allRImages = Array.from({length: totalImages}, (_, i) => ({
        path: `${imageFolder}/R/${i+1}.jpg`,
        fallbackPath: `${imageFolder}/R/${i+1}.png`,
        answer: "Real"
    }));
    
    const allFImages = Array.from({length: totalImages}, (_, i) => ({
        path: `${imageFolder}/F/${i+1}.jpg`,
        fallbackPath: `${imageFolder}/F/${i+1}.png`,
        answer: "Fake"
    }));
    
    // Shuffle both sets separately
    shuffleArray(allRImages);
    shuffleArray(allFImages);
    
    // Take random counts from each shuffled set
    const selectedR = allRImages.slice(0, numReal);
    const selectedF = allFImages.slice(0, numFake);
    
    // Combine all selected images
    imageSet = [...selectedR, ...selectedF];
    
    // Shuffle the combined set again for final randomness
    shuffleArray(imageSet);
    
    // Create correct answers mapping
    imageSet.forEach((img, index) => {
        correctAnswers[index] = img.answer;
    });
    
    console.log(`Loaded ${numReal} real images and ${numFake} fake images`);
    console.log("Selected images:", imageSet); // For debugging
}

// Fisher-Yates shuffle algorithm for complete randomization
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Navigation Functions
function createNavigation() {
    // Progress bar is initialized in HTML, just update it
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const progressBarFilled = document.getElementById("progress-bar-filled");
    
    // Update progress bar width
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    if (progressBarFilled) {
        progressBarFilled.style.width = progressPercentage + "%";
    }
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    currentConfidence = userConfidence[index]; // Load confidence for this question
    updateQuestion();
    updateNavigationButtons();
}

// Timer Functions
function initializeTimer() {
    const timerElement = document.getElementById("timer");
    
    // Skip if timer element doesn't exist
    if (!timerElement) {
        console.log("Timer element not found, skipping timer");
        return;
    }

    let totalTime = 600;
    function updateTimer() {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        timerElement.textContent = `${t("quiz.timeLeft")}: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (totalTime <= 60) {
            timerElement.style.color = "red";
        }

        if (totalTime <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
        totalTime--;
    }
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Update answer button states
function updateAnswerButtons() {
    const realBtn = document.getElementById("real-btn");
    const fakeBtn = document.getElementById("fake-btn");
    
    // Remove selected class from both buttons
    realBtn.classList.remove("selected");
    fakeBtn.classList.remove("selected");
    
    // Add selected class to the button that matches the current answer
    if (userAnswers[currentQuestionIndex] === "Real") {
        realBtn.classList.add("selected");
    } else if (userAnswers[currentQuestionIndex] === "Fake") {
        fakeBtn.classList.add("selected");
    }
    
    // Remove highlight if answer is selected
    if (userAnswers[currentQuestionIndex] !== null) {
        document.getElementById("answer-container").classList.remove("highlight-required");
    }

    updateSubmitButtonVisibility();
}

function updateSubmitButtonVisibility() {
    const submitBtn = document.getElementById("submit-btn");
    if (!submitBtn) {
        return;
    }

    if (submitBtn.disabled) {
        return;
    }

    submitBtn.classList.toggle("is-visible", userAnswers[currentQuestionIndex] !== null);
}

function setSubmitButtonSendingState(isSending) {
    const submitBtn = document.getElementById("submit-btn");
    if (!submitBtn) {
        return;
    }

    submitBtn.disabled = isSending;
    submitBtn.classList.toggle("is-sending", isSending);
    submitBtn.textContent = isSending ? t("quiz.sendingData") : t("quiz.next");
}

// Question Handling
function updateQuestion() {
    
    // Load and display the current image
    if (imageSet && imageSet.length > 0 && currentQuestionIndex < imageSet.length) {
        const currentImage = imageSet[currentQuestionIndex];
        const quizImage = document.getElementById("quiz-image");

        quizImage.onerror = function () {
            quizImage.onerror = null;
            quizImage.src = currentImage.fallbackPath;
            console.log("PNG not found, loading JPG:", currentImage.fallbackPath);
        };
        quizImage.src = currentImage.path;
        console.log("Loading image:", currentImage.path);
    } else {
        console.error("Image not available for question:", currentQuestionIndex);
    }
    
    // Update answer button states
    updateAnswerButtons();

    // Show Next only after a Real/Fake choice
    updateSubmitButtonVisibility();
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress only if both answer and confidence are selected
    updateProgress();
}

function checkAnswer(isReal) {
    const answer = isReal ? "Real" : "Fake";
    userAnswers[currentQuestionIndex] = answer;
    
    // Update button states and remove highlight
    updateAnswerButtons();
    updateSubmitButtonVisibility();
    document.getElementById("answer-container").classList.remove("highlight-required");
    
    // Update score
    score = 0;
    userAnswers.forEach((ans, index) => {
        if (ans === correctAnswers[index] && userConfidence[index] !== null) {
            score += 10;
        }
    });
    
    
    // Only mark as answered and update progress if confidence is also selected
    if (userConfidence[currentQuestionIndex] !== null) {
        markAnswered(currentQuestionIndex);
        updateProgress();
    }
    
    // Navigation to the next question happens only via the Next button.
}

function setConfidence(confidence) {
    currentConfidence = confidence;
    userConfidence[currentQuestionIndex] = confidence;
    
    // Update score
    score = 0;
    userAnswers.forEach((ans, index) => {
        if (ans === correctAnswers[index] && userConfidence[index] !== null) {
            score += 10;
        }
    });

    
    // Only mark as answered and update progress if answer is also selected
    if (userAnswers[currentQuestionIndex] !== null) {
        markAnswered(currentQuestionIndex);
        updateProgress();
    }
    
    // Navigation to the next question happens only via the Next button.
}

function goToNextQuestion() {
    // First check if we have both answer and confidence
    if (!highlightRequiredContainers()) {
        // If highlighting was applied (meaning selections are missing), don't proceed
        return;
    }
    
    let nextIndex = findNextUnanswered(currentQuestionIndex);
    
    if (nextIndex !== -1) {
        currentQuestionIndex = nextIndex;
        currentConfidence = userConfidence[nextIndex];
        updateQuestion();
        updateNavigationButtons();
    } else {
        handleQuizPhaseCompletion();
    }
}

function handleQuizPhaseCompletion() {
    saveCurrentQuizPhaseSummary();

    if (isSecondQuizPhase) {
        localStorage.removeItem("quizRunPhase");
        endQuiz("phase-summary.html");
        return;
    }
    // Save the full performance of phase 1 so it can be sent together with phase 2 later
    saveCurrentQuizPerformance('quizPhase1Performance');

    window.location.href = "training1.html";
}

// Save the detailed quiz performance (answers, confidence, imageSet) to localStorage
function saveCurrentQuizPerformance(storageKey) {
    const quizEndTime = Date.now();
    const timeTaken = Math.floor((quizEndTime - quizStartTime) / 1000);

    const answersReport = {};
    imageSet.forEach((img, index) => {
        answersReport[index] = {
            imagePath: img.path,
            answer: userAnswers[index],
            confidence: userConfidence[index],
            correct: userAnswers[index] === correctAnswers[index] && userConfidence[index] !== null
        };
    });

    const formData = JSON.parse(localStorage.getItem('formData') || '{}');

    const perf = {
        timestamp: new Date().toISOString(),
        altersgruppe: formData.ageGroup || formData.altersgruppe || formData.age || "unknown",
        playedBefore: (typeof formData.playedBefore === 'boolean') ? formData.playedBefore : String(formData.playedBefore).toLowerCase() === 'true',
        status: formData.status || "unknown",
        score: score,
        answers: answersReport,
        timeTaken: timeTaken,
        sessionId: sessionId,
        playNumber: playNumber,
        imageSet: imageSet,
        playerId: formData.playerId || generatePlayerId()
    };

    try {
        localStorage.setItem(storageKey, JSON.stringify(perf));
    } catch (e) {
        console.error('Failed to save phase performance:', e);
    }
}

function saveCurrentQuizPhaseSummary() {
    let answeredCount = 0;
    let correctCount = 0;

    for (let i = 0; i < totalQuestions; i++) {
        const isAnswered = userAnswers[i] !== null && userConfidence[i] !== null;
        if (isAnswered) {
            answeredCount += 1;
            if (userAnswers[i] === correctAnswers[i]) {
                correctCount += 1;
            }
        }
    }

    const phaseSummary = {
        timestamp: new Date().toISOString(),
        phase: isSecondQuizPhase ? 2 : 1,
        answered: answeredCount,
        total: totalQuestions,
        correct: correctCount,
        percent: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0,
        score: score
    };

    localStorage.setItem(
        isSecondQuizPhase ? "quizPhase2Summary" : "quizPhase1Summary",
        JSON.stringify(phaseSummary)
    );
}

function findNextUnanswered(current) {
    for (let i = current + 1; i < totalQuestions; i++) {
        if (userAnswers[i] === null || userConfidence[i] === null) return i;
    }
    for (let i = 0; i < current; i++) {
        if (userAnswers[i] === null || userConfidence[i] === null) return i;
    }
    return -1;
}

function markAnswered(index) {
    // Update navigation buttons if we had them
    // With arrow buttons, we don't need visual feedback for individual questions
}

function updateProgress() {
    let answeredCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
        if (userAnswers[i] !== null && userConfidence[i] !== null) {
            answeredCount++;
        }
    }
    
    const progress = (answeredCount / totalQuestions) * 100;
    
    // Only update if elements exist
    const progressBar = document.getElementById("progress-bar-filled");
    if (progressBar) {
        progressBar.style.width = progress + "%";
        progressBar.textContent = Math.round(progress) + "%";
    }
}

function submitFinalAnswers() {
    // Calculate final score
    score = 0;
    imageSet.forEach((img, index) => {
        if (userAnswers[index] === correctAnswers[index] && userConfidence[index] !== null) {
            score += 10;
        }
    });
    
    // End the quiz
    endQuiz();
}

// End Quiz Functions
async function endQuiz(nextPageUrl = null) {
    clearInterval(timerInterval);
    const quizEndTime = Date.now();
    const timeTaken = Math.floor((quizEndTime - quizStartTime) / 1000);
    
    // Prepare the answers for reporting
    const answersReport = {};
    imageSet.forEach((img, index) => {
        answersReport[index] = {
            imagePath: img.path,
            answer: userAnswers[index],
            confidence: userConfidence[index],
            correct: userAnswers[index] === correctAnswers[index] && userConfidence[index] !== null
        };
    });

    // Get form data from localStorage
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');

    const quizData = {
        timestamp: new Date().toISOString(),
        altersgruppe: formData.ageGroup || formData.altersgruppe || formData.age || "unknown",
        playedBefore: (typeof formData.playedBefore === 'boolean') ? formData.playedBefore : String(formData.playedBefore).toLowerCase() === 'true',
        status: formData.status || "unknown",
        score: score,
        answers: answersReport,
        timeTaken: timeTaken,
        sessionId: sessionId,
        playNumber: playNumber,
        imageSet: imageSet,
        playerId: formData.playerId || generatePlayerId()
    };

    // Store quiz data in localStorage
    storeQuizData(quizData);
    setSubmitButtonSendingState(true);
    
    // If a saved phase1 performance exists, combine it with current data into one payload
    try {
        const storedPhase1 = localStorage.getItem('quizPhase1Performance');
        if (storedPhase1) {
            const phase1Data = JSON.parse(storedPhase1);

            // Build combined payload
            const combined = {};

            // Basic metadata: use earliest timestamp as timestamp, keep session/player ids
            combined.timestamp = phase1Data.timestamp || quizData.timestamp;
            combined.sessionId = quizData.sessionId || phase1Data.sessionId;
            combined.playerId = quizData.playerId || phase1Data.playerId;
            combined.altersgruppe = phase1Data.altersgruppe || quizData.altersgruppe || phase1Data.ageGroup || quizData.ageGroup || phase1Data.age || quizData.age || 'unknown';
            // Combine playNumber (store as phase1|phase2)
            combined.playNumber = (phase1Data.playNumber || '') + '|' + (quizData.playNumber || '');
            // Prefer playedBefore from phase1 if present
            combined.playedBefore = (phase1Data.playedBefore !== undefined) ? phase1Data.playedBefore : quizData.playedBefore;
            combined.status = quizData.status || phase1Data.status || 'unknown';
            // Sum scores and timeTaken
            combined.score = (Number(phase1Data.score) || 0) + (Number(quizData.score) || 0);
            combined.timeTaken = (Number(phase1Data.timeTaken) || 0) + (Number(quizData.timeTaken) || 0);

            // Combine imageSet arrays
            const imgs1 = Array.isArray(phase1Data.imageSet) ? phase1Data.imageSet : [];
            const imgs2 = Array.isArray(quizData.imageSet) ? quizData.imageSet : [];
            combined.imageSet = imgs1.concat(imgs2);

            // Combine answers: keys are numeric indices in both objects
            const answersCombined = {};
            const a1 = phase1Data.answers || {};
            const a2 = quizData.answers || {};
            let idx = 0;
            // push phase1 answers in order
            for (let i = 0; i < imgs1.length; i++) {
                answersCombined[idx] = a1[i] || { imagePath: imgs1[i] ? imgs1[i].path : '', answer: null, confidence: null, correct: false };
                idx++;
            }
            // then phase2 answers
            for (let i = 0; i < imgs2.length; i++) {
                answersCombined[idx] = a2[i] || { imagePath: imgs2[i] ? imgs2[i].path : '', answer: null, confidence: null, correct: false };
                idx++;
            }
            combined.answers = answersCombined;

            // Add per-phase breakdown for server-side processing / analytics
            combined.phase1 = {
                score: Number(phase1Data.score) || 0,
                timeTaken: Number(phase1Data.timeTaken) || 0,
                playNumber: phase1Data.playNumber || '',
                answers: phase1Data.answers || {}
            };

            combined.phase2 = {
                score: Number(quizData.score) || 0,
                timeTaken: Number(quizData.timeTaken) || 0,
                playNumber: quizData.playNumber || '',
                answers: quizData.answers || {}
            };

            // Remove stored phase1 now that we're combining
            localStorage.removeItem('quizPhase1Performance');

            // Send combined payload (await and retry once on failure)
            try {
                await sendDataToGoogleSheets(combined);
            } catch (err) {
                console.error('Send failed, retrying once...', err);
                await new Promise(r => setTimeout(r, 1000));
                try {
                    await sendDataToGoogleSheets(combined);
                } catch (err2) {
                    console.error('Retry failed:', err2);
                    alert('Fehler beim Senden der Daten. Die Sitzung wird dennoch beendet.');
                }
            }
        } else {
            // No saved phase1 – send current data only (await and retry once on failure)
            try {
                await sendDataToGoogleSheets(quizData);
            } catch (err) {
                console.error('Send failed, retrying once...', err);
                await new Promise(r => setTimeout(r, 1000));
                try {
                    await sendDataToGoogleSheets(quizData);
                } catch (err2) {
                    console.error('Retry failed:', err2);
                    alert('Fehler beim Senden der Daten. Die Sitzung wird dennoch beendet.');
                }
            }
        }
    } catch (e) {
        console.error('Error combining/sending phase performances:', e);
        // Fallback: send current data alone
        try {
            await sendDataToGoogleSheets(quizData);
        } catch (err) {
            console.error('Fallback send failed:', err);
            alert('Fehler beim Senden der Daten. Die Sitzung wird dennoch beendet.');
        }
    }

    window.location.href = "phase-summary.html";
}

// Store quiz data in localStorage
function storeQuizData(quizData) {
    // Get existing player data
    let playerData = JSON.parse(localStorage.getItem('playerData')) || {
        playerId: quizData.playerId,
        scores: [],
        sessions: [],
        attempts: 0,
        formData: {
            altersgruppe: quizData.altersgruppe,
            playedBefore: quizData.playedBefore,
            status: quizData.status
        }
    };
    
    // Update player data with new quiz results
    playerData.scores.push(quizData.score);
    playerData.sessions.push({
        sessionId: quizData.sessionId,
        timestamp: quizData.timestamp,
        score: quizData.score,
        timeTaken: quizData.timeTaken
    });
    playerData.attempts = (playerData.attempts || 0) + 1;
    
    // Save updated player data
    localStorage.setItem('playerData', JSON.stringify(playerData));
    
    // Also store the complete quiz data separately
    localStorage.setItem('quizPerformance', JSON.stringify(quizData));
}

async function sendDataToGoogleSheets(quizData) {
    if (!GOOGLE_SCRIPT_WEBAPP_URL || GOOGLE_SCRIPT_WEBAPP_URL.includes("PASTE_DEPLOYMENT_ID_HERE") || GOOGLE_SCRIPT_WEBAPP_URL.includes("/edit")) {
        const msg = "Google Sheets endpoint is not configured correctly. Paste the deployed Web-App /exec URL into GOOGLE_SCRIPT_WEBAPP_URL.";
        console.error(msg);
        throw new Error(msg);
    }

    // Prepare the data for submission
    const formData = new URLSearchParams();

    // Add basic info
    formData.append('timestamp', quizData.timestamp);
    formData.append('sessionId', quizData.sessionId);
    formData.append('playNumber', quizData.playNumber);
    formData.append('altersgruppe', quizData.altersgruppe);
    formData.append('ageGroup', quizData.altersgruppe);
    formData.append('age', quizData.altersgruppe);
    formData.append('playedBefore', String(quizData.playedBefore));
    formData.append('status', quizData.status);
    formData.append('score', String(quizData.score));
    formData.append('timeTaken', String(quizData.timeTaken));
    formData.append('playerId', quizData.playerId);

    // If per-phase breakdown exists, include it
    if (quizData.phase1) {
        formData.append('phase1_score', String(quizData.phase1.score));
        formData.append('phase1_timeTaken', String(quizData.phase1.timeTaken));
        formData.append('phase1_playNumber', String(quizData.phase1.playNumber || ''));
        try { formData.append('phase1_answers', JSON.stringify(quizData.phase1.answers || {})); } catch(e) { /* ignore */ }
    }
    if (quizData.phase2) {
        formData.append('phase2_score', String(quizData.phase2.score));
        formData.append('phase2_timeTaken', String(quizData.phase2.timeTaken));
        formData.append('phase2_playNumber', String(quizData.phase2.playNumber || ''));
        try { formData.append('phase2_answers', JSON.stringify(quizData.phase2.answers || {})); } catch(e) { /* ignore */ }
    }

    // Add answers and confidence levels based on the provided quizData
    const numQuestions = Array.isArray(quizData.imageSet) ? quizData.imageSet.length : 0;
    for (let i = 0; i < numQuestions; i++) {
        const img = quizData.imageSet[i] || {};
        const ansObj = (quizData.answers && quizData.answers[i]) ? quizData.answers[i] : {};
        const answerVal = ansObj.answer || '';
        const confidenceVal = (ansObj.confidence === null || ansObj.confidence === undefined) ? '' : String(ansObj.confidence);
        const correctVal = ansObj.correct ? '1' : '0';

        formData.append(`q${i+1}_image`, img.path || '');
        formData.append(`q${i+1}_answer`, answerVal);
        formData.append(`q${i+1}_confidence`, confidenceVal);
        formData.append(`q${i+1}_correct`, correctVal);
    }

    // Send data to Google Sheets
    console.log("Sending quiz data to Google Sheets:", GOOGLE_SCRIPT_WEBAPP_URL);
    const response = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
        method: 'POST',
        keepalive: true,
        body: formData
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error('Network response was not ok', response.status, text);
        throw new Error('Network response was not ok');
    }

    const text = await response.text();
    console.log('Google Sheets response:', text);
    try {
        return JSON.parse(text);
    } catch (parseError) {
        return text;
    }
}

function getStarRating() {
    return score >= 80 ? "⭐️⭐️⭐️" : score >= 50 ? "⭐️⭐️☆" : "⭐️☆☆";
}

// Utility Functions
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

function setGradientBackground() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const gradient = `linear-gradient(to bottom, ${colors[randomIndex][0]}, ${colors[randomIndex][1]})`;
    document.body.style.background = gradient;
}

function setupEventListeners() {
    document.getElementById("real-btn").addEventListener("click", () => checkAnswer(true));
    document.getElementById("fake-btn").addEventListener("click", () => checkAnswer(false));
    
    // Slider event listener
    const confidenceSlider = document.getElementById("confidence-slider");
    confidenceSlider.addEventListener("input", function() {
        const sliderValue = parseInt(this.value);
        // Invert the display (0 on right, 100 on left)
        const displayValue = 100 - sliderValue;
        
        // Only update display element if it exists
        const displayElement = document.getElementById("slider-value-display");
        if (displayElement) {
            displayElement.textContent = `${t("quiz.confidenceLabel")}: ${displayValue}%`;
        }
        
        // Save confidence as numeric value from 0.00 to 1.00.
        const normalizedConfidence = Number((displayValue / 100).toFixed(2));
        setConfidence(normalizedConfidence);
    });
    
    // Only add review button listener if element exists
    const reviewBtn = document.getElementById("review-btn");
    if (reviewBtn) {
        reviewBtn.addEventListener("click", showReviewScreen);
    }
    
    document.getElementById("submit-btn").addEventListener("click", goToNextQuestion);
    
}

function playAgain() {
    incrementPlayNumber();
    let attempt = parseInt(localStorage.getItem("attempt") || "1", 10);
    attempt++;
    localStorage.setItem("attempt", attempt);
    window.location.reload();
}

function finishGame() {

    resetPlayNumber()
    window.location.href = "photo-learning.html";
}