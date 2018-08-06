$(() => {

    const app = Sammy("#container", function () {
        this.use("Handlebars", "hbs")

        this.get("index.html", getWelcomePage)

        this.post("#/register", (ctx) => {
            let username = ctx.params.username
            let password = ctx.params.password
            let repeatPass = ctx.params.repeatPass

            let usernamePattern = /^[A-Za-z]{3,}$/
            let passwordPattern = /^[A-Za-z0-9]{6,}$/

            if (!usernamePattern.test(username)) {
                notify.showError("Username should contain at least 3 characters!")
            }
            else if (!passwordPattern.test(password)) {
                notify.showError("Password should contain at least 6 characters!")

            }
            else if (password !== repeatPass) {
                notify.showError("Passwods do not match!")

            }
            else {
                auth.register(username, password).then(function (userInfo) {
                    notify.showInfo("User registration successful.")
                    auth.saveSession(userInfo)
                    ctx.redirect("#/index.html")
                }).catch(notify.handleError(err))
            }
        })

        this.post("#/login", (ctx) => {
            let username = ctx.params.username
            let password = ctx.params.password

            auth.login(username, password).then(function (userInfo) {
                notify.showInfo("Login successful.")
                auth.saveSession(userInfo)
                ctx.redirect("#/catalog")
            }).catch(notify.handleError)
        })

        this.get("#/logout", (ctx) => {
            auth.logout().then(function () {
                notify.showInfo("Logout successful.")
                sessionStorage.clear()
                ctx.redirect("#/index.html")
            }).catch(notify.handleError)
        })

        this.get("#/catalog", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
                return
            }
            postService.getAllPosts().then(function (posts) {
                posts.forEach((element, index) => {
                    element.rank = index + 1
                    element.isAuthor = element._acl.creator === sessionStorage.getItem("userId")
                    element.date = calcTime(element._kmd.ect)
                })
                ctx.isAuth = true
                ctx.posts = posts
                ctx.username = sessionStorage.getItem("username")
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    navigation: "./templates/common/navigation.hbs",
                    post: "./templates/catalog/post.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/catalog.hbs")
                })
            }).catch(notify.handleError)

        })

        this.get("#/create/post", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
                return
            }

            ctx.isAuth = sessionStorage.getItem("authtoken") !== null
            ctx.username = sessionStorage.getItem("username")
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                navigation: "./templates/common/navigation.hbs",
            }).then(function () {
                this.partial("./templates/catalog/viewCreatePost.hbs")
            })
        })

        this.post("#/create/post", (ctx) => {
            let url = ctx.params.url
            let title = ctx.params.title
            let image = ctx.params.image
            let comment = ctx.params.comment

            if (!url.startsWith("http")) {
                notify.showError("Url should start with http.")
            }
            else if (title.trim() === '') {
                notify.showError("Title should not be empty.")
            }
            else {
                postService.createPost(sessionStorage.getItem("username"), comment, url, title, image)
                    .then(function () {
                        notify.showInfo("Post created!")
                        ctx.redirect("#/catalog")
                    }).catch(notify.handleError)
            }
        })

        this.get("#/details/edit/:id", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
                return
            }
            let postId = ctx.params.id
            postService.getPostById(postId).then(function (post) {
                ctx.id=post._id
                ctx.isAuth = true
                ctx.username = sessionStorage.getItem("username")
                ctx.url=post.url
                ctx.title=post.title
                ctx.imageUrl=post.imageUrl
                ctx.description=post.description
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    navigation: "./templates/common/navigation.hbs",
                }).then(function () {
                    this.partial("./templates/catalog/viewEditPost.hbs")
                })
            }).catch(notify.handleError)
        })
        
        this.post("#/details/edit/:id", (ctx)=>{
             let postId=ctx.params.id
             let author=sessionStorage.getItem("username")
             let title=ctx.params.title
             let url=ctx.params.url
             let imageUrl=ctx.params.image
             let description=ctx.params.description
          
             postService.editPost(postId,author,description,url,title,imageUrl)
             .then(function(){
                 notify.showInfo("Post edited!")
                 ctx.redirect("#/catalog")
             }).catch(notify.handleError)
        })

        function getWelcomePage(ctx) {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.isAuth = false
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    loginForm: "./templates/forms/loginForm.hbs",
                    registerForm: "./templates/forms/registerForm.hbs"
                }).then(function () {
                    this.partial("./templates/welcome-anonymous.hbs")
                })
            }
            else {
                ctx.redirect("#/catalog")
            }
        }

        this.get("#/details/delete/:id",(ctx)=>{
            if(sessionStorage.getItem("authtoken")===null){
                ctx.redirect("#/index.html")
            }
            let id=ctx.params.id
            postService.deletePost(id).then(function(){
                notify.showInfo("Post deleted.")
                ctx.redirect("#/catalog")
            }).catch(notify.handleError)
        })

        this.get("#/myposts", (ctx)=>{
            if(sessionStorage.getItem("authtoken")===null){
                ctx.redirect("#/index.html")
                return
            }
            let username=sessionStorage.getItem("username")
            postService.getMyPosts(username).then(function (posts) {
                posts.forEach((element, index) => {
                    element.rank = index + 1
                    element.isAuthor = element._acl.creator === sessionStorage.getItem("userId")
                    element.date = calcTime(element._kmd.ect)
                })
                ctx.isAuth = true
                ctx.posts = posts
                ctx.username = username
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    navigation: "./templates/common/navigation.hbs",
                }).then(function () {
                    this.partial("./templates/catalog/myPosts.hbs")
                })
            }).catch(notify.handleError)
              })
            
              this.get("#/details/:id",(ctx)=>{
                   if(sessionStorage.getItem("authtoken")===null){
                       ctx.redirect("#/index.html")
                       return
                   }
                  let id=ctx.params.id

                   postService.getPostById(id).then(function(post){
                       async function loadPostAndComments(){
                        post.date=calcTime(post._kmd.ect)
                        ctx.post=post
                        ctx.isAuth=true
                        ctx.username=sessionStorage.getItem("username")
                        ctx.isAuthor=post._acl.creator===sessionStorage.getItem("userId")

                        await commentsService.loadComments(id).then(function (comments) {
                            comments.forEach((element,index)=>{
                                element.isAuthor=element._acl.creator===sessionStorage.getItem("userId")
                                element.name=element.author
                                element.text=element.content
                                element.date=calcTime(element._kmd.ect)
                            })
                            ctx.comments=comments
                            return
                         })

                         ctx.loadPartials({
                            header: "./templates/common/header.hbs",
                            footer: "./templates/common/footer.hbs",
                            navigation: "./templates/common/navigation.hbs"
                           }).then(function () { 
                               this.partial("./templates/catalog/postDetails.hbs")
                            })
                       }
                      loadPostAndComments() 
                   })
              })

              this.post("#/comments/create/:postId",(ctx)=>{

                   if(sessionStorage.getItem("authtoken")===null){
                       ctx.redirect("#/index.html")
                       return
                   }

                    let postId=ctx.params.postId
                    let author=sessionStorage.getItem("username")
                    let content=ctx.params.content

                    commentsService.createComment(author,content,postId).then(function(res){
                        notify.showInfo("Comment created!")
                        ctx.redirect(`#/details/${postId}`)
                    }).catch(notify.handleError)
              })

              this.get("#/comments/delete/:id",(ctx)=>{
                if(sessionStorage.getItem("authtoken")===null){
                    ctx.redirect("#/index.html")
                    return
                }
                let commentId=ctx.params.id
                  commentsService.deleteComment(commentId).then(function () {
                      ctx.redirect("#/catalog")
                    })
              })
           

        function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);

            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        }

    })

    app.run()
})