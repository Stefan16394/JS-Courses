const handlers={};
$(() => {

    const app = Sammy("#main", function () {

        this.use("Handlebars", "hbs")
       
        this.get("index.html", handlers.homeHandler)

        this.get("#/register", (ctx)=>{
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                navigation: './templates/common/navigation.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function () {
                this.partial('./forms/registerForm.hbs')
              })
        })

       this.post("#/register",(ctx)=>{
           let username=ctx.params.username
           let password=ctx.params.password
           let repeatPass=ctx.params.passwordRep
           
           if(password!==repeatPass){
               alert("Passwords do not match.")
           }
           else{
               auth.register(username, password);
               ctx.redirect("#/index.html")
           }
       })

        this.post("#/login" ,(ctx)=>{
        let username=ctx.params.username
        let password=ctx.params.password
         
        auth.login(username, password)
                .then((userData) => {
                    auth.saveSession(userData);
                    ctx.redirect('#/index.html');
                })
                .catch(console.error);   
       })
    
    })

    app.run()

});
