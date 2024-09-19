import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore, collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const auth = getAuth();
const firestore = getFirestore();

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userInfoElement = document.getElementById('user-info');
        userInfoElement.innerHTML = `Welcome, ${user.displayName || 'User'}`;
        
        const userPostsQuery = query(collection(firestore, 'posts'), where('userId', '==', user.uid));
        
        onSnapshot(userPostsQuery, (querySnapshot) => {
            const userPostsElement = document.getElementById('user-posts');
            userPostsElement.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <img src="${post.imageURL}" alt="Post Image" style="max-width: 100%;">
                    <button class="delete-btn">Delete</button>
                `;
                userPostsElement.appendChild(postElement);
            });
        });
    } else {
        window.location.href = 'index.html';
    }
});
