$(() => {

    const app = Sammy("#main", function () {
        this.use("Handlebars", "hbs")

        this.get("index.html", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/register")
            }
            else {
                ctx.redirect("#/home")
            }
        })

        this.get("#/register", (ctx) => {
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial("./templates/forms/registerForm.hbs")
            })
        })

        this.post("#/register", (ctx) => {
            let username = ctx.params.username
            let password = ctx.params.password
            let repeatPass = ctx.params.repeatPass

            let usernamePattern = /^.{5,}$/

            if (!usernamePattern.test(username)) {
                notify.showError("Username should be at least 5 characters long.")
            }
            else if (password.trim() === '') {
                notify.showError("Password should not be empty.")
            }
            else if (password !== repeatPass) {
                notify.showError("Passwords do not match.")
            }
            else {
                auth.register(username, password).then(function (userInfo) {
                    notify.showInfo("User registration successful.")
                    auth.saveSession(userInfo)
                    ctx.redirect("#/home")
                }).catch(notify.handleError)
            }

        })

        this.get("#/login", (ctx) => {
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs"
            }).then(function () {
                this.partial("./templates/forms/loginForm.hbs")
            })
        })

        this.post("#/login", (ctx) => {
            let username = ctx.params.username
            let password = ctx.params.password

            auth.login(username, password).then(function (userInfo) {
                notify.showInfo("Login successful.")
                auth.saveSession(userInfo)
                ctx.redirect("#/home")
            }).catch(notify.handleError)
        })

        this.get("#/logout", (ctx) => {
            auth.logout().then(function () {
                notify.showInfo("Logout successful.")
                sessionStorage.clear()
                ctx.redirect("#/index.html")
            }).catch(notify.handleError)
        })

        this.get("#/home", (ctx) => {

            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            let username = sessionStorage.getItem("username")
            let subs = sessionStorage.getItem("subscriptions")

            async function performRequests() {
                await chirpService.getChirpsByUsername(username).then(function (chirps) {
                    ctx.myChirps = chirps.length
                })

                await chirpService.getUserByUsername(username).then(function (userInfo) {
                    let following = userInfo[0].subscriptions.length
                    ctx.following = following
                })

                await chirpService.getFollowersForUsername(username).then(function (followers) {
                    ctx.followers = followers.length
                })


                await chirpService.listAllChripsFromSubs(subs).then(function (chirps) {
                    for (let chirp of chirps) {
                        chirp.date = calcTime(chirp._kmd.ect)
                        chirp.creator = chirp.author
                    }
                    ctx.chirps = chirps
                }).catch(function (err) {
                    console.log("ne")
                })

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    navigation: "./templates/common/navigation.hbs",
                    chirp: "./templates/authView/chirp.hbs"
                }).then(function () {
                    this.partial("./templates/authView/home.hbs")
                })
            }
            performRequests()

        })

        this.post("#/create", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            let text = ctx.params.text
            let author = sessionStorage.getItem("username")
            if (text.trim() === '') {
                notify.showError("Text should not be empty.")
            }
            else if (text.length > 150) {
                notify.showError("Text should be less than 150 characters")
            }
            else {
                let data = {
                    author,
                    text
                }
                chirpService.createChirp(data).then(function (res) {
                    notify.showInfo("Chirp created.")
                    ctx.redirect("#/myChirps")
                }).catch(notify.handleError)
            }
        })

        this.get("#/myChirps", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            let username = sessionStorage.getItem("username")
            let subs = sessionStorage.getItem("subscriptions")

            async function performRequests() {
                chirpService.getChirpsByUsername(username).then(function (chirps) {
                    for (let chirp of chirps) {
                        chirp.date = calcTime(chirp._kmd.ect)
                        chirp.isAuthor = chirp.author === username
                        chirp.creator = chirp.author

                    }
                    ctx.chirps = chirps
                    ctx.myChirps = chirps.length
                })

                await chirpService.getUserByUsername(username).then(function (userInfo) {
                    let following = userInfo[0].subscriptions.length
                    ctx.following = following
                })

                await chirpService.getFollowersForUsername(username).then(function (followers) {
                    ctx.followers = followers.length
                })


                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    navigation: "./templates/common/navigation.hbs",
                    chirp: "./templates/authView/chirp.hbs"
                }).then(function () {
                    this.partial("./templates/authView/myChirps.hbs")
                })
            }
            performRequests()

        })

        this.get("#/delete/:id", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            let id = ctx.params.id

            chirpService.deleteChirp(id).then(function () {
                notify.showInfo("Chirp deleted.")
                ctx.redirect("#/myChirps")
            })


        })

        this.get("#/author/:creator", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            let username = ctx.params.creator

            async function performRequests() {

                await chirpService.getUserByUsername(username).then(function (userInfo) {
                    let following = userInfo[0].subscriptions.length
                    ctx.following = following
                })

                await chirpService.getChirpsByUsername(username).then(function (chirps) {
                    for (let chirp of chirps) {
                        chirp.date = calcTime(chirp._kmd.ect)
                        chirp.isAuthor = chirp.author === sessionStorage.getItem("username")
                        chirp.creator = chirp.author
                    }
                    ctx.chirps = chirps
                    ctx.userChirps = chirps.length
                })

                await chirpService.getFollowersForUsername(username).then(function (followers) {
                    ctx.followers = followers.length
                })

                ctx.author = username
                ctx.isFollowing = sessionStorage.getItem("subscriptions").indexOf(username) !== -1
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    navigation: "./templates/common/navigation.hbs",
                    chirp: "./templates/authView/chirp.hbs"
                }).then(function () {
                    this.partial("./templates/authView/viewProfile.hbs")
                })
            }
            performRequests()
        })

        this.get("#/discover", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            chirpService.getAllUsers().then(function (users) {
                users = users.filter(x => x.username !== sessionStorage.getItem("username"))
                ctx.users = users
                performRequests()

                async function performRequests() {
                    for (let user of users) {
                        await chirpService.getFollowersForUsername(user.username).then(function (res) {
                            user.followers = res.length
                        })
                    }

                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        navigation: "./templates/common/navigation.hbs",
                        user: "./templates/authView/user.hbs"
                    }).then(function () {
                        this.partial("./templates/authView/discoverView.hbs")
                    })
                }

            })
        })

        this.get("#/follow/:author", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }
            let user = ctx.params.author
            let subs = JSON.parse(sessionStorage.getItem("subscriptions"))
            subs.push(user)
            let data = {
                subscriptions: subs
            }
            chirpService.follow(data).then(function (res) {
                notify.showInfo("Subscribed!")
                sessionStorage.setItem("subscriptions", JSON.stringify(subs))
                ctx.redirect(`#/author/${user}`)
            })
        })

        this.get("#/unfollow/:author", (ctx) => {
            if (sessionStorage.getItem("authtoken") === null) {
                ctx.redirect("#/index.html")
            }

            let user = ctx.params.author
            let subs = JSON.parse(sessionStorage.getItem("subscriptions"))
            subs = subs.filter(x => x !== user)
            let data = {
                subscriptions: subs
            }
            chirpService.follow(data).then(function (res) {
                notify.showInfo("Subscribed!")
                sessionStorage.setItem("subscriptions", JSON.stringify(subs))
                ctx.redirect(`#/author/${user}`)
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