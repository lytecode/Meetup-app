const express =  require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  ejs = require('ejs'),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local').Strategy,
	  urlencodedParser = bodyParser.urlencoded({extended: false});
	  require('dotenv').config();
	  
//Requiring routes
const router = require('./app/routes/route');
	  User = require('./app/models/user');


const mongodb = require('./config/mongoDB');


const PORT = process.env.PORT || 5000;

app.use(urlencodedParser);
app.use(express.static('public'));
app.set('view engine', 'ejs');



//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
	

app.use(router);


app.listen(PORT, () =>{
	console.log(`app started on port ${PORT}`);
});
