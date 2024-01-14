const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");
function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "passwd" },
      async (username, passwd, done) => {
        //check-if-username is present or not
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, {
            message: "No user registered with this account",
          });
        }

        bcrypt
          .compare(passwd, user.passwd)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged in Successfully" });
            }
            return done(null, false, { message: "Wrong password or username" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong" });
          });
      }
    )
  );
  passport.serializeUser((user, done) => {
    const serial_user={
      _id: user._id,
      role: user.role,
    }
    done(null,serial_user);
  });
  passport.deserializeUser(async (serial_user, done) => {
    try {
      const user = await User.findById(serial_user._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, null);
    }
  });
}

module.exports = init;
