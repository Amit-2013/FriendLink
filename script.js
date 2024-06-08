import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeg5nCDJnwmsSPgfV4YcOrS1NA8OjgeYA",
  authDomain: "friendlink12.firebaseapp.com",
  projectId: "friendlink12",
  storageBucket: "friendlink12.appspot.com",
  messagingSenderId: "8176686531",
  appId: "1:8176686531:web:2bb7d6e805fc89b59c9976",
  measurementId: "G-7SHZZRVELE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to handle login
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
  const user = auth.currentUser;

  if (user) {
    try {
      await addDoc(collection(db, "posts"), {
        content,
        username: user.email,
        timestamp: new Date()
      });
      document.getElementById('post-content').value = '';
      loadPosts();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }
});

// Function to load posts
async function loadPosts() {
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h3>${post.username}</h3>
      <p>${post.content}</p>
      <small>${post.timestamp.toDate().toLocaleString()}</small>
    `;
    postsContainer.appendChild(postElement);
  });
}

document.getElementById('logout')?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

if (window.location.pathname === '/home.html') {
  auth.onAuthStateChanged((user) => {
    if (user) {
      document.getElementById('user-info').textContent = `Logged in as: ${user.email}`;
      loadPosts();
    } else {
      window.location.href = 'index.html';
    }
  });
}
