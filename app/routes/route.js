//const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Meetup = require('../models/meetup');
require('dotenv').config();


function loginRequired(req, res, next){
	if(!req.isAuthenticated()){
		return res.redirect('/login')
	}
	next();
}

router
	.use(function(req, res, next) {
		res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next()
	})

	//HOME PAGE
	.get('/', (req, res, next) => res.render('index'));

router
	.get('/register',  (req, res, next) => res.render('register', { message: ''}))
	.post('/register', (req, res) => {
		const newUser = new User({
			username: req.body.username
		});

		if(req.body.adminCode === process.env.adminCode){
			newUser.isAdmin = true;
		}

		User.register(newUser, req.body.password, (err, user) => {
			if(err){
				console.log("error message is: ", err.message)
				return res.render('register', {message: err.message});				
			}
			passport.authenticate("local")(req, res, () =>{
				res.redirect('/login');
			})
		})
	});

router
	.get('/login', (req, res, next) => res.render('login', {message: ''}))
	.post('/login', passport.authenticate('local', {
		//req.flash('error', 'Wrong username, password combination'),
		failureRedirect: '/login',
		successRedirect: '/'
	}));

router
	.get('/logout', (req, res) => {
		req.session.destroy((err) => {
			res.clearCookie('connect.sid'),
			res.redirect('/')
		})
		// req.logout();
		// res.redirect('/');
	});

router.get('/createmeetup', loginRequired, (req, res, next) => res.render('createmeetup'))
	  .post('/createmeetup', loginRequired, (req, res, next) => {
		  //console.log(req.user);

		  const newMeetup = new Meetup({
			  group: req.body.group,
			  topic: req.body.topic,
			  venue: req.body.venue,
			  time: req.body.time,
			  author: {
				  id: req.user._id,
				  username: req.user.username
				}
		  	});

		   console.log('new meetup: ', newMeetup);

		   newMeetup.save((err) => {
			   if(err){
				   console.log(err)
			   }
			   res.redirect('/meetups')
		   })
		
	  })

router.get('/meetup', (req, res, next) => res.render('meetup'));

router.get('/meetups', (req, res, next) => res.render('viewmeetups'));

//router.get('/user/:id')
router.get('*', (req, res, next) => {

	res
	   .status(404)
	   .send('Page NotFound');
});




module.exports = router;