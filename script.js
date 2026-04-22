const tutorialWords = ["CAT"];

const categoryWords = {
    fruits: ["APPLE", "GRAPE", "LEMON", "LIME", "CHERRY", "CAPRICOT", "PEAR", "FRUITS", "ORANGE", "MELON", "KIWI"],
    countries: ["CANADA", "ITALY", "LIBYA", "EGYPT", "BRAZIL", "MEXICO", "ALGERIA"],
    carbrands: ["AUDI", "FORD", "HONDA", "TOYOTA", "TESLA"]
};

const wordPositions = {
    fruits: {
        APPLE: [[2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
        GRAPE: [[1, 4], [2, 4], [3, 4], [4, 4], [5, 4]],
        LEMON: [[6, 1], [6, 2], [6, 3], [6, 4], [6, 5]],
        LIME: [[0, 3], [0, 4], [0, 5], [0, 6]],
        CHERRY: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
        CAPRICOT: [[0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]],
        PEAR: [[1, 6], [2, 6], [3, 6], [4, 6]],
        FRUITS: [[2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
        ORANGE: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2]],
        MELON: [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5]],
        KIWI: [[0, 1], [1, 1], [2, 1], [3, 1]]
    },
    countries: {
        CANADA: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
        ITALY: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
        LIBYA: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
        EGYPT: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]],
        BRAZIL: [[5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7]],
        MEXICO: [[6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6]],
        ALGERIA: [[8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]]
    },
    carbrands: {
        AUDI: [[0, 2], [0, 3], [0, 4], [0, 5]],
        FORD: [[3, 1], [2, 1], [1, 1], [0, 1]],
        HONDA: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4]],
        TOYOTA: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5]],
        TESLA: [[4, 4], [5, 5], [6, 6], [7, 7], [8, 8]]
    }
};

let timerInterval = null;

function highlightTutorialWord(word) {
    if (word !== "CAT") {
        return;
    }

    const tutorialLetters = document.querySelectorAll("[tutorialletter]");

    for (let i = 0; i < tutorialLetters.length; i++) {
        tutorialLetters[i].classList.add("found-letter");
    }
}

function safeReadArray(key) {
    try {
        const savedValue = localStorage.getItem(key);
        const parsedValue = savedValue ? JSON.parse(savedValue) : [];
        return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
        return [];
    }
}

function setResultMessage(message, color) {
    const result = document.getElementById("result");

    if (!result) {
        return;
    }

    result.textContent = message;
    result.style.color = color;
}

function checkWordTutorialMode() {
    const inputElement = document.getElementById("userWord");

    if (!inputElement) {
        return;
    }

    const input = inputElement.value.toUpperCase().trim();

    if (tutorialWords.includes(input)) {
        highlightTutorialWord(input);
        setResultMessage("Correct! You found " + input + ".", "green");
    } else {
        setResultMessage("Not in the puzzle. Try again!", "red");
    }

    inputElement.value = "";
}

function setupCategoryPage() {
    const category = document.body.dataset.category;

    if (!category || !categoryWords[category]) {
        return;
    }

    startCategoryTimer(category);
    displayProgress(category);
    displayTimer();
    displayCategoryLeaderboard(category);
    applySavedHighlights(category);
    enableEnterToSubmit(category);

    if (isCategoryComplete(category)) {
        stopCategoryTimer();
        showFinishedMessage(category);
    }
}

function startCategoryTimer(category) {
    const timerKey = category + "StartTime";
    const savedStartTime = localStorage.getItem(timerKey);

    if (!savedStartTime) {
        localStorage.setItem(timerKey, Date.now().toString());
    }

    if (!timerInterval) {
        timerInterval = setInterval(displayTimer, 1000);
    }
}

function displayTimer() {
    const timer = document.getElementById("timer");
    const category = document.body.dataset.category;

    if (!timer || !category) {
        return;
    }

    const startTime = Number(localStorage.getItem(category + "StartTime"));

    if (!startTime) {
        return;
    }

    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timer.textContent = "Timer: " + seconds + " seconds";
}

function stopCategoryTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function getFoundWords(category) {
    return safeReadArray(category + "FoundWords");
}

function saveFoundWords(category, words) {
    localStorage.setItem(category + "FoundWords", JSON.stringify(words));
}

function displayProgress(category) {
    const progress = document.getElementById("progress");

    if (!progress) {
        return;
    }

    const foundWords = getFoundWords(category);
    progress.textContent = "Found " + foundWords.length + " of " + categoryWords[category].length + " words";
}

function checkCategoryWord(category) {
    const inputElement = document.getElementById("userWord");

    if (!inputElement) {
        return;
    }

    const input = inputElement.value.toUpperCase().trim();
    const validWords = categoryWords[category];
    const foundWords = getFoundWords(category);

    if (!input) {
        setResultMessage("Please type a word first.", "red");
        return;
    }

    if (validWords.includes(input) && !foundWords.includes(input)) {
        foundWords.push(input);
        saveFoundWords(category, foundWords);
        highlightWord(category, input);
        setResultMessage("Correct! You found " + input + ".", "green");
    } else if (foundWords.includes(input)) {
        setResultMessage(input + " was already found.", "orange");
    } else {
        setResultMessage("Not in the puzzle. Try again!", "red");
    }

    inputElement.value = "";
    displayProgress(category);
    checkCategoryFinished(category);
}

function checkCategoryFinished(category) {
    const foundWords = getFoundWords(category);

    if (foundWords.length === categoryWords[category].length) {
        localStorage.setItem(category + "Completed", "true");
        stopCategoryTimer();
        finishCategory(category);
    }
}

function isCategoryComplete(category) {
    return localStorage.getItem(category + "Completed") === "true";
}

function finishCategory(category) {
    const username = localStorage.getItem("username") || "Player";
    const startTime = Number(localStorage.getItem(category + "StartTime"));
    const finishTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    const leaderboardKey = category + "Leaderboard";
    const leaderboardSavedKey = category + "LeaderboardSaved";
    const leaderboard = safeReadArray(leaderboardKey);

    if (localStorage.getItem(leaderboardSavedKey) === "true") {
        showFinishedMessage(category);
        return;
    }

    leaderboard.push({
        username: username,
        time: finishTime
    });

    leaderboard.sort(function (a, b) {
        return a.time - b.time;
    });

    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
    localStorage.setItem(leaderboardSavedKey, "true");

    displayCategoryLeaderboard(category);
    showFinishedMessage(category);
}

function showFinishedMessage(category) {
    const username = localStorage.getItem("username") || "Player";
    const startTime = Number(localStorage.getItem(category + "StartTime"));
    const finishTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    setResultMessage(
        "Congratulations, " + username + "! You finished the " + category + " category in " + finishTime + " seconds.",
        "purple"
    );
}

function displayCategoryLeaderboard(category) {
    const leaderboard = safeReadArray(category + "Leaderboard");
    const list = document.getElementById("leaderboard");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    for (let i = 0; i < leaderboard.length && i < 10; i++) {
        const item = document.createElement("li");
        item.textContent = leaderboard[i].username + " - " + leaderboard[i].time + " seconds";
        list.appendChild(item);
    }
}

function highlightWord(category, word) {
    const positions = wordPositions[category] && wordPositions[category][word];

    if (!positions) {
        return;
    }

    const rows = document.querySelectorAll("table tr");

    for (let i = 0; i < positions.length; i++) {
        const rowIndex = positions[i][0];
        const cellIndex = positions[i][1];
        const row = rows[rowIndex];

        if (!row) {
            continue;
        }

        const cell = row.children[cellIndex];

        if (cell) {
            cell.classList.add("found-letter");
        }
    }
}

function applySavedHighlights(category) {
    const foundWords = getFoundWords(category);

    for (let i = 0; i < foundWords.length; i++) {
        highlightWord(category, foundWords[i]);
    }
}

function enableEnterToSubmit(category) {
    const inputElement = document.getElementById("userWord");

    if (!inputElement) {
        return;
    }

    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            checkCategoryWord(category);
        }
    });
}

function checkWordFruits() {
    checkCategoryWord("fruits");
}

function checkWordCountries() {
    checkCategoryWord("countries");
}

function checkWordCarBrands() {
    checkCategoryWord("carbrands");
}

document.addEventListener("DOMContentLoaded", setupCategoryPage);