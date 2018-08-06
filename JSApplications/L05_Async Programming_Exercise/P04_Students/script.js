const URL="https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students"
function addStudent(id,firstName,lastName,facNum,grade){
  if(arguments.length===5 && id!=='' && !isNaN(id) && firstName!=='' && lastName!=='' && facNum!==''  && grade!=='' && !isNaN(grade)){
      let newStudent={
        ID:id,
        FirstName:firstName,
        LastName:lastName,
        FacultyNumber:facNum,
        Grade:grade
      }
      $.ajax({
          method:"POST",
          url:URL,
          headers:{
            "Authorization": "Basic " + btoa("guest" + ":" + "guest"),
            'Content-type': 'application/json'
          },
          data:JSON.stringify(newStudent)
      })
  }
}
function getStudents(){
   $.ajax({
       method:"GET",
       url:URL,
       headers:{
           "Authorization":"Basic "+btoa("guest"+":"+"guest"),
           "Content-type":"application/json"
       },
   }).then(function(res){
       console.log(res.length)
       res=res.sort((x,y)=>x.ID-y.ID)
       for(let obj of res){
           let newTr=$("<tr>")
           .append($("<td>").text(obj._id))
           .append($("<td>").text(obj.FirstName))
           .append($("<td>").text(obj.LastName))
           .append($("<td>").text(obj.FacultyNumber))
           .append($("<td>").text(obj.Grade))
           newTr.appendTo("#results")
       }
   })
}
// addStudent(1,"OmaeWaMouShindeiru","NANI","14123",6)
getStudents()

