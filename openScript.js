document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then(activeTabs => {
        chrome.storage.local.get('user-spaces', (result) => {
            const spaces = result['user-spaces'];

            const list = document.getElementById('spacesDatalist');
            list.focus();


            function updateList() {
                list.innerHTML = '';
                Object.keys(spaces).forEach((name, index) => {
                    const listItem = document.createElement('option');
                    listItem.value = name;
                    listItem.textContent = name;
                    list.appendChild(listItem);
                })
            }

            async function isFreshWindow() {
                // Checks if the current window has no real tabs
                // (fresh windows can be used instead of making a new windoow)
                return new Promise((resolve, reject) => {
                    chrome.tabs.query({lastFocusedWindow: true}).then(currentTabs => {
                        console.log(`Found tabs in last focused window:`);
                        console.log(currentTabs);

                        if (currentTabs.length == 2 && currentTabs[0].url == "chrome://newtab/") {
                            resolve(currentTabs);
                        } else {
                            resolve(false);
                        }
                    });
                });
            }

            async function openSpace() {
                const selectedSpace = list.options[list.selectedIndex]?.value;
                if (selectedSpace) {
                    const space = spaces[selectedSpace]

                    if (await isFreshWindow()) {
                        // Insert tabs into current window
                        space.map(tab => tab.url).forEach(url => {
                            chrome.tabs.create({
                                url: url
                            });
                        });
                        chrome.tabs.remove(fresh.map(tab => tab.id), (removeresult) => {
                            console.log(`Removed with result:`);
                            console.log(removeresult);
                        });
                    } else {
                        // Create tabs in a new window
                        chrome.windows.create({
                            url: space.map(tab => tab.url),
                            focused: true
                        });

                        chrome.tabs.remove(activeTabs[0].id);
                    }

                } else {
                    console.error(`NO Selected space: ${selectedSpace}`);
                }
            }

            function deleteSpace() {
                const selectedSpace = list.options[list.selectedIndex]?.value;
                if (selectedSpace) {
                    const space = spaces[selectedSpace]

                    const confirmation = window.confirm(`Are you sure you want to delete space: ${selectedSpace} ?`)
                    if (confirmation) {
                        delete spaces[selectedSpace];
                        chrome.storage.local.set({'user-spaces': spaces});
                        updateList();
                    }
                } else {
                    console.error(`NO Selected space: ${selectedSpace}`);
                }
            }


            // Open space on select
            updateList();
            list.addEventListener('keydown', (event) => {
                if (event.key === "Enter") {
                    openSpace();
                }
            })

            // Add button functions
            const openButton = document.getElementById("openButton");
            const deleteButton = document.getElementById("deleteButton");

            openButton.addEventListener("click", () => {
                openSpace();
            })

            deleteButton.addEventListener("click", () => {
                deleteSpace();
            })

        })
    })
});
