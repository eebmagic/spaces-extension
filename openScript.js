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

            function openSpace() {
                const selectedSpace = list.options[list.selectedIndex]?.value;
                if (selectedSpace) {
                    const space = spaces[selectedSpace]

                    chrome.windows.create({
                        url: space.map(tab => tab.url),
                        focused: true
                    });

                    chrome.tabs.remove(activeTabs[0].id);
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
