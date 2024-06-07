// Simulated posts data (replace with actual data if available)
const posts = [
    { username: 'User1', content: 'This is post 1' },
    { username: 'User2', content: 'This is post 2' },
    { username: 'User3', content: 'This is post 3' }
];

// Function to display posts
function displayPosts() {
    const postFeed = document.getElementById('post-feed');
    postFeed.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <p><strong>${post.username}:</strong> ${post.content}</p>
        `;
        postFeed.appendChild(postElement);
    });
}

// Function to submit a new post
function submitPost() {
    const postContent = document.getElementById('post-content').value.trim();
    if (postContent) {
        // Simulate adding a new post (replace with actual WebSocket logic)
        posts.unshift({ username: 'User', content: postContent });
        displayPosts();
        document.getElementById('post-content').value = '';
    } else {
        alert('Please enter a post content.');
    }
}

// Initial display of posts
displayPosts();
