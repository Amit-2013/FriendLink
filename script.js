const API_URL = 'http://127.0.0.1:5000';

// Utility function for making API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  return data;
}

// Function to handle login
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  try {
    const data = await apiRequest('/login', 'POST', { email, password });
    localStorage.setItem('token', data.access_token);
    window.location.href = 'home.html';
  } catch (error) {
    document.getElementById('login-error').textContent = error.message;
  }
}

// Function to handle sign-up
async function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  try {
    await apiRequest('/signup', 'POST', { email, password });
    alert('Sign-up successful! Please log in.');
    window.location.href = 'index.html'; // Redirect to login page
  } catch (error) {
    document.getElementById('signup-error').textContent = error.message;
  }
}

// Function to handle posts
async function handlePost(event) {
  event.preventDefault();
  const content = document.getElementById('post-content').value.trim();
  try {
    await apiRequest('/posts', 'POST', { content });
    document.getElementById('post-content').value = '';
    loadPosts();
  } catch (error) {
    console.error("Error adding post: ", error);
    alert(error.message);
  }
}

// Function to handle likes
async function handleLike(postId) {
  try {
    await apiRequest(`/posts/${postId}/like`, 'POST');
    loadPosts(); // Reload posts to update like count
  } catch (error) {
    console.error("Error liking post: ", error);
    alert(error.message);
  }
}

// Function to handle following users
async function handleFollow(userId) {
  try {
    await apiRequest(`/users/${userId}/follow`, 'POST');
    loadPosts(); // Reload posts to update follow status
  } catch (error) {
    console.error("Error following user: ", error);
    alert(error.message);
  }
}

// Function to load posts
async function loadPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  try {
    const posts = await apiRequest('/posts');
    posts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h3>${post.username}</h3>
        <p>${post.content}</p>
        <small>${new Date(post.created_at).toLocaleString()}</small>
        <button class="like-btn" data-post-id="${post.id}">
          ${post.is_liked ? 'Unlike' : 'Like'} (${post.likes})
        </button>
        <button class="follow-btn" data-user-id="${post.user_id}">
          ${post.is_following ? 'Unfollow' : 'Follow'}
        </button>
      `;
      postsContainer.appendChild(postElement);
    });

    // Add event listeners for like and follow buttons
    document.querySelectorAll('.like-btn').forEach(button => {
      button.addEventListener('click', () => handleLike(button.dataset.postId));
    });
    document.querySelectorAll('.follow-btn').forEach(button => {
      button.addEventListener('click', () => handleFollow(button.dataset.userId));
    });
  } catch (error) {
    console.error("Error loading posts: ", error);
    alert(error.message);
  }
}

// Function to check login status and load user info
async function checkLoginStatus() {
  try {
    const user = await apiRequest('/user');
    document.getElementById('user-info').textContent = `Logged in as: ${user.email}`;
    loadPosts();
  } catch (error) {
    console.error("Error fetching user info:", error);
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// Function to handle logout
function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  } else {
    console.error('Login form not found');
  }

  // Signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  // Post form
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', handlePost);
  }

  // Logout button
  const logoutButton = document.getElementById('logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }

  // Check login status on home page
  if (window.location.pathname.endsWith('home.html')) {
    checkLoginStatus();
  }
});
