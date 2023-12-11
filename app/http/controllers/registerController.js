const User = require('../../models/user')
const bcrypt= require('bcrypt')
function loginControl(){
    return{
        registerr(req,res)
        {
            res.render("auth/register")
        },

        async Postregister(req,res)
        {
            const {fname,username,passwd,phone_no} = req.body
            if(!fname || !username || !passwd ||!phone_no){
                req.flash('error','Dude just fill the whole form!!! Just do it')
                req.flash('name',fname)
                req.flash('user',username)
                req.flash('phone',phone_no)
                return res.redirect("/register")
            }
            
            //check if user is already present or not
            try{
                const result = await User.exists({ username: username });
                if (result) {
                    req.flash('name', fname);
                    req.flash('user', username);
                    req.flash('phone', phone_no);
                    req.flash('error', 'OOPS!! This Email is already registered');
                    return res.redirect('/register');
                }
            
                // Rest of the code...
            } catch (err) {
                // Handle the error, e.g., log it or redirect with an error flash message
                console.error(err);
                req.flash('error', 'An error occurred while checking user existence');
                res.redirect('/register');
            }
            // if everything is there and user is new (not registered before)
            /// hash_password before entering the db
            const hashedpass= await bcrypt.hash(passwd,10)

            // create user
            const new_user=new User({
                fname,
                username,
                passwd:hashedpass,
                phone_no
            })

            new_user.save().then((new_user)=>{
                // req.flash('new_user',fname)
                //registration complete
                res.redirect("/")
            }).catch(err =>{
                req.flash('error','Something went Wrong')
                res.redirect("/register")
            })
            // console.log(req.body)
            // res.render("auth/login")
        },
    }
}

module.exports = loginControl