import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to handle login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    alert('Login successful!');
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
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
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
  const user = supabase.auth.user();

  if (user) {
    try {
      const { error } = await supabase.from('posts').insert([{ content, username: user.email }]);
      if (error) throw error;
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
  const { data: posts, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Error loading posts: ", error);
    return;
  }

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
}

document.getElementById('logout')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

if (window.location.pathname.endsWith('home.html')) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      document.getElementById('user-info').textContent = `Logged in as: ${session.user.email}`;
      loadPosts();
    } else {
      window.location.href = 'index.html';
    }
  });
}
