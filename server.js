/////// import shittttt
//dotenv for you know thats how we do it in MERN
require("dotenv").config();
//expresss
const express = require("express");
const app = express();
const path = require("path");
///ejs and stufff
const ejs = require("ejs");
const expresLayout = require("express-ejs-layouts");
//serving port
const PORT = process.env.PORT || 3000;
//db
const mongoose = require("mongoose");
//session shittt
const session = require("express-session");
const MongoDbStore = require("connect-mongo");
const flash = require("express-flash");
const Emitter=require('events')
//passport
const passport = require("passport");


app.use((req, res, next) => {
  res.locals.user = null;
  next();
});
//// db connection
const db_uri=process.env.MONGO_URI
try {
  const db_connection = mongoose
    .connect(db_uri)
    .catch((error) => {
      handleError(error);
    });
  mongoose.connection.on("error", (err) => {
    logError(err);
  });
  console.log("connection done with the mongo");
} catch (error) {
  handleError(error);
}

//sessionStore
const mongoStore = MongoDbStore.create({
  mongoUrl: "mongodb://127.0.0.1:27017/Karmic_Kuisine",
  collection: "session",
  SameSite: "none",
  autoRemove: "native",
});

//Event Emitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)

app.use(
  session({
    secret: process.env.COOKIE_SECRET || "Harsh_Bhardwaj",
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    // cookie:{maxAge: 1000*60*60*24}
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
/// for flash messages or normal messages
//passport config
app.use((req, res, next) => {
    res.locals.session = req.session;
    if (req.isAuthenticated() && req.session.passport) {
      res.locals.user = req.session.passport.user;
  } else {
      res.locals.user = null;
  }
    next();
});

app.use(flash());
//assets
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//set template engine
app.use(expresLayout);
app.set("views", path.join(__dirname, "resources/views/"));
app.set("view engine", "ejs");
require("./routes/web")(app);
app.use((req,res)=>{
  res.send(404).render('errors/404')
})
app.use(express.static(path.join(__dirname,'public')));


//consolse.log
const server=app.listen(PORT, () => {
  console.log(`Harsh is the done coder ever  ${PORT}`);
});

//socket
const io=require('socket.io')(server)
io.on('connection',(socket)=>{
    //join
    socket.on('join',(orderId)=>{
      socket.join(orderId);
    })
})

eventEmitter.on('orderUpdate',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(result)=>{
  io.to('adminRoom').emit('orderPlaced',result)
})