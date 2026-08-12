document.addEventListener("DOMContentLoaded", function() {
    // Form elements
    const submitBtnShort = document.getElementById("submit-btn-short");
    const submitBtnLong = document.getElementById("submit-btn-long");
    const ageInput = document.getElementById("age");
    const ageButtons = document.querySelectorAll(".age-btn");
    const playedBeforeCheckbox = document.getElementById("played-before");

    // Developer-controlled settings
    const FIXED_PLAYER_ID_PREFIX = 1000;  // Change this prefix as needed
    let playerCounter = localStorage.getItem('playerCounter') || 1;  // Load counter or start at 1

    // Add click listeners to age buttons
    ageButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            
            // Remove active class from all buttons
            ageButtons.forEach(btn => btn.classList.remove("active"));
            
            // Add active class to clicked button
            this.classList.add("active");
            
            // Set the hidden age input value
            ageInput.value = this.getAttribute("data-age");
        });
    });

    // Function to handle form submission
    function handleSubmit(gameType) {
        // Form validation
        let isValid = true;

        // Reset error styles on all age buttons
        ageButtons.forEach(btn => {
            btn.style.borderColor = "";
            btn.style.boxShadow = "";
        });

        // Validate age selection
        if (ageInput.value === "") {
            ageButtons.forEach(btn => {
                btn.style.borderColor = "red";
                btn.style.boxShadow = "0 0 10px rgba(255, 0, 0, 0.5)";
            });
            isValid = false;
        }

        // If form is valid, process submission
        if (isValid) {
            localStorage.setItem("quizRunPhase", "phase1");
            localStorage.removeItem("quizPhase1Summary");
            localStorage.removeItem("quizPhase2Summary");
            localStorage.removeItem("trainingData");

            // Generate sequential player ID
            const playerId = FIXED_PLAYER_ID_PREFIX + parseInt(playerCounter);
            
            // Prepare form data object
            const formData = {
                ageGroup: ageInput.value,
                playedBefore: playedBeforeCheckbox.checked,
                gameType: gameType,
                playerId: playerId,
                registrationDate: new Date().toLocaleString()
            };

            // Store data in localStorage
            localStorage.setItem('formData', JSON.stringify(formData));
            
            // Increment and save the counter for next use
            playerCounter++;
            localStorage.setItem('playerCounter', playerCounter);

            // Disable buttons to prevent multiple submissions
            submitBtnShort.disabled = true;
            submitBtnLong.disabled = true;
            
            // Redirect to quiz page
            window.location.href = "quiz.html";
        }
    }

    submitBtnShort.addEventListener("click", function(event) {
        event.preventDefault();
        handleSubmit("short");
    });

    submitBtnLong.addEventListener("click", function(event) {
        event.preventDefault();
        handleSubmit("long");
    });

    // Developer control function (call this in console if needed)
    window.resetPlayerCounter = function(newStart = 1) {
        playerCounter = newStart;
        localStorage.setItem('playerCounter', playerCounter);
        console.log(`Player counter reset to: ${playerCounter}`);
    };
});
