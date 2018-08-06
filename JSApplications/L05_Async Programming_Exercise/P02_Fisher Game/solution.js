function attachEvents(){
    const URL="https://baas.kinvey.com/appdata/kid_SyWM_u8qz/biggestCatches"
    $(".load").on("click",loadData)
    $(".add").on("click",function(){
        let newObj=createObject("#addForm")
        $.ajax({
            method:"POST",
            url:URL,
            headers: {
                "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                'Content-type': 'application/json'
              },
            data:JSON.stringify(newObj)
        }).then(loadData)
        .catch(function(err){
            console.log(err)
        })
    })
    function loadData(res){
        $("#catches").empty()
        $.ajax({
            method:"GET",
            url:URL,
            headers: {
                "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                'Content-type': 'application/json'
              },
        }).then(function(res){
            for(let obj of res){
                let newDiv=
                $(`<div class="catch" data-id="${obj._id}">
                 <label>Angler</label>
                 <input type="text" class="angler" value="${obj.angler}"/>
                 <label>Weight</label>
                 <input type="number" class="weight" value="${Number(obj.weight)}"/>
                 <label>Species</label>
                 <input type="text" class="species" value="${obj.species}"/>
                 <label>Location</label>
                 <input type="text" class="location" value="${obj.location}"/>
                 <label>Bait</label>
                 <input type="text" class="bait" value="${obj.bait}"/>
                 <label>Capture Time</label>
                 <input type="number" class="captureTime" value="${Number(obj.captureTime)}"/>`)
                 newDiv.append($("<button>").addClass("update").text("Update").on("click",function(){
                    let div=$(this).parent()
                    let updatedObj=createObject(div)
                    let id=div.attr("data-id")
                    $.ajax({
                        method:"PUT",
                        url:URL+"/"+id,
                        headers: {
                      "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                      'Content-type': 'application/json',
                        },
                        data:JSON.stringify(updatedObj)
                    }).then(loadData)
                    .catch(function(err){
                        console.log(err)
                    })
                 }))
                 newDiv.append($("<button>").addClass("delete").text("Delete").on("click",function(){
                    let div=$(this).parent()
                    let id=div.attr("data-id")
                    $.ajax({
                        method:"DELETE",
                        url:URL+"/"+id,
                        headers: {
                            "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                            'Content-type': 'application/json',
                              }
                    }).then(function(res){
                        div.remove()
                    })
                    .catch(function(err){
                        console.log(err)
                    })
                 }))
                 newDiv.appendTo("#catches")
            }
        })
        .catch(function(err){
            console.log(err)
        })
      
    }
    function createObject(selector){
        let form=$(selector)
        return {
            angler:form.find(".angler").val(), 
            weight:Number(form.find(".weight").val()), 
            species:form.find(".species").val(),
            location:form.find(".location").val(),
            bait:form.find(".bait").val(), 
            captureTime:Number(form.find(".captureTime").val())
            }
    }
}