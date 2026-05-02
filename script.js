// @ts-nocheck

const d = document; const $ = document.querySelector.bind(document);

var subscription;

// Service Worker Registration
async function main() {
    if ('serviceWorker' in navigator) {
        console.log("🚀 Registering Service Worker");
        const register = await navigator.serviceWorker.register('/sw.js');
        console.log("✅ Service Worker Registered");

        // Create Push Subscription for "Push Notifications"
        console.log('🚀 Creating a Push Subscription for "Push Notifications" for the browser');
        const publicVapidKey =
            "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
        subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
        // console.log("🐞 subscription:", subscription);
        console.log("✅ Push Subscription Created");
    } else {
        // alert('Service Workers are not supported in this browser.');
        console.log('❌ Service Workers are not supported in this browser.');
    }
}
main();

let count = 0;
async function getTestPushNotification() {
    // Send Push Notification
    console.log("🚀 Calling Push-Notification-API to get Test Push Notification");
    count++;
    const notification = {
        title: 'Title ' + count,
        body: "Body " + count,
        icon: "http://image.ibb.co/frYOFd/tmlogo.png",
        data: {
            // Learn: You need to define event handler for `notificationclick` to be able to open `url` link. Check file sw.js in ragatime.github.io source code. [TESTED]
            url: 'https://ragatime.github.io/about'
        },
        // Learn: `actions` are not supported on iOS Safari
        // actions: [
        //     { action: 'open', title: 'View Query' }
        // ]
    };
    // const API_URL = 'https://api-dev.mypot.in/api/v1/raga-time';
    const API_URL = 'https://api.mypot.in/api/v1/raga-time';
    const response = await axios.post(API_URL + '/push-notification', { subscription, notification });
    console.log("✅ Push-Notification-API Succeeded.", response.data);
}

const dom = {
    // pwa
    modal: $("#modal"),
    installBtn1: $('#install-btn-1'),
    mayBeLaterBtn: $('#maybe-later-btn'),
    installBtn2: $('#install-btn-2'),
    // others
    btnContainer: $('#button-container'),
};

const btn = d.createElement('button');
// d.body.append(btn);
dom.btnContainer.append(btn);
btn.innerText = 'Get Test Push Notification';
btn.style.cssText = 'margin-top: 20px; padding: 5px 10px; background: transparent;';
btn.onclick = getTestPushNotification;

// We use this to show the full screen modal only once and then we show small button only.
// TODO: we can store this in localStorage to remember user choice across sessions.
let isFirstEventFire_beforeinstallprompt = true;

// Prompt for installation
let installPromptEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent Chrome from showing the default prompt
    // Learn: Below line throws - Uncaught (in promise)
    //      NotAllowedError: Failed to execute 'prompt' on
    //      'BeforeInstallPromptEvent': The prompt() method must be called
    //      with a user gesture
    // const result = await e.prompt();
    installPromptEvent = e;
    if (isFirstEventFire_beforeinstallprompt) {
        isFirstEventFire_beforeinstallprompt = false;
        dom.modal.removeAttribute("hidden");
    }
});

dom.installBtn1.addEventListener('click', handleInstall);
dom.installBtn2.addEventListener('click', handleInstall);
dom.mayBeLaterBtn.addEventListener('click', () => {
    dom.modal.setAttribute("hidden", true);
    dom.installBtn2.removeAttribute("hidden");
});

async function handleInstall() {
    if (!installPromptEvent) {
        // alert("Install prompt not available");
        console.log("Install prompt not available");
        return;
    }
    const result = await installPromptEvent.prompt();
    const isAccepted = result.outcome === 'accepted';
    installPromptEvent = null;
    // alert(isAccepted ? 'Accepted ✅' : 'Rejected ❌');
    console.log(`Install prompt was: ${result.outcome}`); // "accepted" or "dismissed"

    dom.modal.setAttribute("hidden", true); // Hide modal if accepted
    if (isAccepted) {
        // Hide `install-btn-2` if accepted
        dom.installBtn2.setAttribute("hidden", true);
    } else {
        // Show `install-btn-2` if rejected
        dom.installBtn2.removeAttribute("hidden");
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



// Utility Functions
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
