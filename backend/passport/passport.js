var passport = require('passport');
var bcrypt = require('bcrypt');
var async = require('async');
var LocalStrategy = require('passport-local').Strategy;
// secrets = require('./secrets'),
var User = require('../db/sql').User;

// Passport required serialization
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// passport required deserialize find user given id from serialize
passport.deserializeUser(function(id, done) {
	User.find({
		where : {
			id : id
		}
	}).success(function(user) {
		done(null, user);
	}).failure(function(error) {
		done(error, null);
	})
});

// Use bcrypt to hash user's plaintext password - plaintext is bad - hashed is
// good - bcrypt is great
exports.hashPassword = function(plaintext_password, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return new Error(
					'backend/passport/passport.js: bcrypt salting error');
		}
		bcrypt.hash(plaintext_password, salt, function(error, password) {
			if (error) {
				return new Error(
						'backend/passport/passport.js: bcrypt hashing error');
			}
			callback(null, password);
		});
	});
}

// Helper function to test for valid value
function isEmptyOrNull(value) {
	return (value === null || value == '' || value == undefined);
};

// Create a local user
exports.localAuthentication = function(req, res) {
	// If not a valid role, something fishy is going on. Bail out.
	if (req.body.role != 'USER' && req.body.role != 'ADMIN') {
		throw new Error('Invalid role!');
	}
	var password = null;
	async.waterfall([
	// make sure username has not already been taken
	function validateUsername(callback) {
		User.find({
			where : {
				username : req.body.username
			}
		}).done(function(error, user) {
			if (user) {
				return res.json({
					error : {
						username : 'Username is already being used'
					}
				});
			}
			callback(null);
		});
	},
	// encrypt password and pass it to create user
	function encryptPassword(callback) {
		if (req.body.password === req.body.confirm_password) {
			exports.hashPassword(req.body.password, callback)
		} else {
			return res.json({
				error : {
					confirm_password : 'Passwords do not match'
				}
			});
		}
	},
	// create user with hashed password
	function createUser(hashed_password, callback) {

		User.create({
			username : req.body.username,
			role : req.body.role,
			email_address : req.body.email_address,
			password : hashed_password
		}).success(function(user) {
			req.user = req.session.user = user;
			res.json({
				redirect : '/login'
			});
		}).error(function(err) {
			return res.json({
				error : err
			});
		})
	} ]);
};

// Sign in using username and Password.
passport.use(new LocalStrategy(function(username, password, done) {
	async.waterfall([
	// look for user with given username
	function findUser(callback) {

		User.find({
			where : {
				username : username
			}
		}).success(function(user) {
			callback(null, user);
		}).failure(function(error) {
			return done(null, false, {
				message : 'User not found'
			});
		})
	},
	// make sure password is valid
	function comparePassword(user, callback) {
		if (!user) {
			return done(null, false, {
				message : 'Invalid email or password.'
			});
		}

		bcrypt.compare(password, user.password, function(err, match) {
			if (match) {
				return done(null, user);
			} else {
				return done(null, false, {
					message : 'Invalid email or password.'
				});
			}
		});
	} ]);
}));
