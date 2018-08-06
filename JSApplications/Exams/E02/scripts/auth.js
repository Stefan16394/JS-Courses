let auth = (() => {
    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        let subs=JSON.stringify(userInfo.subscriptions)
        sessionStorage.setItem("subscriptions",subs)
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };
        return requester.post('user', 'login', 'basic', JSON.stringify(userData));
    }

    // user/register
    function register(username, password) {
        let userData = {
            username,
            password,
            subscriptions:[]
        };

        return requester.post('user', '', 'basic', JSON.stringify(userData));
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', JSON.stringify(logoutData));
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

   

    return {
        login,
        register,
        logout,
        saveSession
    }
})()