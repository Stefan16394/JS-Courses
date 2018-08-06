const URL="https://phonebook-7ae37.firebaseio.com/Phonebook"
$('#btnLoad').on("click",loadData)

//send GET request to database
function loadData(){
    $.ajax({
        method:"GET",
        url:URL+".json",
    }).then(handleSuccess)
    .catch(function(err){
       console.log(err)
    })
}
// get all entries from DB and append to phonebook id
function handleSuccess(res){
    $('#phonebook').empty()
    for(let contact in res){
        let el=res[contact]
        let li=$(`<li>${el.name}: ${el.phone}</li>`)
        .append(`<a href="#"> Delete<a/>`).click(function(){
            $.ajax({
                method:"DELETE",
                url:URL+"/"+contact+".json"
            }).then(loadData)
             .catch(function(err){
                 console.log(err)
             })
        })
        $(`#phonebook`).append(li)
    }
}
$("#btnCreate").on("click",createContact)
function createContact(){
    let _name=$("#person").val()
    let _phone=$("#phone").val()
    let object=JSON.stringify({name:_name,phone:_phone})
    $.ajax({
        method:"POST",
        url:URL+"/.json",
        data:object
    }).then(loadData)
    .catch(function(err){
        console.log(err)
    }
    )}
        