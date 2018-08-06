let chirpService = (() => {

    function getChirpsByUsername(username) {
        let endpoint = `chirps?query={"author":"${username}"}`
        return requester.get("appdata", endpoint, 'kinvey')
    }

    function getUserByUsername(username) {
        let endpoint = `?query={"username":"${username}"}`
        return requester.get("user", endpoint, 'kinvey')
    }

    function getFollowersForUsername(username) {
        let endpoint = `?query={"subscriptions":"${username}"}`
        return requester.get("user", endpoint, "kinvey")
    }

    function listAllChripsFromSubs(subs) {
        let endpoint=`chirps?query={"author":{"$in": ${subs}}}&sort={"_kmd.ect": 1}`
        return requester.get("appdata", endpoint, "kinvey")
    }

    function getAllUsers() {
        return requester.get("user","","kinvey")
      }

    function createChirp(data){
        return requester.post("appdata","chirps","kinvey",JSON.stringify(data))
    }

    function deleteChirp(id){
        return requester.remove("appdata",`chirps/${id}`,'kinvey')
    }

    function follow(data) {
        return requester.update("user",sessionStorage.getItem("userId"),'kinvey',JSON.stringify(data))
      }
    return {
        getChirpsByUsername,
        getUserByUsername,
        getFollowersForUsername,
        listAllChripsFromSubs,
        getAllUsers,
        createChirp,
        deleteChirp,
        follow

    }
})()