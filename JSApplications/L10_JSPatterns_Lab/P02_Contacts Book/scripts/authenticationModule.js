let auth = (()=>{
   
    function isAuth(){
        return sessionStorage.getItem("authToken")!==null
    }

    function register(username,password){
        let obj={username,password}
        remote.post("user", '',"basic",obj)
        .then(saveSession)
        .catch(function(err){
            console.log(err)
        })
    }

    function login(username,password){
        let obj={username,password}
      return remote.post("user", 'login',"basic",obj)
    }

    function logout(){
        remote.post('user','_logout','kinvey')
        .then(()=>{
            sessionStorage.clear()
        }).catch((err)=>{
            console.log(err)
        })
    }

    function saveSession(userData){
        sessionStorage.setItem("authToken",userData._kmd.authtoken)
        sessionStorage.setItem("username",userData.username)
        sessionStorage.setItem("userId",userData._id)
    }

    return{
        login,
        logout,
        register,
        isAuth,
        saveSession
    }
})()