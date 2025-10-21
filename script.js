// @ts-nocheck

const $ = document.querySelector.bind(document);

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(err => {
            // console.log('Service Worker registration failed: ' + err.toString());
            console.log('Service Worker registration failed:', err);
        });
} else {
    // alert('Service Workers are not supported in this browser.');
    console.log('Service Workers are not supported in this browser.');
}

// We use this to show the full screen modal only once and then we show small button only.
// TODO: we can store this in localStorage to remember user choice across sessions.
let isFirstEventFire_beforeinstallprompt = true;

// Prompt for installation
let installPromptRef = { current: null };
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent Chrome from showing the default prompt
    installPromptRef.current = e;
    if (isFirstEventFire_beforeinstallprompt) {
        isFirstEventFire_beforeinstallprompt = false;
        $("#modal").removeAttribute("hidden");
    }
});

$('#install-btn-1').addEventListener('click', handleInstall);
$('#install-btn-2').addEventListener('click', handleInstall);
$('#maybe-later-btn').addEventListener('click', () => {
    $("#modal").setAttribute("hidden", true);
    $("#install-btn-2").removeAttribute("hidden");
});

async function handleInstall() {
    const installPrompt = installPromptRef.current;
    if (!installPrompt) {
        // alert("Install prompt not available");
        console.log("Install prompt not available");
        return;
    }
    const result = await installPrompt.prompt();
    const isAccepted = result.outcome === 'accepted';
    installPromptRef.current = null;
    // alert(isAccepted ? 'Accepted ✅' : 'Rejected ❌');
    console.log(`Install prompt was: ${result.outcome}`); // "accepted" or "dismissed"

    $("#modal").setAttribute("hidden", true); // Hide modal if accepted
    if (isAccepted) {
        // Hide `install-btn-2` if accepted
        $("#install-btn-2").setAttribute("hidden", true);
    } else {
        // Show `install-btn-2` if rejected
        $("#install-btn-2").removeAttribute("hidden");
    }
}

const audioEl = $("#player");
// TODO: Load list of audio urls dynamically via the list of files
//      fetched via API.
let audioUrls = [
    "http://192.168.18.2:8080/.ignored/1.mp3",
    "http://192.168.18.2:8080/.ignored/2.mp3",
];

function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function playRandomAudio(play = true) {
    let randomEl = getRandomElement(audioUrls);
    if (randomEl) {
        audioUrls = audioUrls.filter(item => item !== randomEl); // remove randomEl array
        audioEl.src = randomEl;
        if (play) audioEl.play();
    } else {
        alert('Playback finished for all audios!');
    }
}
playRandomAudio(false); // we can't simply play files before user interact with the webpage and we get error in console and link to this - https://goo.gl/xX8pDD
// For initial testing => // audioEl.src = "https://github.com/RagaTime/ragatime-files/raw/refs/heads/main/2-Healing-Ragas-Rag-Hamsadwani-Sitar-Flute-and-Violin-Classical-Fusion-Music.mp3";
// Learn: Event "ended" fires once when playback reaches the end naturally (not if stopped manually). (src: https://chatgpt.com/c/68f76f5d-9110-8324-85f0-a4b5d6c16617)
audioEl.addEventListener("ended", () => {
    console.log("Playback finished!");
    playRandomAudio();
});
