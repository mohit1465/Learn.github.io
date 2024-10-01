const postsContainer = document.getElementById('posts');
    
    // Fetch approved posts from Firestore
    db.collection('posts').where('status', '==', 'approved')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const post = doc.data();
          postsContainer.innerHTML += 
            <div class="post">
              <h2>${post.title}</h2>
              <p>${post.content}</p>
              <button onclick="upvotePost('${doc.id}')">Upvote</button>
              <button onclick="downvotePost('${doc.id}')">Downvote</button>
              <span>Votes: ${post.votes}</span>
            </div>
          ;
        });
      });
    
    function upvotePost(postId) {
      const postRef = db.collection('posts').doc(postId);
      postRef.update({
        votes: firebase.firestore.FieldValue.increment(1)
      });
    }
    
    function downvotePost(postId) {
      const postRef = db.collection('posts').doc(postId);
      postRef.update({
        votes: firebase.firestore.FieldValue.increment(-1)
      });
    }