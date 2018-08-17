const fs = require('fs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');
const Meetup = require('../models/meetup');
const multer = require('multer');
require('dotenv').config();
const middleware = require('../middleware/index');

//multer configuration
const multerConfig = {
	storage: multer.diskStorage({
		destination: function(req, file, next){
			next(null, './public/images');
		},
		filename: function(req, file, next){
			const ext = file.mimetype.split('/')[1];
			next(null, file.fieldname + '-' + Date.now() + '.' + ext);
		}
	}),
	filefilter: function(req, file, next){
		const image = file.mimetype.startWith('image');
		if(!file){
			next();
		}
		if(image){
			next(null, true);
		}
		else{
			next({message: 'Only image file is allowed'}, false)
		}
	}
}


function loginRequired(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	req.flash('error', 'You must be signed in to do that!');
	res.redirect('/login');
}

router
	.use(function(req, res, next) {
		res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		next()
	})

	//HOME PAGE
	.get('/', (req, res, next) => res.render('index', {user: req.user}));

//Register a User or Admin
router
	.get('/register',  (req, res, next) => res.render('register', { message: '', user: req.user}))
	.post('/register', (req, res) => {
		const newUser = new User({
			username: req.body.username
		});

		if(req.body.adminCode === process.env.adminCode){
			newUser.isAdmin = true;
		}

		User.register(newUser, req.body.password, (err, user) => {
			if(err){
				console.log("error message is: ", err.message);
				const error = err.message;
				return res.render('register', {error, user: ''});				
			}
			passport.authenticate("local")(req, res, () =>{
				res.redirect('/');
			})
		})
	});

//Login page
router
	.get('/login', (req, res, next) => res.render('login', {message: '', user: req.user}))
	.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
        successFlash: 'Welcome to DevSquare!'

	}));

//Logout 
router
	.get('/logout', (req, res) => {
		req.session.destroy((err) => {
			res.clearCookie('connect.sid'),
			res.redirect('/')
		})
	});

//Create an Event and upload an image
router.get('/new', loginRequired, (req, res, next) => res.render('createmeetup', {user: req.user}))
	  .post('/new', loginRequired, multer(multerConfig).single('image'), (req, res, next) => {

	  	let filePath = '/img/default-meetup-image.png'; //default image

		//Replace default image with User uploaded image
		if(req.file){
			const path = req.file.path;
			const regEx = /public\\(?=images)/;
			filePath = path.replace(regEx, '\\');
		}

		//Create a meetup object
		const newMeetup = new Meetup({
			group: req.body.group,
			topic: req.body.topic,
			venue: req.body.venue,
			time: req.body.time,
			imageURL: filePath,
			author: {
				id: req.user._id,
				username: req.user.username
			}
		});

		newMeetup.save((err) => {
			if(err){
				console.log(err)
			}
			res.redirect('/meetups')
		})
		
	});

//View a single event
router.get('/meetup/:id', (req, res, next) => {
	Meetup.find({_id: req.params.id}, (err, meetup) => {
		if(err){
			console.log(err);
		}
		
		res.render('meetup', {meetup: meetup, user: req.user});
	});
});


//Edit an event or meetup
router.put('/meetup/:id', loginRequired, multer(multerConfig).single('image'), middleware.checkUserMeetup, (req, res) => {
	
	const updateMeetup = {
		group: req.body.group,
		topic: req.body.topic,
		venue: req.body.venue,
		time: req.body.time
	};

	//add image path on image upload
	if(req.file){
		//find the previous uploaded image and remove it from public/images path
		Meetup.findById(req.params.id, (err, meetup) => {
			if(err){
				req.flash('error', 'You must be doing something illegal! :)');
			}
			const thisPath = './public'+meetup.imageURL;
			fs.unlink(thisPath, (err) => {
				if(err) return console.log(err);

				console.log('previous image file deleted');
			});
		})

		const regEx = /public\\(?=images)/;  //match words starting with public/images
		updateMeetup.imageURL = req.file.path.replace(regEx, '\\');
	}

	//update the meetup
	Meetup.findByIdAndUpdate(req.params.id, { $set: updateMeetup }, (err, meetup) => {
		if(err){
			console.log(err);
			res.redirect('back');
		}else{
			res.redirect('/meetup/' + req.params.id);
		}
	})
})

//save a seat to attend the event
router.put('/join/:id', loginRequired, (req, res) => {
	const currentUser = req.user.username;

	Meetup.findById(req.params.id, (err, meetup) => {
		if(err) return console.log(err);

		//check if the user has registered before
		if(!meetup.registered.includes(currentUser)){
			meetup.registered.push(currentUser);
		
			meetup.save(err => {
				if(err) return console.log(err);

				req.flash('success', 'Thanks for registering for this event');
				res.redirect('/meetups');
			});
		}
		else{
			req.flash('error', 'You have already registered for this event');
			res.redirect('/meetup/' + req.params.id);
		}
		
		
	})
});


router.get('/meetups', (req, res, next) => {
	//find all meetups
	Meetup.find({}, (err, meetups) => {
		if(err){
			console.log(err);
		}
		
		res.render('meetups', {
			meetups: meetups,
			user: req.user
		});
	})
});

//router.get('/user/:id')
router.get('*', (req, res, next) => res.render('404'));




module.exports = router;