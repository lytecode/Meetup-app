const express =  require('express'),
	  app = express(),
	  bodyParser = require('body-parser'),
	  ejs = require('ejs'),
	  flash = require('connect-flash'),
	  methodOverride = require('method-override'),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  LocalStrategy = require('passport-local').Strategy,
	  session = require('express-session'),
	  urlencodedParser = bodyParser.urlencoded({extended: false});
	  require('dotenv').config();
	  
//Requiring routes
const router = require('./app/routes/route');
const User = require('./app/models/user');


const mongodb = require('./config/mongoDB');


const PORT = process.env.PORT || 3000;

app.use(urlencodedParser);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));


//passport config
app.use(require('express-session')({
	secret: 'Get this baby cooking',
	resave: false,
	saveUninitialized: false
}))


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
})
	

app.use(router);


app.listen(PORT, () =>{
	console.log(`app started on port ${PORT}`);
});
