auth.onAuthStateChanged(user => {
  if (user) {
      // Fetch the user document from Firestore
      db.collection('users').doc(user.uid).get().then(doc => {
          if (doc.exists) {
              // If the document exists, extract the user data
              const userData = doc.data();
              // Update the profile information on the page
              document.getElementById('profileInfo').innerHTML = `
                  <h2>${userData.name}</h2>
                  <p>Email: ${userData.email}</p>
                  <button onclick="logoutUser()">Logout</button>
                  <div id='users-files'></div>`; // 'users-files' div added here

          }
      }).catch(error => {
          console.error('Error fetching user data:', error);
          alert('Error fetching user data.');
      });
  } else {
      // If the document does not exist, show an error message
      document.getElementById('profileInfo').innerHTML = `
          <h2>No user data found</h2>
          <p>Please login</p>
          <a href='login.html'>Login | Signup</a>`;
  }
});


// Logout function
function logoutUser() {
  auth.signOut().then(() => {
    alert("Logged out successfully!");
  });
}


