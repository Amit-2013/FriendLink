// Function to handle login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    // Fetch user data from a JSON file in your repository
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            const user = data.find(user => user.username === username && user.password === password);
            if (user) {
                alert('Login successful!');
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'home.html';
            } else {
                document.getElementById('login-error').textContent = 'Invalid username or password';
            }
        })
        .catch(error => console.error('Error:', error));
});

// Function to handle logout
function logout() {
    localStorage.removeItem('loggedInUser');
}

// Function to display posts
function displayPosts() {
    const postFeed = document.getElementById('post-feed');
    postFeed.innerHTML = ''; // Clear existing posts
    // Get the logged in user from local storage
    const loggedInUser = localStorage.getItem('loggedInUser');
    // Fetch posts from a JSON file in your repository
    fetch('posts.json')
        .then(response => response.json())
        .then(posts => {
            // Filter posts by the logged in user
            const userPosts = posts.filter(post => post.username === loggedInUser);
            // Display filtered posts
            userPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post');
                postElement.innerHTML = `
                    <p><strong>${post.username}:</strong> ${post.content}</p>
                `;
                postFeed.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Function to submit a new post
function submitPost() {
    const postContent = document.getElementById('post-content').value.trim();
    if (postContent) {
        // Get the logged in user from local storage
        const loggedInUser = localStorage.getItem('loggedInUser');
        // Construct new post object
        const newPost = { username: loggedInUser, content: postContent };
        // Fetch posts from a JSON file in your repository
        fetch('posts.json')
            .then(response => response.json())
            .then(posts => {
                // Add new post to existing posts
                posts.push(newPost);
                // Save updated posts back to the JSON file
                return fetch('posts.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(posts)
                });
            })
            .then(() => {
                alert('Post submitted successfully!');
                displayPosts(); // Update post feed
                document.getElementById('post-content').value = '';
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a post content.');
    }
}

// Initial display of posts
displayPosts();
