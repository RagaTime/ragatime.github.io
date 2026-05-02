// @ts-nocheck

const $ = document.querySelector.bind(document);

// * Note to Sahil: I do not need service worker registration for yesprint's needs.
// Service Worker Registration
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//         .then(() => console.log('Service Worker registered'))
//         .catch(err => {
//             // console.log('Service Worker registration failed: ' + err.toString());
//             console.log('Service Worker registration failed:', err);
//         });
// } else {
//     // alert('Service Workers are not supported in this browser.');
//     console.log('Service Workers are not supported in this browser.');
// }

const dom = {
    // pwa
    modal: $("#modal"),
    installBtn1: $('#install-btn-1'),
    mayBeLaterBtn: $('#maybe-later-btn'),
    installBtn2: $('#install-btn-2'),
};

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
