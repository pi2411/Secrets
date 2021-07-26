//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const encrypt = require("mongoose-encryption");
const app = express();
const mongoose = require("mongoose");
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

console.log(process.env.API_KEY);


mongoose.connect('mongodb://localhost:27017/userDB',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const userSchema = new mongoose.Schema({
  email:String,
  password:String,
})
//const secret = "Thisisouerlitilesecret.";
userSchema.plugin(encrypt, { secret: process.env.SECERT, encryptedFields: ["password"] });

const User = mongoose.model("user",userSchema);


app.get("/",function(req,res){
  res.render("home");
})
app.route("/login")
.get(function(req,res){
  res.render("login");
})
.post(function(req,res){
  const userName = req.body.username;
  const passWord = req.body.password;
  //console.log(passWord);
  User.findOne({email:userName},function(err,foundUser){
      if(err){
        console.log(err)
      }else{
        if(foundUser){
          if(foundUser.password === passWord){
            // console.log(foundUser.password);
            res.render("secrets");
          }
        }
      }
  })
})


app.route("/register")
.get(function(req,res){
  res.render("register");
})
.post(function(req,res){
  const userName = req.body.username;
  const passWord = req.body.password;
   // res.send(passWord);
  newUser = User({
    email:userName,
    password:passWord,
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      res.send(err);
    }
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
