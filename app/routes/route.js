//const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
require('dotenv').config();



router.get('/', (req, res, next) => res.render('index'));

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
		failureRedirect: '/login',
		successRedirect: '/'
	}));


router.get('/createmeetup', (req, res, next) => res.render('createmeetup'))
	  .post('/createmeetup', (req, res, next) => {
		
	  })

router.get('/meetup', (req, res, next) => res.render('meetup'));

router.get('/meetups', (req, res, next) => res.render('viewmeetups'));


router.get('*', (req, res, next) => {

	res
	   .status(404)
	   .send('Page NotFound');
});




module.exports = router;