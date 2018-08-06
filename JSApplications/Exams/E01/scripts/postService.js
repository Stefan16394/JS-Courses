let postService = (() => {

    function getAllPosts() {
        return requester.get("appdata", `posts?query={}&sort={"_kmd.ect": -1}`, 'kinvey')
    }

    function createPost(author, description, url, title, imageUrl) {
        let data = {
            author, description, url, title, imageUrl
        }
        return requester.post("appdata", "posts", 'kinvey', data)
    }

    function editPost(postId, author, description, url, title, imageUrl) {
        let data = {
            author, description, url, title, imageUrl
        }
        return requester.update("appdata", `posts/${postId}`, 'kinvey', data)
    }

    function deletePost(postId) {
        return requester.remove('appdata',`posts/${postId}`,'kinvey')
    }

    function getMyPosts(username) {
       return requester.get("appdata",`posts?query={"author":"${username}"}&sort={"_kmd.ect": -1}`,'kinvey')
    }

    function getPostById(id) {
       return requester.get("appdata",`posts/${id}`,'kinvey')
    }


    return {
        getAllPosts,
        createPost,
        editPost,
        deletePost,
        getMyPosts,
        getPostById
    }
})()