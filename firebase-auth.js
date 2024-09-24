// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";

// Your Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth variable
export { auth };
