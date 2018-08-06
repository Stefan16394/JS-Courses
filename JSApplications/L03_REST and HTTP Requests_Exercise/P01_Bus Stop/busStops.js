function getInfo() {
    $("#stopName").empty()
    $("#buses").empty()
   const URL="https://judgetests.firebaseio.com/businfo/"
   let stopId=$("#stopId")
   $.ajax({
       method:"GET",
       url:URL+stopId.val()+".json"
   }).then(function(res){
      $("#stopName").text(res.name)
      for(let bus in res.buses){
          $("#buses").append($("<li>").text(`Bus ${bus} arrives in ${res.buses[bus]} minutes`))
      }
   }).catch(function(err){
    $("#stopName").text("Error")
   })
  }