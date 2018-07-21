const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User.js');

const urlencodedParser = bodyParser.urlencoded({extended: false});

//connection to databse
mongoose.connect(process.env.DB_URL);
const dbConnection = mongoose.connection;
dbConnection.on('connected', () => console.log('db connected successfully'));
dbConnection.on('error', () => console.log('Ooops! Something went wrrong with db connection'));



router.get('/', (req, res, next) => res.render('index'));

router
	.get('/login', (req, res, next) => res.render('login'))
	.post('/login', (req, res, next) => {});

router
	.get('/register',  (req, res, next) => res.render('register'))
	.post('/register', urlencodedParser, (req, res, next) => {
		
		//validate user input and remove all special characters
		const username = req.body.username
			  password = req.body.password;

		if(username === '' || password === ''){
			let message = 'Please obey the contract';
			return;
		}
		else{
			const user = new User({
				username,
				password
			});

			user.save((err, user) => {
				if(err) 
					res.send(err)
				else{
					message = `Welcome ${user.username}`;
					res.redirect('/');
				}
			})
		}
	});

router.get('/createmeetup', (req, res, next) => res.render('createmeetup'));

router.get('/meetup', (req, res, next) => res.render('meetup'));

router.get('/meetups', (req, res, next) => res.render('viewmeetups'));


router.get('*', (req, res, next) => {

	res
	   .status(404)
	   .send('Page NotFound');
});




module.exports = router;