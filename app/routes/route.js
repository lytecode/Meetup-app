//const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Meetup = require('../models/meetup');
const multer = require('multer');
require('dotenv').config();

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
	.get('/', (req, res, next) => res.render('index', {user: req.user}));

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
				console.log("error message is: ", err.message)
				return res.render('register', {message: err.message});				
			}
			passport.authenticate("local")(req, res, () =>{
				res.redirect('/login');
			})
		})
	});

router
	.get('/login', (req, res, next) => res.render('login', {message: '', user: req.user}))
	.post('/login', passport.authenticate('local', {
		failureRedirect: '/login',
		successRedirect: '/'

	}));

router
	.get('/logout', (req, res) => {
		req.session.destroy((err) => {
			res.clearCookie('connect.sid'),
			res.redirect('/')
		})
	});

router.get('/createmeetup', loginRequired, (req, res, next) => res.render('createmeetup', {user: req.user}))
	  .post('/createmeetup', loginRequired, multer(multerConfig).single('image'), (req, res, next) => {
		  //console.log(req.user);
		  //console.log(req.body)
		  //res.send('image uploaded')
		  if(!req.file){
			//   console.log('file: ', req.file);
			//   req.body.image = req.file.filename;
			//   console.log(req.body.image)

			//   console.log('body: ', req.body);
		  }

		  const newMeetup = new Meetup({
			  group: req.body.group,
			  topic: req.body.topic,
			  venue: req.body.venue,
			  time: req.body.time,
			  imageURL: req.file.path,
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

router.get('/meetup/:id', (req, res, next) => {
	Meetup.find({_id: req.params.id}, (err, meetup) => {
		if(err){
			console.log(err);
		}
		
		res.render('meetup', {meetup: meetup, user: req.user});
	});
});


router.get('/meetups', (req, res, next) => {
	//find all meetups
	Meetup.find({}, (err, meetups) => {
		if(err){
			console.log(err);
		}
		
		res.render('viewmeetups', {
			meetups: meetups,
			user: req.user
		});
	})

});

router.get('/user/:id', (req, res) => {
	if(req.user){
		console.log('got a user:', req.user);
		const name = req.user.name;
	}
})

//router.get('/user/:id')
router.get('*', (req, res, next) => res.render('404'));




module.exports = router;