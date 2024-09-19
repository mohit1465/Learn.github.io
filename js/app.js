// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuRv2uCN4mITyc2Y21iQkkUTv_SCzE_qQ",
    authDomain: "website-10efd.firebaseapp.com",
    projectId: "website-10efd",
    storageBucket: "website-10efd.appspot.com",
    messagingSenderId: "394728984945",
    appId: "1:394728984945:web:cafbc90a99dbef0642a6d0",
    measurementId: "G-CH0T2RNMBZ"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, addDoc, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

// Authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.reload();
    }).catch((error) => {
        console.error('Sign out error:', error);
    });
});
