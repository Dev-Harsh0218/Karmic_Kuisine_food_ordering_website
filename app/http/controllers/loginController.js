const User = require("../../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

function loginControl() {
  return {
    login(req, res) {
      res.render("auth/login");
    },

    postLogin(req, res, next) {
      
      const {username,passwd} = req.body
            if(!username || !passwd){
              req.flash('error','All the fields are required')
              return res.redirect("/login")
            }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }

        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }
          return res.redirect("/");
        });
      })(req, res, next);
    },
  };
}

module.exports = loginControl;
