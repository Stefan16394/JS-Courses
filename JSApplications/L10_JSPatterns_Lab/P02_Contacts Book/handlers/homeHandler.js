handlers.homeHandler = function (ctx){
    ctx.isAuth = auth.isAuth
    $.ajax('data.json').then((contacts)=>{
        ctx.contacts=contacts
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            navigation: './templates/common/navigation.hbs',
            footer: './templates/common/footer.hbs',
            contactsPage: './templates/contacts/contactsPage.hbs',
            contactsDetails:'./templates/contacts/contactsDetails.hbs',
            contactsList:'./templates/contacts/contactsList.hbs',
            singleContact:'./templates/contacts/singleContact.hbs',
            loginForm: './forms/loginForm.hbs'
        }).then(function () {
            ctx.partials = this.partials;

            render();
        });
    })
    .catch(console.error);

function render () {
    ctx.partial('./templates/home.hbs')
        .then(attachEvents)
}

function attachEvents() {
    $('.contact').click((e) => {
        let index = $(e.target).closest('.contact').attr('data-id');
        ctx.selected = ctx.contacts[index];
        render();
    });
}
   
}