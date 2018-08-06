
$(() => {
    
    let details;
    let data;
    async function f() {
        let contacts=await $.get("templates/contacts.hbs")
        details=await $.get('templates/details.hbs')

        data=await $.get("data.json")
        let context={
            contacts:data
        }
        contacts=Handlebars.compile(contacts)
         
        contacts=contacts(context)
       $("#list").append(contacts)
       attachEvents()
      }
     
      function attachEvents() {
          $(".contact").on("click",function(){
              loadDetails($(this).attr("data-id"))
              $(".selectedContact").removeClass("selectedContact")
              $(this).addClass("selectedContact")
          }
      )
        }
      function loadDetails(id){
        let detailsTemplate=Handlebars.compile(details)
        let html=detailsTemplate(data[id])

        $("#details").empty()
        $("#details").append(html)
      }

      f()
});