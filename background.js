chrome.commands.onCommand.addListener((command) => {
  console.log(`Got command: ${command}`);
  if (command === "save-space") {
    // chrome.tabs.create({ url: "https://www.google.com" });
    // const tabs = chrome.tabs.query({
    //   currentWindow: true
    // }).then(tabs => {
    //   console.log(`Found ${tabs.length} tabs in current window:`);
    //   console.log(tabs);
    // })

    chrome.tabs.create({
      url: chrome.runtime.getURL("saveSpace.html"),
    })
  } else if (command === "open-space") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("openSpace.html"),
    })
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   chrome.scripting.executeScript({
    //     target: { tabId: tabs[0].id },
    //     function: showAlert
    //   });
    // });
  }
});

function showAlert() {
  alert("Hello from your Chrome Extension!");
}
