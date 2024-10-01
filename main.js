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



const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
});



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

    // Clear any existing content
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
        fileCounter++;  // Increment the file count
    });
}







