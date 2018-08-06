function attachEvents(){
    const locationsURL="https://judgetests.firebaseio.com/locations.json"
    $("#submit").on("click",function(){
        let location=$("#location")
        $.ajax({
            method:"GET",
            url:locationsURL
        }).then(function(res){
            let obj=res.filter(x=>x.name===location.val())[0]
            if(!obj){
               clearHtml()
               $("#forecast").css("display","block").text("Error")
                 return
            }
            todayWeatherRequest(obj.code)
            threeDayForecast(obj.code)
        })
    })
    let symbols={
        "Sunny":"☀",
        "Partly sunny":"⛅",
        "Overcast":"☁",
        "Rain":"☂",
        "Degrees":"°"
    }
    function todayWeatherRequest(code){
        const todayURL="https://judgetests.firebaseio.com/forecast/today/"
        $.ajax({
            method:"GET",
            url:todayURL+code+".json"
        }).then(function(res){
            clearHtml()
           let span=$("<span>").addClass("condition symbol").text(symbols[res.forecast.condition])
           let spanCondition=$("<span>").addClass("condition")
           .append($("<span>").addClass("forecast-data").text(res.name))
           .append($("<span>").addClass("forecast-data")
           .text(res.forecast.low+symbols.Degrees+"/"+res.forecast.high+symbols.Degrees))
           .append($("<span>").addClass("forecast-data").text(res.forecast.condition))
           $("#current").append(span,spanCondition)
           $("#forecast").css("display","block")                
        })  
    }
    function threeDayForecast(code){
        const forecastURL="https://judgetests.firebaseio.com/forecast/upcoming/"
        $.ajax({
            method:"GET",
            url:forecastURL+code+".json"
        }).then(function(res){
            for(let day of res.forecast){
                let span=$("<span>").addClass("upcoming")
                .append($("<span>").addClass("symbol").text(symbols[day.condition]))
                .append($("<span>").addClass("forecast-data")
                .text(day.low+symbols.Degrees+"/"+day.high+symbols.Degrees))
                .append($("<span>").addClass("forecast-data").text(day.condition))
                $("#upcoming").append(span)
            }
           
        })
    }
    function clearHtml(){
        $("#forecast").html(` <div id="current">
            <div class="label">Current conditions</div>
          </div>
          <div id="upcoming">
            <div class="label">Three-day forecast</div>`)
    }
}