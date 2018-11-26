var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/userRedshift');

// Register
router.get('/register', function (req, res) {
	res.render('register', {layout: false});
});

// Login
router.get('/login', function (req, res) {
	res.render('login', {layout: false});
});



// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		//checking for email and username are already taken
		//		User.findOne({ username: {
		//			"$regex": "^" + username + "\\b", "$options": "i"
		//	}}, function (err, user) {
		//			User.findOne({ email: {
		//				"$regex": "^" + email + "\\b", "$options": "i"
		//		}}, function (err, mail) {
		//				if (user || mail) {
		//					res.render('register', {
		//						user: user,
		//						mail: mail
		//					});
		//				}
		//				else {
		var newUser = {
			name: name,
			email: email,
			username: username,
			password: password
		};
		User.createUser(newUser, res, function (err, user) {
			if (err) {
				console.log('out side error');
				res.writeHead(500, {
					'contet-type': 'text/html'
				});
				res.send('<h1>Error Connecting data<h1>');
			} else {
				//	console.log(user);
				req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/users/login');
			}
		});

		//				}
		//			});
		//		});
	}
});


passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, userlength) {
			if (err) throw err;
			//		console.log('inside');
			if (!userlength) {
				return done(null, false, {
					message: 'Unknown User'
				});
			}
			//  console.log(password);
			//console.log(User.password);
			User.comparePassword(username, password, User.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, username);
				} else {
					return done(null, false, {
						message: 'Invalid password'
					});
				}
			});
		});
	}));



passport.serializeUser(function (username, done) {
	console.log('insideserialize');
	done(null, username);
});

passport.deserializeUser(function (username, done) {
	console.log('insidedeserialize');
	//	User.getUserById(id, function (err, username) {
	done(null, username);
	//	});
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	}),
	function (req, res) {
		console.log('redirect');
		res.redirect('/');
	});



router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});



module.exports = router;