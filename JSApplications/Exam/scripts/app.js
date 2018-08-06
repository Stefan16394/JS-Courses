$(() => {

    const app = Sammy("#container", function () {
        this.use("Handlebars", "hbs")

        this.get("index.html", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.loadPartials({
                    loginForm: "./templates/forms/loginForm.hbs",
                    registerForm: "./templates/forms/registerForm.hbs",
                    footer: "./templates/common/footer.hbs"
                }).then(function () {
                    this.partial("./templates/WelcomeUnauthPage.hbs")
                })
            }
            else {
                ctx.redirect("#/home")
            }
        })


        this.post("#/register", (ctx) => {
            let username = ctx.params["username-register"]
            let password = ctx.params["password-register"]
            let repeatPass = ctx.params["password-register-check"]

            if (username.trim().length < 5) {
                notify.showError("Username should contain at least 5 characters long!")
            }
            else if (password.trim() === "") {
                notify.showError("Password should not be empty!")
            }
            else if (password !== repeatPass) {
                notify.showError("Passwods do not match!")
            }
            else {
                auth.register(username, password).then(function (userInfo) {
                    notify.showInfo("User registration successful.")
                    auth.saveSession(userInfo)
                    ctx.redirect("#/index.html")
                }).catch(notify.handleError)
            }
        })

        this.post("#/login", (ctx) => {
            let username = ctx.params["username-login"]
            let password = ctx.params["password-login"]

            if (username.trim().length < 5) {
                notify.showError("Username should contain at least 5 characters long!")
            }
            else if (password.trim() === "") {
                notify.showError("Password should not be empty!")
            }
            else {
                auth.login(username, password).then(function (userInfo) {
                    notify.showInfo("Login successful.")
                    auth.saveSession(userInfo)
                    ctx.redirect("#/index.html")
                }).catch(notify.handleError)
            }
        })

        this.get("#/logout", (ctx) => {
            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }
            auth.logout().then(function () {
                notify.showInfo("Logout successful.")
                sessionStorage.clear()
                ctx.redirect("#/index.html")
            }).catch(notify.handleError)
        })

        this.get("#/home", (ctx) => {
        
            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }

            receiptService.getActiveReceipt().then(function (res) {
                
                performRequests()
               
                async function performRequests() {
                    if (res.length === 0) {
                        let data = {
                            "active": 'true',
                            "productCount": 0,
                            "total": 0
                        }
                        let receiptId;
                        await receiptService.createReceipt(data).then(function (response) {
                            receiptId = response._id
                            ctx.receiptId = receiptId
                        })
                        await receiptService.getProductsByReceiptId(receiptId).then(function (products) {
                            let totalPriceOfProducts = 0
                            for (let product of products) {
                                product.total = product.price * product.qty
                                totalPriceOfProducts += product.total
                            }
                            ctx.total = totalPriceOfProducts.toFixed(2)
                            ctx.products = products
                        })
                    }
                    else {
                        await receiptService.getProductsByReceiptId(res[0]._id).then(function (products) {
                            ctx.receiptId = res[0]._id
                            let totalPriceOfProducts = 0
                            for (let product of products) {
                                product.total = product.price * product.qty
                                totalPriceOfProducts += product.total
                            }
                            ctx.total = totalPriceOfProducts.toFixed(2)
                            ctx.products = products
                        })
                    }
                     ctx.name=sessionStorage.getItem("username")
                    ctx.loadPartials({
                        navigation: "./templates/common/navigation.hbs",
                        footer: "./templates/common/footer.hbs",
                        createReceipt: "./templates/receipt/createReceipt.hbs",
                        product: "./templates/receipt/product.hbs"
                    }).then(function () {
                        this.partial("./templates/home/homeView.hbs")
                    })
                }

            })
        })

        this.post("#/checkout/:id",(ctx)=>{
            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }

            let receiptId=ctx.params.id
            receiptService.getReceiptById(receiptId).then(function (receipt) {
              
                if(Number(receipt.productCount)===0){
                    notify.showError("Cannot check out empty receipt!")
                }
                else{
                    let updateData = {
                        "active": "false",
                        "productCount": Number(receipt.productCount) ,
                        "total": Number(receipt.total)
                    }
                    receiptService.updateAfterModifyingProduct(receiptId, updateData).then(function (response) {
                        notify.showInfo("Receipt cheked out.")
                        ctx.redirect("#/home")
                    })
                }
            })
                      
        })

        this.post("#/crproduct/:id", (ctx) => {

            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }

            let type = ctx.params.type
            let qty = ctx.params.qty
            let price = ctx.params.price
            let receiptId = ctx.params.id

            if (type.trim() === '') {
                notify.showError("Product name should not be empty.")
            }
            else if (isNaN(qty) || qty.trim() === '' || qty<=0) {
                notify.showError("Quantity should be a positive number.")
            }
            else if (isNaN(price) || price.trim() === '' || price<=0) {
                notify.showError("Price should be a positive number.")
            }
            else {

                receiptService.getReceiptById(receiptId).then(function (receipt) {
                    let updateData = {
                        "active": "true",
                        "productCount": Number(receipt.productCount) + Number(qty),
                        "total": Number(receipt.total) + Number(qty) * Number(price)
                    }
                    receiptService.updateAfterModifyingProduct(receiptId, updateData).then(function (response) {

                        let data = {
                            type,
                            qty,
                            price,
                            receiptId
                        }
                        receiptService.createNewProduct(data).then(function (res) {
                            notify.showInfo("Entry created.")
                            ctx.redirect("#/home")
                        })
                    })
                })
            }

        })

        this.get("#/delete/:id", (ctx) => {

            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }

            let id = ctx.params.id
            receiptService.getProductById(id).then(function (product) {
                let receiptId=product.receiptId
                 receiptService.getReceiptById(receiptId).then(function (res) {
                    
                       let updateData = {
                        "active": "true",
                        "productCount": Number(res.productCount) - Number(product.qty),
                        "total": Number(res.total) - Number(product.qty) * Number(product.price)
                       }

                    receiptService.updateAfterModifyingProduct(receiptId, updateData).then(function (response) {
                        receiptService.deleteProduct(id).then(function () {
                            notify.showInfo("Product removed.")
                            ctx.redirect("#/home")
                        })
    
                    })
                   })
            })
        })

        this.get("#/myreceipts",(ctx)=>{
         
            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }

            let id=sessionStorage.getItem("userId")
               receiptService.getMyReceipts(id).then(function (res) {
                   let total=0
                   for(let receipt of res){
                        total+=Number(receipt.total)
                   }
                   ctx.total=total
                     ctx.receipts=res
                    ctx.name=sessionStorage.getItem("username")
                     ctx.loadPartials({
                         footer:"./templates/common/footer.hbs",
                         navigation:"./templates/common/navigation.hbs",
                         receipt:"./templates/receipt/receiptDetails.hbs"
                     }).then(function () {
                         this.partial("./templates/receipt/myReceipts.hbs")
                       })
                 })
        })

        this.get("#/receipt/:id",(ctx)=>{

            if(!auth.isAuth()){
                ctx.redirect("#/index.html")
                return
            }

              let id=ctx.params.id
              receiptService.getProductsByReceiptId(id).then(function (products) {
                   for(let product of products){
                       product.total=(product.qty*product.price).toFixed(2)
                   }
                   ctx.products=products
                   ctx.name=sessionStorage.getItem("username")
                   ctx.loadPartials({
                    footer:"./templates/common/footer.hbs",
                    navigation:"./templates/common/navigation.hbs",
                   }).then(function () {
                       this.partial("./templates/receipt/receiptProductDetails.hbs")
                     })
                })
        })
    })

    app.run()
})