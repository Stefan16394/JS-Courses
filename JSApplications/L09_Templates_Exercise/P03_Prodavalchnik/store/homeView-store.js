(function () {
    class HomeView {
      constructor(title,message){
          this.title=title
          this.message=message
      }
    }
   let defaultMessage=new HomeView("Welcome","Welcome to our advertisement site.")
    window.HomeView=defaultMessage
})()