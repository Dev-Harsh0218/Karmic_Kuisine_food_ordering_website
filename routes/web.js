const homeControl=require('../app/http/controllers/homeController')
const aboutControl=require('../app/http/controllers/aboutController')
const cartControl = require('../app/http/controllers/cartController')
const registerControl=require("../app/http/controllers/registerController")
const menuControl = require('../app/http/controllers/menuController')
const loginControl=require('../app/http/controllers/loginController')
const guest = require('../app/http/middlewares/guest')

function initRoutes(app){
    //// home route
    app.get('/',homeControl().index)
    //about route
    app.get('/about',aboutControl().about)
    //cart route
    app.get('/cart',cartControl().cart)
    //login
    app.get('/login',guest,loginControl().login)
    //login_post_route
    app.post('/login',guest,loginControl().postLogin)
    //register_get_route
    app.get('/register',guest,registerControl().registerr)
    //register_post_route
    app.post('/register',guest,registerControl().Postregister)
    ///logout register
    app.post('/logout',registerControl().logout)
    //menu
    app.get('/menu',menuControl().menu)
    //post-cart-update-request
    app.post('/updated-cart',menuControl().update)
}   

module.exports = initRoutes
