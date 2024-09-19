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
