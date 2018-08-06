$(() => {
    let contacts={
        na
    }
    const app = Sammy('#main', function () {
        this.get('#/index.html', () => {
            this.swap('<h2>Hello Sammy</h2>');
        });
        this.get('#/about', () => {
            this.swap("<h2>About Sammy</h2>");
        });
        this.get('#/contact', () => {
            this.swap("<h2>Contact Sammy</h2>");
        });
    })
       
    app.run()
})




