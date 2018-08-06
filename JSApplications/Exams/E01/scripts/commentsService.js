let commentsService=(()=>{
   
      function loadComments(postId){
         return  requester.get("appdata", `comments/?query={"postId":"${postId}"}`, "kinvey")
      }

      function createComment(author,content,postId){
          let data={
              author,content,postId
          }
          return requester.post("appdata", "comments", "kinvey", data)
      }

      function deleteComment(commentId){
          return requester.remove("appdata", `comments/${commentId}`, "kinvey")
      }
    return{
           loadComments,
           createComment,
           deleteComment
    }
})()