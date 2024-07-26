// Function to handle login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    const response = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    alert('Login successful!');
    localStorage.setItem('token', data.token);
    window.location.href = 'home.html';
  } catch (error) {
    document.getElementById('login-error').textContent = error.message;
  }
});

// Function to handle sign up
document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    const response = await fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    alert('Sign up successful! Please log in.');
    window.location.href = 'index.html';
  } catch (error) {
    document.getElementById('signup-error').textContent = error.message;
  }
});

// Function to handle posts
document.getElementById('post-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = document.getElementById('post-content').value.trim();
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://127.0.0.1:5000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      document.getElementById('post-content').value = '';
      loadPosts();
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  }
});

// Function to load posts
async function loadPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  try {
    const response = await fetch('http://127.0.0.1:5000/posts');
    const posts = await response.json();
    posts.forEach((post) => {
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
  }
}

document.getElementById('logout')?.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

if (window.location.pathname.endsWith('home.html')) {
  const token = localStorage.getItem('token');
  if (token) {
    fetch('http://127.0.0.1:5000/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById('user-info').textContent = `Logged in as: ${data.email}`;
        loadPosts();
      })
      .catch(() => {
        window.location.href = 'index.html';
      });
  } else {
    window.location.href = 'index.html';
  }
}
