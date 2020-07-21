require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const postman = require("postman");
const helmet = require("helmet");
const redis = require("redis");
const session = require("express-session");
const mongoose = require('mongoose');
const passport= require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const _ = require("lodash");
const findOrCreate = require("mongoose-findOrcreate");




const homeStartingContent ="";
const aboutContent="";
const cartContent="";
const registerContent="";
const loginContent="";
const forgotContent="";
const updateContent=""

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




app.use(session({
  secret: 'secret session key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//
mongoose.connect("mongodb+srv://osanyin1986:trendytrendy@123@cluster0-co28s.mongodb.net/RubbyDB",
{ useNewUrlParser: true , useUnifiedTopology: true , useFindAndModify:  false});
//
// mongoose.connect("mongodb://localhost:27017/BRubbyDB",{ useNewUrlParser: true ,
//   useUnifiedTopology: true,
//   useCreateIndex: true });

mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    confirmpassword:String,
    googleId:String
});

const helpSchema = new mongoose.Schema ({
  name:{type:String,
      require:true},
  email:{type:String,
      require:true},
  subject:{type:String,
      require:true},
  message:{type:String,
      require:true}
});

 userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

 const User = mongoose.model("User", userSchema);
const  Help = mongoose.model("Help", helpSchema);


 passport.use(User.createStrategy());



 passport.serializeUser(function(user, done) {
   done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
     done(err, user);
   });
 });



  app.get("/" ,function (req, res) {
    res.render("home" , {startingContent: homeStartingContent});

  });


  app.get("/compose" , function (req, res) {
    res.render("Compose")
  });

   app.get("/about" ,function (req, res) {
     res.render("about" , {welcome: aboutContent});
   });


  app.get("/help", function (req, res) {
    res.render("help")
  });

   app.get("/update", function (req, res) {
     res.render("update", {updateContent: updateContent});
   });

   app.get("/login" ,function (req, res) {
     res.render("login" , {loginContent: loginContent});
   });

   app.get("/register" ,function (req, res) {
     res.render("register" , {registerContent: registerContent});
   });

   app.get("/cart" ,function (req, res) {
     res.render("cart" , {cartContent: cartContent});
   });

   app.get("/forgot" , function (req, res) {
     res.render("forgot", {forgotContent: forgotContent});
   });


    app.post("/register",function (req, res) {

    User.register(({firstname: req.body.firstName,lastname:req.body.lastName,
      username:req.body.username}),
      (req.body.password, req.body.confirmpassword),
       function(err, user){
        if(err){
          console.log(err);

          res.redirect("/register")
        }else{
          passport.authenticate("local")(req, res, function () {
            res.redirect("/login")
          })
        }
      });
    });




    app.post("/login" , function (req, res) {

      const user = new User({
        username: req.body.username,
        password: req.body.password
      });

      req.login(user, function (err) {
        if (err) {
          console.log(err);
        } else{
          passport.authenticate("local")(req, res,function () {
            res.redirect("/");
          });
        }
      });
    });


    app.post("/help", function(req, res){

      const help = new Help({
             name:req.body.name,
             email:req.body.email,
             subject:req.body.subject,
             message:req.body.message
     });
    help.save(function(err){
    if (!err)
        res.redirect("/");

      });
    });









    let port = process.env.PORT;
    if (port == null || port == "") {
      port = 3000;
    }

    app.listen(3000, function() {
      console.log("Server started as started Successfully");
    });
