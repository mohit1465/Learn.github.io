let currentTabId = 'Untitled.txt';
let currentFileHandle = null; // This variable will store the current file handle

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'dracula',
    extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Ctrl-L": function(cm) {
            let line = prompt("Enter line number:");
            if (line) cm.setCursor({line: Number(line) - 1, ch: 0});
        },
        "Ctrl-F": "findPersistent"
    },
    hintOptions: { // Enable autocomplete
        completeSingle: false
    }
});

const tabContents = {};

document.getElementById('new-file').addEventListener('click', createNewFile);
document.getElementById('open-file').addEventListener('click', handleFileOpen);
document.getElementById('save-file').addEventListener('click', saveFile);
document.getElementById('save-as-file').addEventListener('click', saveAsFile);
document.getElementById('file-input').addEventListener('change', handleFileOpen);
document.getElementById('change-extension').addEventListener('click', changeExtension);
document.getElementById('change-name').addEventListener('click', changeFileName);
document.getElementById('metaMenu').addEventListener('click', toggleMenu);
document.getElementById('save-online').addEventListener('click', saveFileOnline);
document.getElementById('load-file').addEventListener('click', loadFileOnline);

editor.on('inputRead', function(instance, changeObj) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const searchTerm = token.string.trim();

    if (searchTerm) {
        updateFilteredSuggestions(searchTerm);
    } else {
        updateSuggestions(currentTabId);
    }
});

function createNewFile(file_name) {
    let baseName = 'Untitled';
    let ext = 'txt';
    let newName = `${baseName}.${ext}`;
    let counter = 2;

    while (document.getElementById(newName)) {
        newName = `${baseName}_${counter}.${ext}`;
        counter++;
    }

    addTab(newName);
}

function addTab(name) {
    const tabContainer = document.getElementById('tabs');
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.id = name;
    tab.textContent = name;

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.className = 'close-tab';
    closeBtn.onclick = (event) => {
        event.stopPropagation(); // Prevent the tab's click event from firing
        if (tabContainer.children.length > 1) {
            if (confirm('Are you sure you want to close this tab?')) {
                delete tabContents[tab.id];
                tab.remove();
                
                if (tab.classList.contains('active')) {
                    const remainingTabs = tabContainer.children;
                    if (remainingTabs.length > 0) {
                        remainingTabs[0].click(); // Activate the first remaining tab
                    }
                }
            }
        } else {
            alert('At least one tab must be open.');
        }
    };

    tab.appendChild(closeBtn);
    tab.onclick = () => setActiveTab(tab);

    tabContainer.appendChild(tab);
    setActiveTab(tab);
}

function setActiveTab(tab) {
    if (currentTabId) {
        tabContents[currentTabId] = editor.getValue();
    }

    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    tab.classList.add('active');
    currentTabId = tab.id;

    editor.setValue(tabContents[currentTabId] || '');
    updateSuggestions(currentTabId);
}

function createCloseButton(tab) {
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '×';
    closeBtn.className = 'close-tab';
    closeBtn.onclick = () => {
        if (document.querySelectorAll('.tab').length > 1) {
            if (confirm('Are you sure you want to close this tab?')) {
                delete tabContents[tab.id];
                tab.remove();
                if (tab.classList.contains('active')) {
                    document.querySelector('.tab').click(); // Activate first tab
                }
            }
        } else {
            alert('At least one tab must be open.');
        }
    };
    return closeBtn;
}

function updateSuggestions(filename) {
    const extension = filename.split('.').pop();
    const suggestionContainer = document.querySelector('.suggestions');
    suggestionContainer.innerHTML = '';

    if (suggestions[`.${extension}`]) {
        suggestions[`.${extension}`].forEach(suggestion => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.textContent = suggestion;
            suggestionDiv.onclick = () => {
                editor.replaceSelection(suggestion);
                editor.focus(); 
            };
            suggestionContainer.appendChild(suggestionDiv);
        });
    }
}

function updateFilteredSuggestions(searchTerm) {
    const activeTab = document.querySelector('.tab.active');
    const extension = activeTab.id.split('.').pop();
    const suggestionContainer = document.querySelector('.suggestions');
    suggestionContainer.innerHTML = '';

    if (suggestions[`.${extension}`]) {
        const filteredSuggestions = suggestions[`.${extension}`].filter(suggestion =>
            suggestion.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredSuggestions.forEach(suggestion => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.textContent = suggestion;
            suggestionDiv.onclick = () => {
                editor.replaceSelection(suggestion);
                editor.focus(); 
            };
            suggestionContainer.appendChild(suggestionDiv);
        });
    }
}

async function saveFile() {
    if (!currentFileHandle) {
        saveAsFile();
        return;
    }

    const writable = await currentFileHandle.createWritable();
    await writable.write(editor.getValue());
    await writable.close();
    alert('File saved successfully.');
}

async function saveAsFile() {
    // Get the current tab's name or provide a default name
    const defaultFileName = currentTabId || 'Untitled.txt';
    
    // Prepare file options with a suggested file name
    const options = {
        suggestedName: defaultFileName,
        types: [{
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] }
        }]
    };

    try {
        // Show the Save File Picker dialog
        const fileHandle = await window.showSaveFilePicker(options);
        const newFileName = fileHandle.name;

        // If the file name changes, update the tab and content
        if (currentFileHandle) {
            const existingTab = document.getElementById(currentTabId);
            if (existingTab) {
                existingTab.id = newFileName;
                existingTab.textContent = newFileName;

                // Ensure the close button is present
                const closeBtn = existingTab.querySelector('.close-tab');
                if (!closeBtn) {
                    const newCloseBtn = document.createElement('span');
                    newCloseBtn.textContent = '×';
                    newCloseBtn.className = 'close-tab';
                    newCloseBtn.onclick = () => {
                        if (document.querySelectorAll('.tab').length > 1) {
                            if (confirm('Are you sure you want to close this tab?')) {
                                delete tabContents[existingTab.id]; // Remove content of closed tab
                                existingTab.remove();
                                if (existingTab.classList.contains('active')) {
                                    document.querySelector('.tab').click(); // Activate first tab
                                }
                            }
                        } else {
                            alert('At least one tab must be open.');
                        }
                    };
                    existingTab.appendChild(newCloseBtn);
                }

                // Update the tab contents and name
                tabContents[newFileName] = editor.getValue();
                delete tabContents[currentTabId];
                currentTabId = newFileName;
                editor.setValue(tabContents[currentTabId] || '');
            }
        }

        // Update the file handle and save the file
        currentFileHandle = fileHandle;
        await saveFile();
    } catch (err) {
        console.error('Error saving file:', err);
    }
}


async function handleFileOpen() {
    try {
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const contents = await file.text();
        document.getElementById('editor').value = contents;

        addTab(file.name);
        editor.setValue(contents);
        currentFileHandle = fileHandle;
        tabContents[currentTabId] = contents;
    } catch (err) {
        console.error(err);
    }
}


function changeExtension() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const newExtension = prompt('Enter the new file extension (e.g., js, txt, html):');
        if (newExtension) {
            const nameParts = activeTab.id.split('.');
            nameParts.pop(); // Remove the old extension
            nameParts.push(newExtension); // Add the new extension
            const newId = nameParts.join('.');

            tabContents[newId] = tabContents[activeTab.id];
            delete tabContents[activeTab.id];

            activeTab.id = newId;
            activeTab.textContent = newId;

            // Ensure the close button is reattached
            const closeBtn = document.createElement('span');
            closeBtn.textContent = '×';
            closeBtn.className = 'close-tab';
            closeBtn.onclick = () => {
                if (document.querySelectorAll('.tab').length > 1) {
                    if (confirm('Are you sure you want to close this tab?')) {
                        delete tabContents[activeTab.id]; // Remove content of closed tab
                        activeTab.remove();
                        if (activeTab.classList.contains('active')) {
                            document.querySelector('.tab').click(); // Activate first tab
                        }
                    }
                } else {
                    alert('At least one tab must be open.');
                }
            };
            activeTab.appendChild(closeBtn);

            updateSuggestions(newId);
        }
    }
}


function changeFileName() {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const newName = prompt('Enter the new file name (without extension):');
        if (newName) {
            const nameParts = activeTab.id.split('.');
            nameParts[0] = newName; // Update the file name part
            const newId = nameParts.join('.');

            tabContents[newId] = tabContents[activeTab.id];
            delete tabContents[activeTab.id];

            activeTab.id = newId;
            activeTab.textContent = newId;

            // Ensure the close button is reattached
            const closeBtn = document.createElement('span');
            closeBtn.textContent = '×';
            closeBtn.className = 'close-tab';
            closeBtn.onclick = () => {
                if (document.querySelectorAll('.tab').length > 1) {
                    if (confirm('Are you sure you want to close this tab?')) {
                        delete tabContents[activeTab.id]; // Remove content of closed tab
                        activeTab.remove();
                        if (activeTab.classList.contains('active')) {
                            document.querySelector('.tab').click(); // Activate first tab
                        }
                    }
                } else {
                    alert('At least one tab must be open.');
                }
            };
            activeTab.appendChild(closeBtn);

            updateSuggestions(newId);
        }
    }
}


editor.on('cursorActivity', () => {
    const { line, ch } = editor.getCursor();
    document.getElementById('cursor-position').textContent = `Ln: ${line + 1}, Col: ${ch + 1}`;
});

editor.on('change', () => {
    const lineCount = editor.lineCount();
    document.getElementById('total-lines').textContent = `Total Ln: ${lineCount}`;
    document.getElementById('file-size').textContent = `File Size: ${(new Blob([editor.getValue()]).size / 1024).toFixed(2)} KB`;
});

function setTheme(theme) {
    document.body.className = theme;
    editor.setOption('theme', theme === 'light' ? 'default' : 'dracula');
    localStorage.setItem('theme', theme);
}

document.addEventListener("DOMContentLoaded", function() {
    loadUserFiles();
});










window.onload = () => {
    addTab('Untitled.txt');
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
};

function redirectToLogin() {
    const pageName = window.location.pathname.split("/").pop();
    localStorage.setItem('lastPage', pageName);
    const confirmation = confirm("Before you Leave must save your files locally.")
    if (confirmation) {
        window.location.href = 'login-signup.html';
    }
}


// function allData() {
//     const tabs = document.querySelectorAll('.tab');
//     let allFilesData = [];
//     const content = editor.getValue();

//     alert(`content:${content}`);

//     return allFilesData;
// }


















function toggleMenu() {
    const profileInfo = document.getElementById('profileInfo');
    
    if (profileInfo.style.display === 'none' || profileInfo.style.display === '') {
        profileInfo.style.display = 'block';
    } else {
        profileInfo.style.display = 'none';
    }
}

document.addEventListener('click', function(event) {
    const profileInfo = document.getElementById('profileInfo');
    const toggleBtn = document.getElementById('metaMenu');

    if (!profileInfo.contains(event.target) && !toggleBtn.contains(event.target)) {
        profileInfo.style.display = 'none';
    }
});

async function saveFileOnline() {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to save files.");
        return;
    }

    const fileName = prompt("Enter the file name:");
    const fileID = prompt("Enter a unique file ID:");
    const filePassword = prompt("Enter a password for the file:");

    if (!fileName || !fileID || !filePassword) {
        alert("Please provide a file name, unique file ID, and password.");
        return;
    }

    const content = editor.getValue();

    const existingFile = await db.collection('files').doc(fileID).get();
    if (existingFile.exists) {
        alert("File ID already exists. Please choose a different ID.");
        return;
    }

    await db.collection('files').doc(fileID).set({
        content: content,
        name: fileName,
        password: filePassword,
        userId: user.uid,
        timestamp: new Date().toISOString()
    });

    alert("File saved successfully!");

    loadUserFiles();
}

async function loadFileOnline() {
    const fileID = prompt("Enter the file ID:");
    const filePassword = prompt("Enter the file password:");

    if (!fileID || !filePassword) {
        alert("Please provide both file ID and password.");
        return;
    }

    const fileDoc = await db.collection('files').doc(fileID).get();

    if (!fileDoc.exists) {
        alert("No file found with this ID.");
        return;
    }

    const fileData = fileDoc.data();

    if (fileData.password !== filePassword) {
        alert("Incorrect password. Access denied.");
        return;
    }

    loadFileIntoTab(fileData.name, fileData.content);
    alert("File loaded successfully!");
}

function loadFileIntoTab(fileName, fileContents) {    
    addTab(fileName);
    editor.setValue(fileContents);
    tabContents[currentTabId] = fileContents;
}


async function loadUserFiles() {
    const user = auth.currentUser;

    if (!user) {
        console.log("You must be logged in to load files.");
        return;
    }

    const userFilesContainer = document.getElementById('users-files');
    userFilesContainer.innerHTML = '';

    const filesSnapshot = await db.collection('files').where('userId', '==', user.uid).get();

    if (filesSnapshot.empty) {
        userFilesContainer.innerHTML = '<p>No files found.</p>';
        return;
    }

    filesSnapshot.forEach(doc => {
        const fileData = doc.data();
        const fileID = doc.id;

        const fileElement = document.createElement('div');
        fileElement.textContent = fileData.name;
        fileElement.className = 'file-entry';
        fileElement.onclick = () => loadFileIntoTab(fileData.name, fileData.content, fileID);

        userFilesContainer.appendChild(fileElement);
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('profileInfo').innerHTML = `
                    <h2>${userData.name}</h2>
                    <p>Email: ${userData.email}</p>
                    <button onclick="logoutUser()">Logout</button>
                    <div id='users-files'></div>`;

                loadUserFiles();
            } else {
                document.getElementById('profileInfo').innerHTML = `
                    <h2>No user data found</h2>
                    <p>Please complete your profile.</p>
                    <button onclick="logoutUser()">Logout</button>`;
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data.');
        });
    } else {
        document.getElementById('profileInfo').innerHTML = `
            <h2>No user data found</h2>
            <p>Please login</p>
            <a onclick="redirectToLogin()">Login | Signup</a>`;
    }
});

function logoutUser() {
    auth.signOut().then(() => {
    alert("Logged out successfully!");
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const fileName = localStorage.getItem('selectedFileName');
    const fileContents = localStorage.getItem('selectedFileContent');

    if (fileName) {
        if (fileContents !== null) {
            loadFileIntoTab(fileName, fileContents);
        } else {
            loadFileIntoTab(fileName, '');
        }
        localStorage.removeItem('selectedFileName');
        localStorage.removeItem('selectedFileContent');
    } else {
        console.log("No file selected.");
    }
});

