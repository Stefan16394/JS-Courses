function attachEvents(){
    let source=$("#towns-template").html()
    let template=Handlebars.compile(source)

    $("#btnLoadTowns").on("click",function () {
         
          let towns=$("#towns").val().split(",").map(x=>x.trim()).filter(x=>x!=="")
          let context={
              towns:towns.map(x=>{
                  return {name:x}})
              }
          let html=template(context)
          $("#root").empty()
          $("#root").append(html)
      })
}