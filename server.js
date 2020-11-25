
const express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

const app = express();
const port = 3000;

current_path = __dirname;

app.use(bodyParser.urlencoded({extended : true}) ); //parses data coming from html


//-------------------------------
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/academydb", {useUnifiedTopology: true, useNewUrlParser: true});

const SessionSchema = new mongoose.Schema (
  { sname: String,
    instructor: String,
    instructor_email: String ,
    sdate: String
  });
const Session = mongoose.model("Session", SessionSchema);

const TraineeSchema = new mongoose.Schema (
  { email: String,
    pw: String
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

app.get('/create_session', (req, res) => res.render("pages/create_session", {title: 'New Session'}) );
app.get('/reminde', (req, res) => res.render("pages/reminde", {title: 'Reminde'}) );
app.get('/invite', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/invite', {title: 'Sessions', sessions: mySessions })
  });

});

app.post('/sessions', (req, res) =>
{
  const s = new Session({
    sname:            req.body.sname,
    instructor:       req.body.instructor,
    instructor_email: req.body.instructor_email,
    sdate:            req.body.sdate
  });
  s.save();
  res.send(`Success fully addd the Session`)
});

app.get('/all-sessions', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/all-sessions', {title: 'Sessions', sessions: mySessions })
  });

});

app.get('/register', (req, res) =>
{
  Session.find( (err, mySessions) => {
    res.render('pages/register', {title: 'Register'})
  });

});

app.post('/trainees', (req, res) =>
{
  const s = new Trainee({
    email:            req.body.email,
    pw:       req.body.pw,
  });
  s.save();
  res.send(`addd the Trainee Successfully`)
});



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

app.get('/invite-session', (req, res) =>
{
  Trainee.find( (err, trainee_list) =>
  {
    for (t of trainee_list)
    {
      send_email(t.email, req.query.sname )
    }
    console.log('Emails Done!')
  });

  res.send(`addd the Trainee Successfully`)
})

app.get('/invite-session', (req, res) =>
{
  session_id = req.query._id

  res.send(`addd the Trainee Successfully`)
});


//-------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
console.log('koko batatis');
