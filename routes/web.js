    //controller imports
    const homeControl=require('../app/http/controllers/homeController')
    const aboutControl=require('../app/http/controllers/aboutController')
    const cartControl = require('../app/http/controllers/cartController')
    const registerControl=require("../app/http/controllers/registerController")
    const menuControl = require('../app/http/controllers/menuController')
    const loginControl=require('../app/http/controllers/loginController')
    const orderControl = require('../app/http/controllers/ordersController')
    const adminControl=require('../app/http/controllers/adminController')

    //middlewares
    const auth=require('../app/http/middlewares/auth')
    const guest = require('../app/http/middlewares/guest')
    const adminAuth=require('../app/http/middlewares/admin')

    //main route function
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
        //orders
            app.get('/orders',auth,orderControl().orders)
            app.post('/orders',auth,orderControl().store)

            app.get('/orders/:id',auth,orderControl().singleOrder)


        //admin routes
            app.get('/admin/orders',adminAuth,adminControl().orders)
        //admin order status
            app.post('/admin/orders/status',adminAuth,adminControl().orderStatusUpdate)
    }   

    module.exports = initRoutes
