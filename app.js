const express = require('express');
const app = express();
const session = require('express-session');


var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var passport = require("passport");
var LocalStrategy = require("passport-local");
// var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

const port = 3000;

Registertitle="Register";
Registerref="/register";
loginout="Sign In";
loginoutref="/login";

current_path = __dirname;

app.use(bodyParser.urlencoded({extended : true}) ); //parses data coming from html
app.use(bodyParser.json())
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}));

//me
app.use(require("express-session")({
    secret:"Miss white is my cat",
    resave: false,
    saveUninitialized: false
}));

// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


//-------------------------------
const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");//me1


mongoose.connect("mongodb://localhost:27017/academydb", {useUnifiedTopology: true, useNewUrlParser: true});

// // schema 1
// //me2
// var UserSchema = new mongoose.Schema({
//      username:String,
//      password:String
// });

// UserSchema.plugin(passportLocalMongoose);
// module.exports = mongoose.model("User",UserSchema);

// schema 2
const SessionSchema = new mongoose.Schema (
  { sname: String,
    stitle: String,
    instructor: String,
    instructor_email: String ,
    sdate: String,
    temails: [String]
  });
const Session = mongoose.model("Session", SessionSchema);


// schema 3
const TraineeSchema = new mongoose.Schema (
  { username: String,
    email: String,
    pw: String,
    role: String,
    sessions: [SessionSchema]
  });

const Trainee = mongoose.model("Trainee", TraineeSchema);

//--------------------------------------------------------


app.use(express.static('public'));
app.use('/css', express.static(current_path + 'public/css'));
app.use('/js', express.static(current_path + 'public/js'));
app.use('/images', express.static(current_path + 'public/images'));
app.use('/fonts', express.static(current_path + 'public/fonts'));



// set the view engine to ejs
app.set('view engine', 'ejs');


app.get('/', (req, res) => res.render("pages/index", {title: 'Home'}) );

app.get('/login', (req, res) => res.render("pages/login", {title: 'Login'}) );

app.get('/admin', (req, res) => res.render("pages/admin", {title: 'Admin'}) );

app.get('/services', (req, res) => res.render("pages/services", {title: 'Services'}) );
app.get('/contacts', (req, res) => res.render("pages/contacts", {title: 'Contacts'}) );
app.get('/aboutus', (req, res) => res.render("pages/aboutus", {title: 'About Us'}) );
app.get('/profile', (req, res) => res.render("pages/profile", {title: 'Profile'}) );


app.get('/create_session', (req, res) => res.render("pages/create_session", {title: 'New Session'}) );
app.get('/reminde', (req, res) => res.render("pages/reminde", {title: 'Reminde'}) );
app.get('/invite', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/invite', {title: 'Sessions', sessions: mySessions });
  });

});

app.get('/logout', (req, res) =>{ res.redirect("/");
Registertitle="Register";
Registerref="/register";
loginout="Sign In";
loginoutref="/login";

});


app.get('/programmingLanguages', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/programmingLanguages', {title: 'programming Languages', sessions: mySessions })
  });

});

app.get('/all-sessions', (req, res) =>
{
  Session.find( (err, mySessions) => 
  {
    res.render('pages/all-sessions', {
      title: 'Sessions', 
      sessions: mySessions,
      current_user:current_user 
    });
      
  });

});
app.get('/trainers', (req, res) =>
{
    Session.find( (err, mySessions) => {
    res.render('pages/trainers', {title: 'Our trainers', sessions: mySessions });
  });

});
app.get('/trainees', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/trainees', {title: 'Trainees', sessions: mySessions });
  });

});

app.get('/register', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/register', {title: 'Register'});
  });

});

// app.post('/Login',(req, res) =>
// {
//   req.body.email
// })


app.post('/sessions', (req, res) =>
{
  const s = new Session({
    sname:            req.body.sname,
    stitle:           req.body.stitle,
    instructor:       req.body.instructor,
    instructor_email: req.body.instructor_email,
    sdate:            req.body.sdate
  });
  s.save();
  console.log(req.body.sdate)
  res.send(`Success fully add the Session`);
});



app.post('/trainees', (req, res) =>
{
  console.log(req.body);
  const s = new Trainee({
    username: req.body.username,
    email:    req.body.email,
    pw:       req.body.pw,
    role:     "trainee"
  });
  s.save();
  res.send(`add the Trainee Successfully`);
});



//--------SEND EMAIL-----------------------

function send_email(to_email, session_name)
{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ghoroub.bostagi@gmail.com',
      pass: 'kgsupwbgggkidhof'
    }
  });

  msg = `you are invited to ${session_name} please got to our website http://localhost:3000/`
  var mailOptions = {
    from: 'no-reply@gmail.com',
    to: to_email,
    subject: 'New Session is Availale Welcome 😀',
    text: msg
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
//-------------------------------

app.get('/invite-session', (req, res) =>
{
  Trainee.find( (err, trainee_list) =>
  {
    for (t of trainee_list){
      send_email(t.email, req.query.sname );
    }
    console.log('Emails Done!');
  });

  res.send(`add the Trainee Successfully`);
});


current_user = ''
app.post('/login-page', (req,res) =>
{
    console.log(req.body);
    Trainee.findOne({email: req.body.email}, function(err, item){
      if (item.email == 'gbostaji@kau.edu.sa')
      {
        console.log(`hi`);
        res.render("pages/admin", {title: 'Admin'}) ;
      }
      else if (item==null)
        console.log("not found");//wrong user name
      else if (item.pw==req.body.pw)
      {
        console.log(" found");
        current_user = req.body.email
        Registertitle ="Welcome "+item.username + " !";
        Registerref   ="/profile";
        loginout      ="Sign Out";
        loginoutref   ="/logout";
        res.render("pages/index", {
          title: 'Home', 
          current_user: current_user});
      }
      else {
          console.log("not correct");//wrong password
      }
    });

});

app.get('/enroll', (req, res) =>
{
  Session.findOne({_id: req.query.session}, (err, mySession) => 
  {
    console.log(mySession)
    t = Trainee.findOne({email: req.query.email}, (err, t) => {
      
      t.sessions.push(mySession);
      t.save();

      mySession.temails.push(t.email);
      mySession.save();
      
      res.send('OK registered !!!!');  
      console.log(t)
    });
      
  });

});


// app.get('/invite-session', (req, res) =>
// {
//   session_id = req.query._id
//
//   res.send(`add the Trainee Successfully`)
// });


//-------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
console.log('Welcome To Programmers Academy DB');
