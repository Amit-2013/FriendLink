// Function to handle login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const savedUser = localStorage.getItem(username);
    if (savedUser) {
        const savedPassword = JSON.parse(savedUser).password;
        if (savedPassword === password) {
            alert('Login successful!');
            // For demonstration purposes, redirecting to a success page
            window.location.href = 'home.html';
            localStorage.setItem('loggedInUser', username); // Store logged in user in localStorage
        } else {
            document.getElementById('login-error').textContent = 'Invalid password';
        }
    } else {
        document.getElementById('login-error').textContent = 'User not found';
    }
});

// Function to handle sign up
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const savedUser = localStorage.getItem(username);
    if (savedUser) {
        document.getElementById('signup-error').textContent = 'Username already exists';
    } else {
        localStorage.setItem(username, JSON.stringify({ username, password }));
        alert('Sign up successful! Please log in.');
        window.location.href = 'index.html'; // Redirect to login page after sign up
    }
});

// Function to display posts
function displayPosts() {
    const postFeed = document.getElementById('post-feed');
    postFeed.innerHTML = ''; // Clear existing posts

    // Get the logged in user from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // Retrieve all posts from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== 'loggedInUser') { // Exclude the loggedInUser key
            const post = JSON.parse(localStorage.getItem(key));
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p><strong>${post.username}:</strong> ${post.content}</p>
            `;
            postFeed.appendChild(postElement);
        }
    }
}

// Function to submit a new post
function submitPost() {
    const postContent = document.getElementById('post-content').value.trim();
    if (postContent) {
        // Get the logged in user from localStorage
        const loggedInUser = localStorage.getItem('loggedInUser');
        
        // Store the new post in localStorage
        const timestamp = Date.now(); // Generate unique timestamp for post key
        localStorage.setItem(timestamp, JSON.stringify({ username: loggedInUser, content: postContent }));
        
        displayPosts(); // Update post feed
        document.getElementById('post-content').value = '';
    } else {
        alert('Please enter a post content.');
    }
}

// Initial display of posts
displayPosts();
