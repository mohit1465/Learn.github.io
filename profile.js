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
            <button onclick="logoutUser()">Logout</button>`
          ;
        } else {
          // If the document does not exist, show an error message
          document.getElementById('profileInfo').innerHTML = `
            <h2>No user data found</h2>
            <p>Please complete your profile.</p>
            <button onclick="logoutUser()">Logout</button>`
          ;
        }
      }).catch(error => {
        console.error('Error fetching user data:', error);
        alert('Error fetching user data.');
      });
    } else {
      // If no user is logged in, redirect to the login page
      window.location.href = 'login.html';
    }
  });
  
  // Logout function
  function logoutUser() {
    auth.signOut().then(() => {
      alert("Logged out successfully!");
      window.location.href = 'login.html';
    });
  }
  