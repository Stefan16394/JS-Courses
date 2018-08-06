function attachEvents(){
    $("#getVenues").on("click",function(){
        let date=$("#venueDate").val()
        $.ajax({
            method:"POST",
            url:`https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`,
            headers:{
                "Authorization":"Basic "+ btoa("guest"+":"+"pass"),
                'Content-type': 'application/json'
            },
        }).then(function(res){
            //res returns id' of venues, for each venue create template
             for(let id of res){
                $.ajax({
                    method:"GET",
                    url:"https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/"+id,
                    headers:{
                     "Authorization":"Basic "+ btoa("guest"+":"+"pass"),
                     'Content-type': 'application/json'
                 },
                }).then(function(venue){
                    let tmpl=$(`<div class="venue" id="${venue._id}">
                    <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
                    <div class="venue-details" style="display: none;">
                      <table>
                        <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
                        <tr>
                          <td class="venue-price">${venue.price} lv</td>
                          <td><select class="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select></td>
                          <td><input class="purchase" type="button" value="Purchase"></td>
                        </tr>
                      </table>
                      <span class="head">Venue description:</span>
                      <p class="description">${venue.description}</p>
                      <p class="description">Starting time: ${venue.startingHour}</p>
                    </div>
                  </div>`)
                  //when more info button is clicked change div to display:block/none
                  $(tmpl).find(".info").on("click",function(){
                    $(tmpl).find(".venue-details").toggle()
                })
                //when purchase button is clicked display purchase info
                $(tmpl).find(".purchase").on("click",function(){
                    let qty=$(tmpl).find("option:selected").text()
                   let venueinfo= $("#venue-info").html(`<span class="head">Confirm purchase</span>
                    <div class="purchase-info">
                      <span>${venue.name}</span>
                      <span>${qty} x ${venue.price}</span>
                      <span>Total: ${qty * venue.price} lv</span>
                      <input type="button" value="Confirm">
                    </div>`)
                    //when confirm button is clicked send POST request which returns 
                    // html which replaces venue-info div html
            
                    $(venueinfo).find("input").on("click",function(){
                        $.ajax({
                            method:"POST",
                            url:`https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${venue._id}&qty=${qty}`,
                            headers:{
                                "Authorization":"Basic "+ btoa("guest"+":"+"pass"),
                                'Content-type': 'application/json'
                            },
                        }).then(function(res){
                            
                            $("#venue-info").html(`<p>Print this ticket</p> ${res.html}`)
                        })
                    })
                })
                  tmpl.appendTo("#venue-info")
                })
            }
        })
    })
    
}
function makeGetRequest(id){
    let x;
  $.ajax({
       method:"GET",
       url:"https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/"+id,
       headers:{
        "Authorization":"Basic "+ btoa("guest"+":"+"pass"),
        'Content-type': 'application/json'
    },
   }).then(function(res){
     x=composeTemplate(res)
     console.log(x)
   })
}
function composeTemplate(venue){
    let tmpl=$(`<div class="venue" id="${venue._id}">
    <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
    <div class="venue-details" style="display: none;">
      <table>
        <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
        <tr>
          <td class="venue-price">${venue.price} lv</td>
          <td><select class="quantity">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select></td>
          <td><input class="purchase" type="button" value="Purchase"></td>
        </tr>
      </table>
      <span class="head">Venue description:</span>
      <p class="description">${venue.description}</p>
      <p class="description">Starting time: ${venue.startingHour}</p>
    </div>
  </div>`)
  return tmpl
}