const API_URL = 'http://127.0.0.1:5000';

// Function to handle login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.access_token);
    alert('Login successful!');
    window.location.href = 'home.html';
  } catch (error) {
    document.getElementById('login-error').textContent = error.message;
  }
});

// Function to handle posts
document.getElementById('post-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = document.getElementById('post-content').value.trim();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to post.');
    return;
  }
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create post');
    document.getElementById('post-content').value = '';
    loadPosts();
  } catch (error) {
    console.error("Error adding post: ", error);
    alert(error.message);
  }
});

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
    const response = await fetch(`${API_URL}/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to load posts');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid data format');
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

// Check login status and load user info
if (window.location.pathname.endsWith('home.html')) {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(`${API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to get user info');
        return response.json();
      })
      .then(data => {
        document.getElementById('user-info').textContent = `Logged in as: ${data.email}`;
        loadPosts();
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      });
  } else {
    window.location.href = 'index.html';
  }
}
