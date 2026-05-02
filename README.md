# RagaTime

## Links

- Tech Documentation:
  - MDN Docs - Window: beforeinstallprompt event: [Clickh here](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)
  - web.dev Docs - Make it installable: [Click here](https://web.dev/articles/codelab-make-installable)
  - Chrome For Developers Docs - Native App Install Prompt: [Click here](https://developer.chrome.com/blog/app-install-banners-native)
- ChatGPT:
  - [1](https://chatgpt.com/c/68e3ec14-cd48-832e-b764-b520e2302b27)
    - How to create pwa for my site
    - Is service worker necessary?
    - I am using github pages, should i disable jeykyll?
    - Give me sample index.html file
    - Are icons necessary?
    - Where to put assets?
    - Shouldn't i put it to manifest-assets folder?
    - In index.html file where to put the beforeinstall prompt?
    - I'm not seeing the default install prompt though.
    - Using above code beforeinstallprompt event is fired when i cancel the from the deferredPrompt.prompt() why?
    - I am getting Banner not shown: beforeinstallpromptevent.preventDefault() called. The page must call beforeinstallpromptevent.prompt() to show the banner. 
  - Naming Suggestion for ragatime: [2](https://chatgpt.com/c/68e0c2aa-0718-8321-a4ad-c23eff814151)
  - Install UI Recommentaion: [3](https://chatgpt.com/c/68e4c57c-376c-8322-89e5-3e2412862d53)

1. I have disabled jekyll by adding `.nojekll` because I don’t want GitHub Pages to process your site with Jekyll.
2. Icons are necessary otherwise you click on `Add to homescreen` button you won't see the `Install` button rather you'll see a "Editable App" name field with "Add" button which looks pathetic.
3. I made two icons with 192x192 and 512x512 size usin figma.

Thanks.