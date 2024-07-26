const API_URL = 'http://127.0.0.1:5000';

// Utility function for making API requests
async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
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
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    const data = await apiRequest('/login', 'POST', { email, password });
    localStorage.setItem('token', data.access_token);
    alert('Login successful!');
    window.location.href = 'home.html';
  } catch (error) {
    document.getElementById('login-error').textContent = error.message;
  }
}

// Function to handle sign-up
async function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
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
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to post.');
    return;
  }
  try {
    await apiRequest('/posts', 'POST', { content }, token);
    document.getElementById('post-content').value = '';
    loadPosts();
  } catch (error) {
    console.error("Error adding post: ", error);
    alert(error.message);
  }
}

// Function to load posts
async function loadPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found");
    return;
  }
  try {
    const data = await apiRequest('/posts', 'GET', null, token);
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format');
    }
    data.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.className = 'post';
      postElement.innerHTML = `
        <h3>${post.username}</h3>
        <p>${post.content}</p>
        <small>${new Date(post.created_at).toLocaleString()}</small>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error loading posts: ", error);
    alert(error.message);
  }
}

// Function to check login status and load user info
async function checkLoginStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const data = await apiRequest('/user', 'GET', null, token);
      document.getElementById('user-info').textContent = `Logged in as: ${data.email}`;
      loadPosts();
    } catch (error) {
      console.error("Error fetching user info:", error);
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    }
  } else {
    window.location.href = 'index.html';
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);

  // Signup form
  document.getElementById('signup-form')?.addEventListener('submit', handleSignup);

  // Post form
  document.getElementById('post-form')?.addEventListener('submit', handlePost);

  // Check login status on home page
  if (window.location.pathname.endsWith('home.html')) {
    checkLoginStatus();
  }
});
