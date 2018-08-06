const URL="https://baas.kinvey.com/appdata/"
const APP_KEY="kid_rJrSkDcqz"
const APP_SECRET="8fb03b1a688e4e47bc825aec22721578"
const AUTH_HEADERS = {'Authorization': "Basic " + btoa("guest" + ":" + "guest")}

const NEW_PLAYER_MONEY=500
const NEW_PLAYER_BULLETS=6

function attachEvents() {
        loadData()
        
        function loadData(){
         $.ajax({
            method:"GET",
            url:URL+APP_KEY+"/players",
            headers:AUTH_HEADERS
        }).then(function (res) {
           let players=$("#players").empty()
           for(let player of res){
               let newPlayer=$(`<div class="player" data-id="${player._id}">
               <div class="row">
                   <label>Name:</label>
                   <label class="name">${player.name}</label>
               </div>
               <div class="row">
                   <label>Money:</label>
                   <label class="money">${player.money}</label>
               </div>
               <div class="row">
                   <label>Bullets:</label>
                   <label class="bullets">${player.bullets}</label>
               </div>`)
               .append($(`<button class="play">Play</button>`).on("click",function(){
                  
                  loadCanvas(player)
                    $("canvas").css("display","block")
                    $("#save").toggle()
                    $("#save").on("click",function(){
                        $.ajax({
                            method:"PUT",
                            url:URL+APP_KEY+"/players"+"/"+player._id,
                            headers:{
                                'Authorization': "Basic " + btoa("guest" + ":" + "guest"),
                                'Content-type':"application/json"
                              },
                            data:JSON.stringify({
                                 name:player.name,
                                 money:player.money,
                                 bullets:player.bullets
                            })
                        }).then(function (res) {
                          $("#reload").toggle()
                          $("#save").toggle()
                          clearInterval(canvas.intervalId)
                          loadData()
                          })
                    })
                    $("#reload").toggle()
                    $("#reload").on("click",function(){
                        player.money-=60
                        player.bullets=6
                    })
               }))
               .append($(`<button class="delete">Delete</button>`).on("click",function(){
                let element=$(this).parent()
                $.ajax({
                      method:"DELETE",
                      url:URL+APP_KEY+"/players"+"/"+player._id,
                      headers:AUTH_HEADERS,
                  }).then(function(res){
                     element.remove()
                  })        
               }))
               newPlayer.appendTo(players)
           }
          })}
          
         $("#addPlayer").on("click",function(){
             let _name=$("#addName").val()
             $.ajax({
                 method:"POST",
                 url:URL+APP_KEY+"/players",
                headers:{
                    'Authorization': "Basic " + btoa("guest" + ":" + "guest"),
                    'Content-type':"application/json"
                  },
                data:JSON.stringify({
                     name: _name,
                     money:NEW_PLAYER_MONEY,
                     bullets:NEW_PLAYER_BULLETS
                })
             }).then(loadData)
         })
 }