(function () {
    class AcountOption {
      constructor(viewName,viewMessage,formName,buttonName,buttonValue){
          this.viewName=viewName
          this.viewMessage=viewMessage
          this.formName=formName
          this.buttonName=buttonName
          this.buttonValue=buttonValue
      }
    }
    
    
    let viewLogin=new AcountOption("viewLogin","Please login","formLogin","buttonLoginUser","Login")

    let viewRegister=new AcountOption("viewRegister","Please register here","formRegister","buttonRegisterUser","Register")
    window.AccountOptions ={
        viewLogin,
        viewRegister
    };
})()
