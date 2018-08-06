function attachEvents(){
   const URL= "https://phonebook-nakov.firebaseio.com/phonebook"
   
    $("#btnLoad").on("click",loadData)
    $("#btnCreate").on("click",function(){
        let person=$("#person")
        let phone=$("#phone")
        let newContact={
            person:person.val(),
            phone:phone.val()
        }
        person.val("")
        phone.val("")
        $.ajax({
            method:"POST",
            url:URL+".json",
            data:JSON.stringify(newContact)
        }).then(loadData)
    })
    function loadData(){
        $.ajax({
            method:"GET",
            url:URL+".json"
        }).then(function(res){
            let phonebook=$("#phonebook")
            phonebook.empty()
           for(let obj in res){
             let li=$(`<li>${res[obj].person}: ${res[obj].phone} </li>`)
             .append($('<button>[Delete]</button>').on("click",function(){
                 $.ajax({
                     method:"DELETE",
                     url:URL+"/"+obj+".json"
                 })
                 $(this).parent().remove()
             }))
             phonebook.append(li)
           }
        })
    }
}