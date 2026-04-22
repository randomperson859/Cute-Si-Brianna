(function () {
    const MUSIC_FILE = "bgmusic.mp3";
    const AUDIO_TIME_KEY = "backgroundMusicTime";
    const AUDIO_PLAYING_KEY = "backgroundMusicShouldPlay";

    function savePlaybackTime(audio) {
        localStorage.setItem(AUDIO_TIME_KEY, audio.currentTime.toString());
    }

    function createAudio() {
        const existingAudio = document.getElementById("backgroundMusic");

        if (existingAudio) {
            return existingAudio;
        }

        const audio = document.createElement("audio");
        audio.id = "backgroundMusic";
        audio.src = MUSIC_FILE;
        audio.loop = true;
        audio.autoplay = true;
        audio.preload = "auto";
        audio.style.display = "none";
        document.body.appendChild(audio);
        return audio;
    }

    function restorePlayback(audio) {
        const savedTime = Number(localStorage.getItem(AUDIO_TIME_KEY));

        if (!Number.isNaN(savedTime) && savedTime > 0) {
            audio.currentTime = savedTime;
        }
    }

    function tryPlay(audio) {
        const playState = localStorage.getItem(AUDIO_PLAYING_KEY);

        if (playState === "false") {
            return;
        }

        const playPromise = audio.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                const startOnInteraction = function () {
                    audio.play();
                    localStorage.setItem(AUDIO_PLAYING_KEY, "true");
                };

                document.addEventListener("click", startOnInteraction, { once: true });
                document.addEventListener("keydown", startOnInteraction, { once: true });
            });
        } else {
            localStorage.setItem(AUDIO_PLAYING_KEY, "true");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        const audio = createAudio();
        restorePlayback(audio);
        tryPlay(audio);

        audio.addEventListener("timeupdate", function () {
            savePlaybackTime(audio);
        });

        audio.addEventListener("play", function () {
            localStorage.setItem(AUDIO_PLAYING_KEY, "true");
        });

        audio.addEventListener("pause", function () {
            savePlaybackTime(audio);
            localStorage.setItem(AUDIO_PLAYING_KEY, "false");
        });

        window.addEventListener("beforeunload", function () {
            savePlaybackTime(audio);
        });
    });
})();