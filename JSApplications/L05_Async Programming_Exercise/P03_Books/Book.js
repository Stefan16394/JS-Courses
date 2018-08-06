class Book{
    constructor(title,author,ISBN){
        this.title=title
        this.author=author
        this.ISBN=ISBN
        this.element=this.renderBook()
        this.createBook()
    }
    renderBook(){
       return {
           title:this.title,
           author:this.author,
           ISBN:this.ISBN
       }
    }
     listAllBooks(){
        $.ajax({
            method:"GET",
            url:"https://baas.kinvey.com/appdata/kid_SyNsEjU9M/books",
            headers: {
                "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                'Content-type': 'application/json'
              }
        }).then(function(res){
            $("#content").empty()
           for(let obj of res){
               let div=$("<div>")
            .append($(`<input id="title" type="text" value="${obj.title}">`))
            .append($(`<input id="author" type="text" value="${obj.author}">`))
            .append($(`<input id="isbn" type="text" value="${obj.ISBN}">`))
            .append($(`<div>`).attr("id","_id").text(obj._id).css("display","none"))
            .append($('<button>').text("DELETE").on("click",function(){
                $.ajax({
                    method:"DELETE",
                    url:"https://baas.kinvey.com/appdata/kid_SyNsEjU9M/books/"+$(div).find("#_id").text(),
                    headers: {
                        "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                        'Content-type': 'application/json'
                      },
                })
            }))
            .append($('<button>').text("UPDATE").on("click",function(){
                $.ajax({
                    method:"PUT",
                    url:"https://baas.kinvey.com/appdata/kid_SyNsEjU9M/books/"+$(div).find("#_id").text(),
                    headers: {
                        "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                        'Content-type': 'application/json'
                      },
                      data:JSON.stringify({
                          title:$("#title").val(),
                          author:$("#author").val(),
                          ISBN:$("#isbn").val(),
                      })
                })
            }))
            div.appendTo("#content")
           }
        })
    }

     createBook(){
        $.ajax({
            method:"POST",
            url:"https://baas.kinvey.com/appdata/kid_SyNsEjU9M/books",
            headers: {
                "Authorization": "Basic " + btoa("admin" + ":" + "admin"),
                'Content-type': 'application/json'
              },
            data:JSON.stringify(this.element)
        }).then(this.listAllBooks)
    }
    

}