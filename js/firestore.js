<<<<<<< HEAD
import { getFirestore, collection, addDoc, query, where, onSnapshot, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js';

const firestore = getFirestore();
const storage = getStorage();
const auth = getAuth();

const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');

uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    const storageRef = ref(storage, 'posts/' + file.name);
    const uploadTask = uploadBytes(storageRef, file);

    uploadTask.then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        const post = {
            imageURL: downloadURL,
            userId: user.uid,
            approved: false,
            timestamp: new Date()
        };

        await addDoc(collection(firestore, 'posts'), post);
    }).catch((error) => {
        console.error('Upload error:', error);
    });
});

const loadPosts = () => {
    const postsContainer = document.getElementById('posts-container');
    const postsQuery = query(collection(firestore, 'posts'), where('approved', '==', true));

    onSnapshot(postsQuery, (querySnapshot) => {
        postsContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <img src="${post.imageURL}" alt="Post Image" style="max-width: 100%;">
                <button class="upvote-btn">Upvote</button>
                <button class="downvote-btn">Downvote</button>
                <button class="save-btn">Save</button>
                <a href="${post.imageURL}" target="_blank">Share Link</a>
            `;
            postsContainer.appendChild(postElement);
        });
    });
};

loadPosts();
=======
// Post handling
const postForm = document.getElementById('post-form');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');

uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    const storageRef = ref(storage, 'posts/' + file.name);
    const uploadTask = uploadBytes(storageRef, file);

    uploadTask.then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        const post = {
            imageURL: downloadURL,
            userID: auth.currentUser.uid,
            timestamp: new Date()
        };

        await addDoc(collection(firestore, 'posts'), post);
    }).catch((error) => {
        console.error('Upload error:', error);
    });
});

// Load posts
const loadPosts = () => {
    const postsContainer = document.getElementById('posts-container');
    const postsQuery = query(collection(firestore, 'posts'));

    onSnapshot(postsQuery, (querySnapshot) => {
        postsContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.innerHTML = `<img src="${post.imageURL}" alt="Post Image" style="max-width: 100%;">`;
            postsContainer.appendChild(postElement);
        });
    });
};

loadPosts();
>>>>>>> 919abc9d0df8d02d973a17fefb912aef295608f5
