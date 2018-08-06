$(() => {
    renderCatTemplate();

   async function renderCatTemplate() {
         let cats=window.cats
         let source=await $.get("./template.hbs")
         let template=Handlebars.compile(source)
         let html=template({
             cats
         })
         $("#allCats").append(html)
         $(".btn-primary").on("click",function(){
            $(this).next().toggle()
         })
    }
 

})
