$("#getCountries").on("click",function(){
    $.ajax({
        method:"GET",
        url:"https://baas.kinvey.com/appdata/kid_HkRuDaD9z/countries",
        headers:{
            "Authorization":"Basic "+ btoa("admin" + ":" + "admin"),
            'Content-type': 'application/json'
        }
    }).then(function(res){
        $("#content").empty()
        for(let country of res){
            let p=$("<p><br>").text(country.name)
            let div=$(`<div id="towns"></div>`)
            div.appendTo(p)
            p.on("click",function(){
                $.ajax({
                    method: "GET",
                    url:"https://baas.kinvey.com/appdata/kid_HkRuDaD9z/towns",
                    headers:{
                        "Authorization":"Basic "+ btoa("admin" + ":" + "admin"),
                        'Content-type': 'application/json'
                    }
                }).then(function(res){
                   res=res.filter(x=>x.country===p.text())[0]
                   if(!res){
                       return
                   }
                   $(div).text(res.towns)
                })
            })
            
                  $("#content").append(p)
        }
    })
})

$("#post").on("click",function(){
   $.ajax({
    method:"POST",
    url:"https://baas.kinvey.com/appdata/kid_HkRuDaD9z/countries",
    headers:{
        "Authorization":"Basic "+ btoa("admin" + ":" + "admin"),
        'Content-type': 'application/json'
    },
    data:JSON.stringify({
       name:$("#add").val()
    })
   }) 
})