import { auth } from './firebase-auth.js'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { addTab } from './text-editor.js';

const db = getFirestore();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    alert('Login successful! Welcome, ' + user.email);

                    loadTabs(); // Load saved tabs after login
                })
                .catch((error) => {
                    alert('Error: ' + error.message);
                });
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const designation = document.getElementById('designation').value;
            const age = document.getElementById('age').value;
            const mobile = document.getElementById('mobile').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                // Log the user information
                console.log('User created:', user);
    
                await setDoc(doc(db, "users", user.uid), {
                    name,
                    designation,
                    age,
                    mobile,
                    email,
                    createdAt: new Date(),
                });
    
                console.log('User data saved:', { name, designation, age, mobile, email });
    
                alert('Signup successful! Welcome, ' + user.email);
                window.location.href = 'index.html'; // Redirect to home
            } catch (error) {
                alert('Error during signup: ' + error.message);
            }
        });
    }
    
});

// Load tabs from localStorage
function loadTabs() {
    const savedTabs = JSON.parse(localStorage.getItem('tabsData')) || {};
    Object.keys(savedTabs).forEach(filename => {
        addTab(filename);
        tabContents[filename] = savedTabs[filename];  // Store content
        editor.setValue(tabContents[filename] || '');  // Set editor content
    });
}
