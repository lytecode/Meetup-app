const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//connection to databse
mongoose.connect(process.env.DB_URL);
const dbConnection = mongoose.connection;
dbConnection.on('connected', () => console.log('db connected successfully'));
dbConnection.on('error', () => console.log('Ooops! Something went wrrong with db connection'));



router.get('/', (req, res, next) => {
	res
		.status(200)
		.render('index')
		//.json({message: 'Welcome to meetup app'});
});

router.get('/login', (req, res, next) => {
	res
		.status(200)
		.render('login')
});

router.get('/register', (req, res, next) => {
	res
		.status(200)
		.render('register')
});

router.get('/createmeetup', (req, res, next) => {
	res
		.status(200)
		.render('createmeetup')
});

router.get('/meetup', (req, res, next) => {
	res
		.status(200)
		.render('meetup')
});

router.get('/meetups', (req, res, next) => {
	res.
		status(200)
		.render('viewmeetups')
});

router.get('*', (req, res, next) => {

	res
	   .status(404)
	   .send('Page NotFound');
});




module.exports = router;