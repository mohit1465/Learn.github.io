document.getElementById('loginForm')?.addEventListener('submit', loginUser);
    document.getElementById('signupForm')?.addEventListener('submit', signupUser);
    
    function loginUser(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
    
      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          alert("Login successful!");
          window.location.href = 'text-editor.html'; // Redirect to profile
        })
        .catch(error => {
          alert("Error: " + error.message);
        });
    }
    
    function signupUser(e) {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
    
      auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          // Save user info in Firestore
          db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            posts: []
          }).then(() => {
            alert("Signup successful!");
            window.location.href = 'text-editor.html'; // Redirect to profile
          });
        })
        .catch(error => {
          alert("Error: " + error.message);
        });
    }