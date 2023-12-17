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
                    console.log(`Selected space: ${selectedSpace}`);
                    const space = spaces[selectedSpace]
                    console.log(`Opening for space: ${selectedSpace}`);
                    console.log(space);

                    chrome.windows.create({
                        url: space.map(tab => tab.url),
                        focused: true
                    });

                    chrome.tabs.remove(activeTabs[0].id);
                } else {
                    console.log(`NO Selected space: ${selectedSpace}`);
                }
            }

            function deleteSpace() {
                const selectedSpace = list.options[list.selectedIndex]?.value;
                if (selectedSpace) {
                    console.log(`Selected space: ${selectedSpace}`);
                    const space = spaces[selectedSpace]
                    console.log(`Deleting for space: ${selectedSpace}`);
                    console.log(space);

                    const confirmation = window.confirm(`Are you sure you want to delete space: ${selectedSpace} ?`)
                    if (confirmation) {
                        console.log(`USER WANTS TO DELETE: ${confirmation} ${selectedSpace}`);
                        delete spaces[selectedSpace];
                        chrome.storage.local.set({'user-spaces': spaces});
                        updateList();
                    }

                } else {
                    console.log(`NO Selected space: ${selectedSpace}`);
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
