const BASE_URL = "https://baas.kinvey.com/"
const APP_KEY = "kid_Bki5M1jcG"
const APP_SECRET = "17553970d4ba4f01a7e850d488c5a5e9"
var source;
var template;
function startApp() {
    showAndHideMenuViews()
     showHomeView()
    //menu views
    async function showAndHideMenuViews() {

        let authToken = sessionStorage.getItem("authToken")
        let headers;
        if (authToken) {
            headers = window.headers.authHeaders
        }
        else {
            headers = window.headers.unautHeaders
        }

         source = await $.get("./templates/header-template.hbs")
         template = Handlebars.compile(source)
        let html = template({
            headers
        })
        $("#app").html(html)
        attachEvents()
        
   
    }
    

    async function loadAccountTemplate() {
        source = await $.get("./templates/loginRegister-template.hbs")
        template = Handlebars.compile(source)
    }
    async function loadHomeTemplate() {
        source = await $.get("./templates/homeView-template.hbs")
        template = Handlebars.compile(source)
    }

    function showView(selector) {
        $("main").empty()
        $(selector).show()
    }


    async function showHomeView() {
     await  loadHomeTemplate()
       let html=template(window.HomeView)
       $("main").html(html)
    
    }

   async function showRegisterView() {
      await  loadAccountTemplate()
        let html = template(window.AccountOptions.viewRegister)
        $("main").html(html)
        await attachLoginRegisterEvents()
        
    }
    async function loadEmptyTable(){
         source=await $.get("./templates/viewAdds-template.hbs")
         template=Handlebars.compile(source)
        
    }
    async function listAds() {
       await loadEmptyTable()
       let html=template({})
       $("main").html(html)
    }

   async function showLoginView() {
      await  loadAccountTemplate()
        let html = template(window.AccountOptions.viewLogin)
        $("main").html(html)
       await attachLoginRegisterEvents()
    }



    function showErrorBox(message) {
        $("#errorBox").text(message).show()
    }

    function showLoadingBox() {
        $("#loadingBox").toggle()
    }

   async function loadCreateViewTemplate(){
        source=await $.get("./templates/createAd-template.hbs")
        template=Handlebars.compile(source)
    }

    async function loadSingleAddTemplate(){
        source=await $.get("./templates/readMore-template.hbs")
        template=Handlebars.compile(source)
    }

    async function loadInfoBox(boxType){
        source=await $.get("./templates/"+boxType)
        template=Handlebars.compile(source)
        let html=template({})
        $("main").append(html)
    }

    async function loadSingleAddView(){
        await loadSingleAddTemplate()
        let html=template({})
        $("main").html(html)
    }

     async function showCreateAdd() {
       await loadCreateViewTemplate()
       let html = template({})
       $("main").html(html)

      await $("#buttonCreateAd").on("click", function () {
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
    }

    function showSingleAdView() {
        showView("#viewSingleAdd")
    }

    async function loadEditTemplate(){
        source= await $.get("./templates/editAd-template.hbs")
        template=Handlebars.compile(source)
    }
    async function showEditView(){
      await loadEditTemplate()
      let html=template({})
      console.log(html)
      $("main").html(html)
       
    }

    function attachLoginRegisterEvents() {
        $("#buttonRegisterUser").on("click", function () {
            let username = $("#formRegister input[name=username]").val()
            let password = $("#formRegister input[name=passwd").val()
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
                async function showViews(){
                    await showHomeView()
                    await loadInfoBox("InfoBox-template.hbs").then(function(){
                        setTimeout(function(){
                            $("#infoBox").remove()
                        },2000)
                    })
                }
                showViews()
            }).catch(function (err) {
                async function showViews(){
                    await loadInfoBox("errorBox-template.hbs").then(function(){
                        setTimeout(function(){
                            $("#errorBox").remove()
                        },2000)
                    })
                }
                showViews()
            })
        })

        $("#buttonLoginUser").on("click", function () {
            let username = $("#formLogin input[name=username]").val()
            let password = $("#formLogin input[name=passwd").val()
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
                async function showViews(){
                    await showHomeView()
                    await loadInfoBox("InfoBox-template.hbs").then(function(){
                        setTimeout(function(){
                            $("#infoBox").remove()
                        },2000)
                    })
                    await  showAndHideMenuViews()
                }
                showViews()
                
                sessionStorage.setItem("authToken", res._kmd.authtoken)
                sessionStorage.setItem("username", res.username)
                sessionStorage.setItem("usernameID", res._id)

            }).catch(function (err) {
                async function showViews(){
                    await loadInfoBox("errorBox-template.hbs").then(function(){
                        setTimeout(function(){
                            $("#errorBox").remove()
                        },2000)
                    })
                }
                showViews()
            })
        })


    }

    function attachEvents() {
        //attach events
        $("#linkHome").on("click", showHomeView)

        $("#linkRegister").on("click", showRegisterView)

        $("#linkLogin").on("click", showLoginView)

        $("#linkLogout").on("click", function () {
            sessionStorage.clear()
            showHomeView()
            showAndHideMenuViews()
            showInfoBox("Logged out succesfully!")
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
                list(res)
                async function list(res){
                    await listAds()
                    for (let ad of res) {
                        let newAdd = $(`<tr>
                 <td>${ad.title}</td>
                 <td>${ad.publisher}</td>
                 <td>${ad.description}</td>
                 <td>${ad.price}</td>
                 <td>${ad.date}</td></tr>`)
    
                        let td = $("<td>")
                            .append($(`<a href="#">[ReadMore]</a>`).on("click", function () {
                                async function loadReadMoreView(){
                                    await loadSingleAddView()
                                    increaseViewsOnClick(ad)
                                    $("#adTitle").text(ad.title)
                                    $("#adDescr").text(ad.description)
                                    $("#adPublisher").text(ad.publisher)
                                    $("#adDate").text(ad.date)
                                    $("#image").attr("src", ad.imgURL)
                                    $("#adViews").text(ad.views)
                                }
                                loadReadMoreView()
                              
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
                                   async function loadEditView()
                                   {
                                       await showEditView()
                                       
                                       let form = $("#formEditAd")
                                       let title = form.find("input[name=title]").val(ad.title)
                                       let publisher = form.find("input[name=publisher]").val(ad.publisher)
                                       let description = form.find("textarea[name=description]").val(ad.description)
                                       let price = form.find("input[name=price]").val(ad.price)
                                       let oldDate = ad.date.split("/")
                                       let date = form.find("input[name=datePublished]").val(ad.date)
                                       let id = form.find("input[name=id]").val(ad._id)
                                       let imgURL = form.find("input[name=imageURL]").val(ad.imgURL)
                                       let cViews = form.find("input[name=currentViews]").val(ad.views)
       
                                      await $("#buttonEditAd").on("click", function () {
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
                                                   views: Number(cViews.val())
                                               })
                                           }).then(function (res) {
                                               loadAds()
                                           }).catch(function (err) {
                                               showErrorBox("Error")
                                           })
       
                                       })
                                   }
                                   loadEditView()
                                    
                             
                                }))
                        }
                        td.appendTo(newAdd)
                        console.log($("#ads"))
                        newAdd.appendTo("table")
                    }
                }
               
          
            })
        }
        $("#linkCreateAd").on("click", showCreateAdd)

        

        function clearTableRows() {
            $("table tr").each((index, el) => {
                if (index !== 0) {
                    $(el).remove()
                }
            })

        }
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

