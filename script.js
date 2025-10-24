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
    // Learn: Below line throws - Uncaught (in promise)
    //      NotAllowedError: Failed to execute 'prompt' on
    //      'BeforeInstallPromptEvent': The prompt() method must be called
    //      with a user gesture
    // const result = await e.prompt();
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

let audioUrls = [];
let currentlyPlayingAudioUrls = [];
// let currentlyPlayingAudioUrls = [ // For local testing
//     "http://192.168.18.2:8080/.ignored/1.mp3",
//     "http://192.168.18.2:8080/.ignored/2.mp3",
// ];
// setRandomAudioAndPlay(false); // For local testing
// For initial testing => // audioEl.src = "https://github.com/RagaTime/ragatime-files/raw/refs/heads/main/2-Healing-Ragas-Rag-Hamsadwani-Sitar-Flute-and-Violin-Classical-Fusion-Music.mp3";

function getRandomElement(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function setRandomAudioAndPlay(play = true) {
    let randomEl = getRandomElement(currentlyPlayingAudioUrls);
    // let randomEl = audioUrls.find(url => url.includes('Rag%20Hamsadwani')); // for debugging - for playing specific audio file
    if (randomEl) {
        // Show name of the audio file
        const encodedFileName = randomEl.match(/[^/]+$/)[0];
        const decodedFileName = decodeURIComponent(encodedFileName);
        console.log("🚀 ~ decodedFileName:", decodedFileName);
        $("#filename").innerText = decodedFileName;
        // Set to audio player
        currentlyPlayingAudioUrls = currentlyPlayingAudioUrls.filter(item => item !== randomEl); // remove randomEl array
        audioEl.src = randomEl;
        console.log("🚀 ~ randomEl:", randomEl);
        if (play) audioEl.play();
    } else {
        alert('Playback finished for all audios!');
        // Restart playlist when playlist finishes.
        currentlyPlayingAudioUrls = [...audioUrls];
        // we want to acutally play the audio after fetching this time.
        setRandomAudioAndPlay(true);
    }
}
$('#next-audio').addEventListener('click', setRandomAudioAndPlay);

const INDIAN_FOLDER_NAME = 'indian-mp3';
const WESTERN_FOLDER_NAME = 'western-mp3';

let folderName = INDIAN_FOLDER_NAME;
async function fetchAudioFiles(play = true) {
    const res = await axios.get(`https://api.mypot.in/api/v1/public-files/${folderName}`);
    // const res = await axios.get(`https://api-dev.mypot.in/api/v1/public-files/${folderName}`);
    // const res = await axios.get(`http://localhost:8080/api/v1/public-files/${folderName}`);
    const fileNames = res.data;
    audioUrls = res.data.map(fileName => { const encodedFileName = encodeURIComponent(fileName); return `https://files.mypot.in/${folderName}/${encodedFileName}`; });
    currentlyPlayingAudioUrls = [...audioUrls];
    // console.log("🚀 ~ audioUrls:", audioUrls);
    setRandomAudioAndPlay(play);
}
// Note: We can't simply play files before user interact with the
//      webpage and we get error in console and link to this -
//      https://goo.gl/xX8pDD.
//      Though we must set the audio file thus using below statement
//      to set the first audio file.
fetchAudioFiles(false);

const audioEl = $("#player");
// Learn: Event "ended" fires once when playback reaches the end naturally (not if stopped manually). (src: https://chatgpt.com/c/68f76f5d-9110-8324-85f0-a4b5d6c16617)
audioEl.addEventListener("ended", () => {
    console.log("Playback finished!");
    setRandomAudioAndPlay();
});


// Playlist switch logic
const handleRadio = async (e) => {
    // console.log("🚀 ~ e:", e);
    const { id, checked } = e.target;
    // console.log('radio changed:', id, checked);
    // Learn: `checked` is always `true`
    if (id === 'indian-input') {
        folderName = INDIAN_FOLDER_NAME;
    }
    if (id === 'western-input') {
        folderName = WESTERN_FOLDER_NAME;
    }
    await fetchAudioFiles();
};
$('#indian-input').addEventListener('change', handleRadio);
$('#western-input').addEventListener('change', handleRadio);
