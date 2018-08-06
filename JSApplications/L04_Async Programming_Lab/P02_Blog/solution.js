function attachEvents(){
    let posts={}
    
    $("#btnLoadPosts").on("click",function(){
        $("#posts").empty()
        $.ajax({
            method:"GET",
            url:"https://baas.kinvey.com/appdata/kid_rkUgFgE5G/posts",
            headers: {
                "Authorization": "Basic " + btoa("stefan" + ":" + "stefan")
              },

        }).then(function(res){
            for(let post of res){
               let option= $("<option>").val(post._id)
                                        .text(post.title)
              $("#posts").append(option)
              posts[post.title]=post.body
            }
        })
    })
    $("#btnViewPost").on("click",function(){
         let postTitle=$("#post-title").empty()
         let postBody=$("#post-body").empty()
         let postComments=$("#post-comments").empty()

         let selOption=$("#posts option:selected")
        $.ajax({
            method:"GET",
            url:"https://baas.kinvey.com/appdata/kid_rkUgFgE5G/"+`comments/?query={"post_id":"${selOption.val()}"}`,
            headers: {
                "Authorization": "Basic " + btoa("stefan" + ":" + "stefan")
              },
        }).then(function(res){
            postTitle.text(selOption.text())
            postBody.text(posts[selOption.text()])
            
            for(let comment of res){
              let li= $("<li>").text(comment.text)
              postComments.append(li)
            }
        })
    })
}