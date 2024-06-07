function submitPost() {
    var postContent = document.getElementById('post-content').value;
    if (postContent.trim() !== '') {
        var postFeed = document.getElementById('post-feed');
        var post = document.createElement('div');
        post.className = 'post';
        post.innerHTML = '<p>' + postContent + '</p>';
        postFeed.insertBefore(post, postFeed.firstChild);
        document.getElementById('post-content').value = '';
    }
}
