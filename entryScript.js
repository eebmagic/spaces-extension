document.addEventListener('DOMContentLoaded', function() {
    var input = document.getElementById('userInput');
    input.focus();

    // On save
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var spaceName = input.value;
            document.getElementById('output').textContent = "You enetered: " + spaceName;

            // Get the current tab id
            chrome.tabs.query({active: true, lastFocusedWindow: true}, (activeTabs) => {
                // Get current tabs in window
                chrome.tabs.query({
                    currentWindow: true
                }).then(tabs => {
                    const filtered = tabs.filter(t => {
                        const pattern = /^chrome/;
                        return !pattern.test(t.url)
                    });

                    // Store locally
                    // chrome.storage.local.get('user-spaces', (userSpaces) => {
                    chrome.storage.sync.get('user-spaces', (userSpaces) => {
                        const newCopy = {
                            ...userSpaces['user-spaces']
                        };
                        newCopy[spaceName] = filtered;
                        console.log(`Updating spaces in sync storage to:`);
                        console.log(JSON.stringify(newCopy, null, 2))
                        // chrome.storage.local.set({
                        chrome.storage.sync.set({
                            'user-spaces': newCopy
                        }, () => {
                            // Close the save tab
                            // chrome.tabs.remove(activeTabs[0].id);
                        });

                    });
                });
            })

        }
    });
});