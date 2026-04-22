const CATEGORY_STATE_KEYS = [
    "fruitsFoundWords",
    "countriesFoundWords",
    "carbrandsFoundWords",
    "fruitsStartTime",
    "countriesStartTime",
    "carbrandsStartTime",
    "fruitsCompleted",
    "countriesCompleted",
    "carbrandsCompleted",
    "fruitsLeaderboardSaved",
    "countriesLeaderboardSaved",
    "carbrandsLeaderboardSaved"
];

function clearCategoryProgress() {
    for (let i = 0; i < CATEGORY_STATE_KEYS.length; i++) {
        localStorage.removeItem(CATEGORY_STATE_KEYS[i]);
    }
}

function resetGame() {
    localStorage.removeItem("username");
    clearCategoryProgress();
    window.location.reload();
}

function showLoggedInState(username) {
    const welcome = document.getElementById("welcome");
    const usernameForm = document.getElementById("usernameForm");
    const categoryButtons = document.getElementById("categoryButtons");

    if (welcome) {
        welcome.textContent = "Welcome, " + username + "!";
    }

    if (usernameForm) {
        usernameForm.style.display = "none";
    }

    if (categoryButtons) {
        categoryButtons.classList.remove("hidden");
    }
}

function validateForm() {
    const usernameInput = document.getElementById("username");

    if (!usernameInput) {
        return false;
    }

    const username = usernameInput.value.trim();

    if (username === "") {
        return false;
    }

    localStorage.setItem("username", username);
    clearCategoryProgress();
    showLoggedInState(username);

    return false;
}

function restoreLoginState() {
    const savedUsername = localStorage.getItem("username");

    if (savedUsername) {
        showLoggedInState(savedUsername);
    }
}

document.addEventListener("DOMContentLoaded", restoreLoginState);