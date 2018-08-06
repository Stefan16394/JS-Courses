function solve() {
    const URL="https://judgetests.firebaseio.com/schedule/"
    let span=$("div > span")
    let stopId="depot"
    let currentStop;
    function depart(){
        $.ajax({
            method:"GET",
            url:URL+stopId+".json"
        }).then(function(res){
            span.text(`Next stop ${res.name}`)
            $("#depart").attr("disabled",true)
            $("#arrive").attr("disabled",false)
            stopId=res.next
            currentStop=res.name
        }).catch(function(err){
           span.text("Error")
        })
    }
    function arrive(){
        span.text(`Arriving at ${currentStop}`)
        $("#depart").attr("disabled",false)
        $("#arrive").attr("disabled",true)
    }
    return {
      depart,
      arrive
    };
  }