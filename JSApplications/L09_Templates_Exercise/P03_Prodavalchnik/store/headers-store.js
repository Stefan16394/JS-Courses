(function () {
    class Header {
      constructor(id,text){
          this.id=id
          this.text=text
      }
    }
    let unautHeaders=[
        new Header("linkHome","Home"),
        new Header("linkLogin","Login"),
        new Header("linkRegister","Register")
    ]
    
    let authHeaders=[
        new Header("linkHome","Home"),
        new Header("linkListAds","List Advertisements"),
        new Header("linkCreateAd","Create Advertisement"),
        new Header("linkLogout","Logout")
    ]

    window.headers ={
        authHeaders,
        unautHeaders
    };
})()