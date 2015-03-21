#!/usr/bin/env node
/**
 * Run this program from the command line to initialize Perspex before first
 * use.
 * 
 * As of 2015-03-21, it initializes the Perspex user database by creating the
 * database file and inserting a single user.
 * 
 * If this program finds that the database already exists and already contains
 * one or more users, it will exit.
 * 
 */
'use strict';
// set a global variable so that other
// modules can find stuff:
var path = require('path');
global.appRoot = path.resolve(__dirname + '/..');

//// next line should create database if it doesn't already exist.
//var User = require(appRoot + '/backend/db/sql').User;

// minimist supplies command-line argument parsing.
var argv = require('minimist')(process.argv.slice(2));

var showUsage = function()
{
	console.log("\nperspex_init is intended to initialize the Perspex");
	console.log("database prior to the first run of the Perspex web application.\n");
	console.log("perspex_init will create the database, if it doesn't already exist,");
	console.log("and create an administrative user with the name and password supplied");
	console.log("on the command line.\n");
	console.log('Usage:');
	console.log("\tperspex_init -u user -p password");
	console.log("\n\tUser and password are both mandatory.");
	console.log("\n\tFor best results, enclose user name and password");
	console.log("\tin single quotes. For example:");
	console.log("\t  perspex_init -u 'joeblow' -p 'Bo$w0rth'\n");
};


var warn_already_users = function()
{
	console.log("\nERROR: The user database already contains at least one user.");
	console.log("Please start the Perspex Web app and use its administrative");
	console.log("pages to add, remove, or modify users' records.");
	console.log("\nIf you want to start from scratch, remove the Perspex users");
	console.log("database file and then run this program again. By default, that file");
	console.log("is located in the Perspex root directory \(the directory containing");
	console.log("the file 'perspex-app.js'\), although you may select another");
	console.log("file name or location by editing backend/lib/config.js.\n\n");
};

// MAIN

// verify command-line parameters:
if (argv.h)
{
	showUsage();
	process.exit(0);
}
if ( (! argv.u) || (! argv.p) )
{
	showUsage();
	process.exit(1);
}

// Create the User model (connection to user database). As a
// side affect, this will create the database if it's not alredy present.
var User = require(appRoot + '/backend/db/sql').User;

// Pull in hashPassword method from Passport setup module:
var hashPassword = require(appRoot + '/backend/passport/passport').hashPassword;

// Parameters OK -- we have a user name and password.
// Next, make sure we're not overwriting a good user database:
User.count().then(function(res)
		{
			if (res > 0)
				{
					warn_already_users();
					process.exit(2);
				}
			else
				{
					console.log("\n\nNew user database found or successfully created.");
					console.log("Will now add user with specified name and password...");
					// first, hash the password
					hashPassword(argv.p, function(err, hpwd)
						{
							// Now add a user to the database.
							// hpwd contains hashed password
							User.create({
								username: argv.u,
								role: 'ADMIN',
								// email not used as of 2015-0321
								email_address: 'none@example.com',
								password: hpwd
							}).success(function(User) {
								console.log("\nSuccessfully created user " + argv.u);
								console.log("with password " + argv.p + "\n");
								process.exit(0);
							}).
							error(function(err){
								console.log("ERROR: There was a problem creating the user:");
								for (var k in err)
								{
									console.log(k + ": " + err[k]);
								}
								process.exit(3);
							});
						} // end hashPassword callback	
					); // end hashPassword()
				} // end else (no users already)
		} // END User.count().then()
);




