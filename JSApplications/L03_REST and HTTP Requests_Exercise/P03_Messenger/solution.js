function attachEvents(){
    const URL="https://messenger-9ef01.firebaseio.com/Messenger/.json"
    $("#refresh").on("click",function(){
      $.ajax({
          method:"GET",
          url:URL
      }).then(function(res){
          let keys=Object.keys(res)
          $('#messages').empty()
          res=keys.sort((x,y)=>res[x].timestamp-res[y].timestamp)
          .map(x=>`${res[x].author}: ${res[x].content}`).join("\n")
          $('#messages').append(res)
      })
    })
    $("#submit").on("click",function(){
        let newMessage={
            author:$('#author').val(),
            content:$('#content').val(),
            timestamp:Date.now()
        }        
        $.ajax({
            method: 'POST',
            url: URL,
            data: JSON.stringify(newMessage),
        }).then(function(){
            $('#messages').append(`${newMessage.author}: ${newMessage.content}\n`)
        })
       
    })
}
