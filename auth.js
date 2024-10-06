document.getElementById('loginForm')?.addEventListener('submit', loginUser);
document.getElementById('signupForm')?.addEventListener('submit', signupUser);
    
function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Login successful!");
       window.location.href = localStorage.getItem('lastPage') || 'text-editor.html';
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
      db.collection('users').doc(user.uid).set({
        name: name,
        email: email,
        posts: []
      }).then(() => {
        alert("Signup successful!");
         window.location.href = localStorage.getItem('lastPage') || 'text-editor.html';
      });
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}

document.getElementById('switchToSignup').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('signup-form').classList.remove('hidden');
});

document.getElementById('switchToLogin').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('signup-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
});
