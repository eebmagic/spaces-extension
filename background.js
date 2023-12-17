chrome.commands.onCommand.addListener((command) => {
  // Open corresponding html pages by keyboard shortcut
  if (command === "save-space") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("saveSpace.html"),
    })
  } else if (command === "open-space") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("openSpace.html"),
    })
  }
});
