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
	.get('/login', (req, res, next) => res.render('login'))
	.post('/login', (req, res, next) => {});

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

router.get('/createmeetup', (req, res, next) => res.render('createmeetup'));

router.get('/meetup', (req, res, next) => res.render('meetup'));

router.get('/meetups', (req, res, next) => res.render('viewmeetups'));


router.get('*', (req, res, next) => {

	res
	   .status(404)
	   .send('Page NotFound');
});




module.exports = router;