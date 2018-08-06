const BASE_URL = "https://baas.kinvey.com/"
const APP_KEY = "kid_Bki5M1jcG"
const APP_SECRET = "17553970d4ba4f01a7e850d488c5a5e9"
function startApp() {
    showAndHideMenuViews()
    showHomeView()
    //menu views
    function showAndHideMenuViews() {
 
        showMenuViews()

        if (sessionStorage.getItem("authToken") !== null) {
            $("#linkListAds").show()
            $("#linkCreateAd").show()
            $("#linkLogout").show()
        }
        else {
            $("#linkRegister").show()
            $("#linkLogin").show()
        }
    }

    function showView(selector) {
        $("main > section").hide()
        $(selector).show()
    }

    function showMenuViews() {
        $("#menu a").hide()
        $("#linkHome").show()
    }

    function showHomeView() {
        showView("#viewHome")
    }

    function showRegisterView() {
        showView("#viewRegister")
        $('#formRegister').trigger('reset')
    }

    function showLoginView() {
        showView("#viewLogin")
        $('#formLogin').trigger('reset')
    }

    function showInfoBox(message) {
        let infoBox = $("#infoBox").text(message).show()

        setTimeout(function () {
            infoBox.fadeOut()
        }, 2000)
    }

    function showErrorBox(message) {
        $("#errorBox").text(message).show()
    }

    function showLoadingBox() {
        $("#loadingBox").toggle()
    }

    function showCreateAdd() {
        showView("#viewCreateAd")
        $("#formCreateAd").trigger("reset")
    }

    function showSingleAdView() {
        showView("#viewSingleAdd")
    }


    //attach events
    $("#linkHome").on("click", showHomeView)

    $("#linkRegister").on("click", showRegisterView)

    $("#linkLogin").on("click", showLoginView)

    $("#linkLogout").on("click", function () {
        sessionStorage.clear()
        showView("#viewHome")
        showAndHideMenuViews()
        showInfoBox("Logged out succesfully!")
    })

    $("#buttonRegisterUser").on("click", function () {
        let username = $("#formRegister input[name=username]").val()
        let password = $("#formRegister input[name=passwd]").val()
        $.ajax({
            method: "POST",
            url: BASE_URL + "user/" + APP_KEY + "/",
            headers: {
                'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)
            },
            data: {
                username,
                password
            }
        }).then(function (res) {
            showView("#viewHome")
            showInfoBox("Registered succesfully!")

        }).catch(function (err) {
            showErrorBox("Error!")
        })
    })

    $("#buttonLoginUser").on("click", function () {
        let username = $("#formLogin input[name=username]").val()
        let password = $("#formLogin input[name=passwd]").val()
        showLoadingBox()
        $.ajax({
            method: "POST",
            url: BASE_URL + "user/" + APP_KEY + "/login",
            headers: {
                'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)
            },
            data: {
                username,
                password
            }
        }).then(function (res) {
            showView("#viewHome")
            sessionStorage.setItem("authToken", res._kmd.authtoken)
            sessionStorage.setItem("username", res.username)
            sessionStorage.setItem("usernameID", res._id)

            showInfoBox("Logged in succesfully!")
            showAndHideMenuViews()

        }).catch(function (err) {
            showLoadingBox()
            showErrorBox("Wrong username/password")
        })
    })

    $("#linkListAds").on("click", loadAds)

    function loadAds() {
        $.ajax({
            method: "GET",
            url: BASE_URL + "appdata/" + APP_KEY + "/products",
            headers: {
                "Authorization": "Kinvey " + sessionStorage.getItem("authToken")
            }
        }).then(function (res) {
            res = res.sort((x, y) => y.views - x.views)
            clearTableRows()
            showView("#viewAds")
            for (let ad of res) {
                let newAdd = $(`<tr>
                 <td>${ad.title}</td>
                 <td>${ad.publisher}</td>
                 <td>${ad.description}</td>
                 <td>${ad.price}</td>
                 <td>${ad.date}</td></tr>`)

                let td = $("<td>")
                    .append($(`<a href="#">[ReadMore]</a>`).on("click", function () {
                        showSingleAdView()
                        increaseViewsOnClick(ad)
                        $("#adTitle").text(ad.title)
                        $("#adDescr").text(ad.description)
                        $("#adPublisher").text(ad.publisher)
                        $("#adDate").text(ad.date)
                        $("#image").attr("src", ad.imgURL)
                        $("#adViews").text(ad.views)
                    }))

                if (ad._acl.creator === sessionStorage.getItem("usernameID")) {
                    td.append($(`<a href="#">[Delete]</a>`).on("click", function () {
                        $.ajax({
                            method: "DELETE",
                            url: BASE_URL + "appdata/" + APP_KEY + "/products/" + ad._id,
                            headers: {
                                "Authorization": "Kinvey " + sessionStorage.getItem("authToken")
                            }
                        }).then(function (res) {
                            loadAds()
                        }).catch(function (err) {
                            showErrorBox("Error")
                        })
                    }))
                        .append($(`<a href="#">[Edit]</a>`).on("click", function () {
                            showView("#viewEditAd")
                            let form = $("#formEditAd")
                            let title = form.find("input[name=title]").val(ad.title)
                            let publisher = form.find("input[name=publisher]").val(ad.publisher)
                            let description = form.find("textarea[name=description]").val(ad.description)
                            let price = form.find("input[name=price]").val(ad.price)
                            let oldDate = ad.date.split("/")
                            let date = form.find("input[name=datePublished]").val(ad.date)
                            let id = form.find("input[name=id]").val(ad._id)
                            let imgURL = form.find("input[name=imageURL]").val(ad.imgURL)
                            let cViews=form.find("input[name=currentViews]").val(ad.views)

                            $("#buttonEditAd").on("click", function () {
                                if (!validateInput(title.val(), publisher.val(), description.val(), price.val(), imgURL.val(), date.val())) {
                                    showErrorBox("Please fill all fields!")
                                    return
                                }
                                $.ajax({
                                    method: "PUT",
                                    url: BASE_URL + "appdata/" + APP_KEY + "/products/" + id.val(),
                                    headers: {
                                        "Authorization": "Kinvey " + sessionStorage.getItem("authToken"),
                                        "Content-type": "application/json"
                                    },
                                    data: JSON.stringify({
                                        title: title.val(),
                                        description: description.val(),
                                        price: price.val(),
                                        date: date.val(),
                                        publisher: publisher.val(),
                                        imgURL: imgURL.val(),
                                        views:Number(cViews.val())
                                    })
                                }).then(function (res) {
                                    loadAds()
                                }).catch(function (err) {
                                    showErrorBox("Error")
                                })

                            })
                        }))
                }
                td.appendTo(newAdd)
                newAdd.appendTo("table")
            }
        })
    }

    $("#linkCreateAd").on("click", showCreateAdd)

    $("#buttonCreateAd").on("click", function () {
        let form = $("#formCreateAd")
        let title = form.find("input[name=title]").val()
        let description = form.find("textarea[name=description]").val()
        let date = form.find("input[name=datePublished]").val().replace("/", "-")
        let price = form.find("input[name=price]").val()
        let imgURL = form.find("input[name=imageURL]").val()
        let publisher = sessionStorage.getItem("username")

        if (!validateInput(title, description, date, price, imgURL)) {
            showErrorBox("Please fill all fields!")
            return
        }

        $.ajax({
            method: "POST",
            url: BASE_URL + "appdata/" + APP_KEY + "/products",
            headers: {
                "Authorization": "Kinvey " + sessionStorage.getItem("authToken"),
                "Content-type": "application/json"
            },
            data: JSON.stringify({
                title, description, date, price, publisher, imgURL, views: 0
            })
        }).then(function (res) {
            showView("#viewHome")
            showInfoBox("Ad Created!")
        })
    })

    function clearTableRows() {
        $("table tr").each((index, el) => {
            if (index !== 0) {
                $(el).remove()
            }
        })

    }
    function validateInput(...params) {
        for (let param of params) {
            if (param === '') {

                return false
            }
        }
        return true
    }

    function increaseViewsOnClick(ad) {
        $.ajax({
            method: "PUT",
            url: BASE_URL + "appdata/" + APP_KEY + "/products/" + ad._id,
            headers: {
                "Authorization": "Kinvey " + sessionStorage.getItem("authToken"),
                "Content-type": "application/json"
            },
            data: JSON.stringify({
                title: ad.title,
                description: ad.description,
                date: ad.date,
                price: ad.price,
                publisher: ad.publisher,
                imgURL: ad.imgURL,
                views: ad.views += 1
            })
        })
    }

}

