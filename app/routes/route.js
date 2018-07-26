const bodyParser = require('body-parser');
const express = require('express');
//const mongoose = require('mongoose');
const router = express.Router();
//const User = require('../models/User.js');
require('dotenv').config();
let conex = require('../../config/database');


const urlencodedParser = bodyParser.urlencoded({extended: false});

//connection to databse
//mongoose.connect(process.env.DB_URL);
//const dbConnection = mongoose.connection;
//dbConnection.on('connected', () => console.log('db connected successfully'));
//dbConnection.on('error', () => console.log('Ooops! Something went wrrong with db connection'));



router.get('/', (req, res, next) => res.render('index'));

router
	.get('/login', (req, res, next) => res.render('login', {message: ''}))
	.post('/login', urlencodedParser, (req, res, next) => {
		const checkUser = `SELECT username, password FROM users where username ='${req.body.username}' AND password='${req.body.password}'`;
		conex.raw(checkUser)
			.then(data => {
				if( data[0].length <= 0){
					const message = 'Username and password mismatch';
					res.render('login', {message: message});
				}else{
					const username = data[0][0]['username'];
					const password = data[0][0]['password'];
					if(req.body.username === username && req.body.password === password){
						res.redirect('/');
					}else{
						const message = 'Username or password mismatch';
						res.render('login', {message: message});
					}
				}
			})
			.catch(err => res.send(err))
	});

router
	.get('/register',  (req, res, next) => res.render('register', { message: ''}))
	.post('/register', urlencodedParser, (req, res, next) => {

		const user = {
			username: req.body.username,
			password: req.body.password
		}
		
		//console.log(user, user.username);

		const checkUser = `SELECT COUNT(*) FROM users where username ='${user.username}'`;

		conex.raw(checkUser)
			.then(data => {
				const userCount = data[0][0]['COUNT(*)'];
				if(userCount > 0){
					//username already exist
					const message = `Someone already beat you to it, choose another username`
					res.render('register', {message: message});
					
				}else{
					//we create and store the username and password
					let createuser = `INSERT INTO USERS (username, PASSWORD) VALUES ('${user.username}', '${user.password}');`
					conex.raw(createuser)
						.then(res.redirect('/login'))
						.catch(err => res.send(err))
				}
			})
			.catch(err => console.log(err))
		

	});

router.get('/createmeetup', (req, res, next) => res.render('createmeetup'))
	  .post('/createmeetup', urlencodedParser, (req, res, next) => {
		  const meetup = {
			group: req.body.group,
			topic: req.body.topic,
			description: req.body.description,
			venue: req.body.venue,
			schedule: req.body.schedule,
			banner: req.body.banner
		  }
		  
		  console.log('meetup: ', meetup)

		  const query = `INSERT INTO events (organizer, theme, description, venue, period, image) 
							  VALUES ('${meetup.group}','${meetup.topic}', '${meetup.description}', '${meetup.venue}', '${meetup.period}', '${meetup.image}' )`;
			
		  //console.log(query);
		  conex.raw(query)
		  		.then(data => {
					  const message = 'Meetup created successfully';
					  res.redirect('/meetups');
				  })
				.catch(err => res.send(err))
	  })

router.get('/meetup', (req, res, next) => res.render('meetup'));

router.get('/meetups', (req, res, next) => res.render('viewmeetups'));


router.get('*', (req, res, next) => {

	res
	   .status(404)
	   .send('Page NotFound');
});




module.exports = router;