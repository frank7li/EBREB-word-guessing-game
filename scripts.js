document.addEventListener("DOMContentLoaded", () => {
    const scrambledWordElement = document.getElementById("scrambled-word");
    const scrambledWordElement2 = document.getElementById("scrambled-word2");
    const userWordElement = document.getElementById("user-word");
    const correctWordElement = document.getElementById("correct-word");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");
    const correctGuessesElement = document.getElementById("correct-guesses");
    const userGuessesElement = document.getElementById("user-guesses");
    const correctGuessRateElement = document.getElementById("correct-guess-rate");
    const startButton = document.getElementById("start-button");
    const startButtonContainer = document.getElementById("start-button-container");
    const playAgainButton = document.getElementById("play-again-button");
    const gameContainer = document.getElementById("game-container");
    const gameResultContainer = document.getElementById("game-result-container");
    const correctResultContainer = document.getElementById("correct-result-container");
    const incorrectResultContainer = document.getElementById("incorrect-result-container");
    const resetButton = document.getElementById("reset-button");
    const hintButton = document.getElementById("hint-button");
    const hintWordElement = document.getElementById("hint-word");
    const hintResultContainer = document.getElementById("hint-result-container");
    const hintButtonContainer = document.getElementById("hint-button-container");
    const statisticsContainer = document.getElementById("statistics-container");
    const remainingLettersElement = document.getElementById("remaining-letters");

    // Start the game, hide the start button and start page, initialize the random and scrambled word
    startButton.addEventListener("click", async () => {
        startButtonContainer.style.display = "none";
        gameContainer.style.display = "block";
        await getRandomWord();
        await getScrambledWord();
        await getCurrentWord();
    });

    // Submit the user guess and calls the checkGuess function to prompts the server to check if it's correct
    guessButton.addEventListener("click", () => {
        const guess = guessInput.value.trim();
        if (guess) {
            checkGuess(guess);
            guessInput.value = "";
        }
    });

    // Show the first half of the letters in the correct word and the unused letters
    hintButton.addEventListener("click", async () => {
        const response = await fetch("http://localhost:3000/api/current-word");
        const data = await response.json();
        const word = data.word;
        hint_word = word.substring(0, word.length / 2);
        const response2 = await fetch("http://localhost:3000/api/scrambled-word");
        const data2 = await response2.json();
        const scrambled_word = data2.word;
        let remaining_letters = scrambled_word;
        let letters_to_remove = hint_word;
        while (letters_to_remove != ""){
            const char = letters_to_remove.charAt(0);
            for (let i = 0; i<remaining_letters.length; i++){
                if (remaining_letters[i] == char){
                    const leftPart = remaining_letters.slice(0, i);
                    const rightPart = remaining_letters.slice(i + 1);
                    remaining_letters = leftPart + rightPart;
                    letters_to_remove = letters_to_remove.slice(1);
                    break
                }
            }
        }
        hintWordElement.textContent = hint_word;
        remainingLettersElement.textContent = remaining_letters;
        hintButtonContainer.style.display = "none";
        hintResultContainer.style.display = "block";
    });

    // Hide the guess result container and bring up gameplay containers, initalize new words
    playAgainButton.addEventListener("click", async () => {
        await getRandomWord();
        await getScrambledWord();
        await getCurrentWord();
        update_scores();
        gameContainer.style.display = "block";
        gameResultContainer.style.display = "none";
        playAgainButton.style.display = "none";
        hintButtonContainer.style.display = "block";
        hintResultContainer.style.display = "none";
        statisticsContainer.style.display = "block";
    });

    // Reset the statistics and hide the container
    resetButton.addEventListener("click", async () => {
        const response = await fetch("http://localhost:3000/api/reset");
        update_scores();
        statisticsContainer.style.display = "none";
    });

    // Call the server to get a new random word and scramble it
    async function getRandomWord(){
        const response = await fetch("http://localhost:3000/api/random-word");
    }

    // Retrieve the scrambled word from the server and update the frontend
    async function getScrambledWord(){
        const response = await fetch("http://localhost:3000/api/scrambled-word");
        const data = await response.json();
        const scrambled_word = data.word;
        scrambledWordElement.textContent = scrambled_word;
        scrambledWordElement2.textContent = scrambled_word;
    }

    // Retrieve the original word from the server and update the frontend
    async function getCurrentWord(){
        const response = await fetch("http://localhost:3000/api/current-word");
        const data = await response.json();
        const current_word = data.word;
        correctWordElement.textContent = current_word;
    }

    // Check the guess against the current word
    async function checkGuess(guess) {
        const response = await fetch("http://localhost:3000/api/check-guess", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ guess })
        })
        userWordElement.textContent = guess;
        const data = await response.json();
        const is_correct = data.message;
        gameContainer.style.display = "none";
        gameResultContainer.style.display = "block";
        if (is_correct == 'correct'){
            correctResultContainer.style.display = "block";
            incorrectResultContainer.style.display = "none";
        }else{
            incorrectResultContainer.style.display = "block";
            correctResultContainer.style.display = "none";
        }
        playAgainButton.style.display = "block";

    }

    // Update the history and success score
    function update_scores(){
        fetch("http://localhost:3000/api/correct-guesses")
                .then(response => response.json())
                .then(data => correctGuessesElement.textContent = data.join(", "))
                .catch(error => console.error("Error fetching correct guesses:", error));

        fetch("http://localhost:3000/api/user-guesses")
                .then(response => response.json())
                .then(data => userGuessesElement.textContent = data.join(", "))
                .catch(error => console.error("Error fetching user guesses:", error));

        fetch("http://localhost:3000/api/success-rate")
                .then(response => response.json())
                .then(data => correctGuessRateElement.textContent = data.num)
                .catch(error => console.error("Error fetching user guesses:", error));
    }
});

