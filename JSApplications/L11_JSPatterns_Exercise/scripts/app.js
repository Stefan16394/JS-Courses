$(() => {
    
    const app = Sammy('#main', function () {
        this.use("Handlebars", "hbs")

        this.get("index.html", displayHome)
    
        this.get("#/home",displayHome)
       
        this.get("#/about",function(ctx){
            ctx.loggedIn=sessionStorage.getItem("authtoken")!==null
            ctx.username=sessionStorage.getItem("username")
            this.loadPartials({
                header:'./templates/common/header.hbs',
                footer:"./templates/common/footer.hbs"
            }).then(function () {
                 this.partial("./templates/about/about.hbs")
              })
        })

        this.get("#/login",function(ctx){
             ctx.loadPartials({
                  header:'./templates/common/header.hbs',
                  footer:"./templates/common/footer.hbs",
                  loginForm:'./templates/login/loginForm.hbs'
             }).then(function(){
                  this.partial("./templates/login/loginPage.hbs")
             })
        })

        this.post("#/login",function (ctx) {
             let username=ctx.params.username
             let password=ctx.params.password

             auth.login(username,password).then(function (userInfo) {
                   auth.saveSession(userInfo)
                   auth.showInfo("Logged in!")
                   ctx.redirect("#/index.html")
               }).catch(auth.handleError)
          })

          this.get("#/logout",function (ctx) {
                auth.logout().then(function () {
                    sessionStorage.clear()
                    auth.showInfo("Logged Out!")
                    ctx.redirect("#/index.html")
                  }).catch(auth.handleError)
            })

            this.get("#/register",function (ctx) {

                  ctx.loggedIn=sessionStorage.getItem('authtoken')!==null
                  ctx.username=sessionStorage.getItem('username')

                  ctx.loadPartials({
                    header:"./templates/common/header.hbs",
                    footer:"./templates/common/footer.hbs",
                    registerForm:"./templates/register/registerForm.hbs"
                  }).then(function() {
                      this.partial("./templates/register/registerPage.hbs")
                  }) 
              })

              this.post("#/register",function (ctx) {
                   let username=ctx.params.username
                   let password=ctx.params.password
                   let repeatPassword=ctx.params.repeatPassword
                   
                   if(password!==repeatPassword){
                       auth.showError("Passwords do not match!")
                   }
                   else{
                       auth.register(username,password).then(function (userInfo) {
                           auth.saveSession(userInfo)
                           auth.showInfo("Registered successfully!")
                           ctx.redirect("#/index.html")
                         }).catch(auth.handleError)
                   }
                })

                this.get("#/catalog", displayCatalog) 
                 
                this.get("#/create",function(ctx){
                    ctx.loadPartials({
                        header:'./templates/common/header.hbs',
                        footer:"./templates/common/footer.hbs",
                        createForm:"./templates/create/createForm.hbs"
                    }).then(function () {
                        this.partial("./templates/create/createPage.hbs")
                      })
                })

                this.post("#/create",function(ctx){
                    let teamName=ctx.params.name
                    let teamDescription=ctx.params.comment
                     
                    teamsService.createTeam(teamName,teamDescription).then(function (teamInfo) {
                         teamsService.joinTeam(teamInfo._id).then(function (userInfo) {
                               auth.saveSession(userInfo)
                               auth.showInfo(`Team ${teamName} created!`)
                               ctx.redirect("#/catalog")
                           }).catch(auth.handleError)

                      }).catch(auth.handleError)

                })

                this.get("#/catalog/:id",function(ctx){
                    let id=ctx.params.id.substr(1)
                    teamsService.getAllUsers().then(function (res) {
                          let teamMembers=res.filter(x=>x.teamId===id)
                        
                          teamsService.loadTeamDetails(id).then(function (teamInfo) {
                            ctx.loggedIn=sessionStorage.getItem('authtoken')!==null
                            ctx.username=sessionStorage.getItem('username')
                            ctx.teamId=id
                            ctx.isAuthor=teamInfo._acl.creator===sessionStorage.getItem("userId")
                            ctx.isOnTeam= teamInfo._id===sessionStorage.getItem("teamId")
                            ctx.comment=teamInfo.comment
                            ctx.name=teamInfo.name
                            ctx.members=teamMembers
    
                            ctx.loadPartials({
                                header:'./templates/common/header.hbs',
                                footer:"./templates/common/footer.hbs",
                                teamControls:"./templates/catalog/teamControls.hbs",
                                teamMember:"./templates/catalog/teamMember.hbs"
                            }).then(function(){
                                this.partial("./templates/catalog/details.hbs")
                            })
                          }).catch(auth.handleError)
                      })
                  
                })

                this.get("#/join/:id",function (ctx) {
                        let id=ctx.params.id.substr(1)

                        teamsService.joinTeam(id).then(function (userInfo) {
                              auth.saveSession(userInfo)
                              auth.showInfo("Joined team!")
                              ctx.redirect("#/catalog")
                          }).catch(auth.handleError)
                  })

                  this.get('#/leave',function(ctx){
                      teamsService.leaveTeam().then(function(userInfo){
                            auth.saveSession(userInfo)
                            auth.showInfo("Left team!")
                            ctx.redirect("#/catalog")
                      }).catch(auth.handleError)
                  })

                  this.get("#/edit/:id",function (ctx) {
                      let id=ctx.params.id.substr(1)
                      teamsService.loadTeamDetails(id).then(function (teamInfo) {
                          ctx.name=teamInfo.name
                          ctx.comment=teamInfo.comment
                          ctx.teamId=id

                          ctx.loadPartials({
                            header:'./templates/common/header.hbs',
                            footer:"./templates/common/footer.hbs",
                            editForm:"./templates/edit/editForm.hbs"
                          }).then(function () {
                              this.partial("./templates/edit/editPage.hbs")
                            })
                        }).catch(auth.handleError)
                    })

                    this.post("#/edit/:id",function (ctx) {
                          let teamId=ctx.params.id.substr(1)
                          let name=ctx.params.name
                          let comment=ctx.params.comment
                         
                          teamsService.edit(teamId,name,comment).then(function (teamInfo) {
                               auth.showInfo(`Team ${name} edited!`)
                               ctx.redirect("#/catalog")
                            }).catch(auth.handleError)
                        })

        function displayHome(ctx){
            ctx.loggedIn=sessionStorage.getItem("authtoken")!==null
            ctx.username=sessionStorage.getItem("username")
            ctx.hasTeam=sessionStorage.getItem("teamId")!==null
            ctx.teamId=sessionStorage.getItem("teamId")

            ctx.loadPartials({
                header:'./templates/common/header.hbs',
                footer:"./templates/common/footer.hbs",
            }).then(function(){
                this.partial('./templates/home/home.hbs')
            })
        }

        function displayCatalog(ctx){
            ctx.loggedIn=sessionStorage.getItem('authtoken')!==null
            ctx.username=sessionStorage.getItem('username')

            teamsService.loadTeams().then(function (teams) {
                ctx.hasNoTeam = sessionStorage.getItem("teamId") === null
                || sessionStorage.getItem("teamId")=== "undefined"
                ctx.teams = teams

             ctx.loadPartials({
                 header:"./templates/common/header.hbs",
                 footer:"./templates/common/footer.hbs",
                 team:'./templates/catalog/team.hbs',
             }).then(function () {
                 this.partial("./templates/catalog/teamCatalog.hbs")
               })
              })
        }
      
    });

    app.run();
});