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
