//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const myFunction = require(__dirname + "/myFunction.js");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const ytURLSchema = new mongoose.Schema ({
  list: String,
  url: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const ytURL = new mongoose.model("ytURL", ytURLSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
  let day = myFunction.getDate();
  let randomPicUrl = "fateHF/HF3-countdown100_" + myFunction.random() + ".jpg";
  const query = "HongKong";
  const apiKey = "aafac5629766fae5094fb5983f854995";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric";
  var randomYtUrl = 0;

  https.get(url, function(response){
//    console.log(response.statusCode);

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      let temp = weatherData.main.temp;
      let weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      let imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      let clockMinutes = myFunction.currentTime().clockMinutes;
      let clockHours = myFunction.currentTime().clockHours;
      let clockDate = myFunction.currentTime().clockDate;
      let clockMonth = myFunction.currentTime().clockMonth;
      ytURL.count({}, function(err, data){
        console.log(data);
//        Math.floor(Math.random()*data + 1);
        ytURL.findOne({list:Math.floor(Math.random()*data + 1)}, function(err, result){
          if (err){
            console.log(err);
          }else {
            console.log(result.url);
            const randomYtUrl = "https://www.youtube.com/embed/" + result.url;
            res.render("home", {ytURL:randomYtUrl,kindOfDay:day,randomPicUrl:randomPicUrl,temp:temp,weatherDescription:weatherDescription,imageURL:imageURL,clockMinutes:clockMinutes,clockHours:clockHours,clockDate:clockDate,clockMonth:clockMonth});
          }
        });
      });
    });
  });
});

app.get("/about", function(req, res){
  let day = myFunction.getDate();
  let randomPicUrl = "fateHF/HF3-countdown100_" + myFunction.random() + ".jpg";
  let clockMinutes = myFunction.currentTime().clockMinutes;
  let clockHours = myFunction.currentTime().clockHours;
  let clockDate = myFunction.currentTime().clockDate;
  let clockMonth = myFunction.currentTime().clockMonth;

  if (req.isAuthenticated()){
    res.render("about", {kindOfDay:day,randomPicUrl:randomPicUrl,clockMinutes:clockMinutes,clockHours:clockHours,clockDate:clockDate,clockMonth:clockMonth});
  } else {
    res.redirect("/login");
  }
});

app.get("/contact", function(req, res){
  let day = myFunction.getDate();
  let randomPicUrl = "fateHF/HF3-countdown100_" + myFunction.random() + ".jpg";
  let clockMinutes = myFunction.currentTime().clockMinutes;
  let clockHours = myFunction.currentTime().clockHours;
  let clockDate = myFunction.currentTime().clockDate;
  let clockMonth = myFunction.currentTime().clockMonth;

  res.render("contact", {kindOfDay:day,randomPicUrl:randomPicUrl,clockMinutes:clockMinutes,clockHours:clockHours,clockDate:clockDate,clockMonth:clockMonth});
});

app.get("/login", function(req, res){
  let day = myFunction.getDate();
  let randomPicUrl = "fateHF/HF3-countdown100_" + myFunction.random() + ".jpg";
  let clockMinutes = myFunction.currentTime().clockMinutes;
  let clockHours = myFunction.currentTime().clockHours;
  let clockDate = myFunction.currentTime().clockDate;
  let clockMonth = myFunction.currentTime().clockMonth;

  res.render("login", {kindOfDay:day,randomPicUrl:randomPicUrl,clockMinutes:clockMinutes,clockHours:clockHours,clockDate:clockDate,clockMonth:clockMonth});
});

app.post("/contact", function(req, res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err){
      console.log(err);
      res.redirect("/contact");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/about");
      });
    }
  });
});

app.post("/login", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if (err){
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/about");
      });
    }
  });
});

app.post("/about", function(req, res){
  ytURL.create({list: req.body.list, url: req.body.ytURL});
  res.redirect("/");
});

app.listen(3000, function(){
  console.log("server is running on port 3000");
});
