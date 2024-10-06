auth.onAuthStateChanged(user => {
  if (user) {
      db.collection('users').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            document.getElementById('user-name-email').innerHTML = `
                <span id='userData'>${userData.name}</span><span id="edit-btn">Edit</span>
                <p id='userEmail'>Email: ${userData.email}</p>`;

            document.getElementById('auth-check-option').innerHTML = `
                <i id="auth-check-option"  onclick="logoutUser()"> Logout</i> 
            `;
            loadUserFiles();
          }
      }).catch(error => {
          console.error('Error fetching user data:', error);
          alert('Error fetching user data.');
      });
  } else {
      document.getElementById('auth-check-option').innerHTML = `Login | Signup`;
      document.getElementById('user-name-email').innerHTML = `
      <h2 id='login-magic'>Login to See, <span>Magic</span></h2>`;
  }
});

function logoutUser() {
  auth.signOut().then(() => {
    alert("Logged out successfully!");
  });
}

function redirectToLogin() {
    const pageName = window.location.pathname.split("/").pop();
    localStorage.setItem('lastPage', pageName);
    window.location.href = 'login-signup.html';
}

const toggles = document.querySelectorAll('.theme-toggle');

const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

toggles.forEach(toggle => {
    toggle.checked = currentTheme === 'dark';
    toggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        toggles.forEach(t => t.checked = theme === 'dark');
    });
});

window.onload = function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggle.checked = (savedTheme === 'dark');
};

window.onload = function() {
    showSection('dashboard');
};

function showSection(section) {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('setting').style.display = 'none';
    document.getElementById('whatsNew').style.display = 'none';
    
    document.getElementById(section).style.display = 'block';
    
    document.getElementById('dashboard-btn').classList.remove('active');
    document.getElementById('setting-btn').classList.remove('active');
    document.getElementById('whatsNew-btn').classList.remove('active');
    
    if (section === 'dashboard') {
        document.getElementById('dashboard-btn').classList.add('active');
    } else if (section === 'setting') {
        document.getElementById('setting-btn').classList.add('active');
    } else if (section === 'whatsNew') {
        document.getElementById('whatsNew-btn').classList.add('active');
    }
}

async function loadUserFiles() {
    const user = auth.currentUser;

    if (!user) {
        console.log("You must be logged in to load files.");
        return;
    }
    const userFilesContainer = document.getElementById('users-files');
    userFilesContainer.innerHTML = `
        <div class="header">
            <h2>Text Editor Files</h2>
            <span class="file-count">Loading...</span>
        </div>
    `;
    const filesSnapshot = await db.collection('files').where('userId', '==', user.uid).get();

    if (filesSnapshot.empty) {
        userFilesContainer.innerHTML = '<p>No files found.</p>';
        return;
    }

    const totalFiles = filesSnapshot.size;  // Get the total number of files
    const fileCountElement = userFilesContainer.querySelector('.file-count');

    // Update the file count
    fileCountElement.textContent = `${totalFiles} Files`;

    let fileCounter = 0;

    filesSnapshot.forEach((doc) => {
        if (fileCounter < 4) {  // Only show top 4 files
            const fileData = doc.data();
            const fileID = doc.id;

            const fileElement = document.createElement('div');
            fileElement.textContent = fileData.name;
            fileElement.className = 'file-entry';

            fileElement.onclick = () => {
                localStorage.setItem('selectedFileName', fileData.name);
                localStorage.setItem('selectedFileContent', fileData.content);

                window.location.href = 'text-editor.html';
            };

            userFilesContainer.appendChild(fileElement);
        }
        fileCounter++;
    });
}







