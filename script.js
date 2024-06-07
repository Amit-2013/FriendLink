// Load existing posts from local storage when the page loads
window.onload = function() {
    var storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
        try {
            var postFeed = document.getElementById('post-feed');
            postFeed.innerHTML = storedPosts;
        } catch (error) {
            console.error('Error loading posts from local storage:', error);
        }
    }
}

function submitPost() {
    var postContent = document.getElementById('post-content').value;
    if (postContent.trim() !== '') {
        var postFeed = document.getElementById('post-feed');
        var post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = '<p>' + postContent + '</p>';
        postFeed.insertBefore(post, postFeed.firstChild);
        document.getElementById('post-content').value = '';

        // Save posts to local storage
        try {
            localStorage.setItem('posts', postFeed.innerHTML);
        } catch (error) {
            console.error('Error saving posts to local storage:', error);
        }
    }
}
