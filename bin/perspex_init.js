#!/usr/bin/env node
/**
 * Run this program from the command line to initialize Perspex before first use.
 * 
 * As of 2015-03-21, it initializes the Perspex user database by creating the
 * database file and inserting a single user.
 * 
 * If this program finds that the database already exists and already contains
 * one or more users, it will exit.
 * 
 */
'use strict';
//set a global variable so that other
//modules can find stuff:
var path = require('path');
global.appRoot = path.resolve('..');
var User = require(appRoot + '/backend/db/sql').User;

var argv = require('minimist')(process.argv.slice(2));


var showUsage = function()
{
	console.log('Usage:');
	console.log("\tperspex_init -u user -p password");
	console.log("\n\tUser and password are both mandatory.");
	console.log("\n\tFor best results, enclose user name and password");
	console.log("\t\tin single quotes. For example:");
	console.log("\t\tProg Name -u 'joeblow' -p 'Bo$w0rth'");
};


var warn_already_users = function()
{
	console.log("ERROR: The user database already contains at least one user.");
	console.log("Please start the Perspex Web app and use its administrative");
	console.log("pages to add, remove, or modify users' records.");
	console.log("\nIf you want to start from scratch, delete the Perspex users");
	console.log("database file and then run this program again. By default, that file");
	console.log("is located in the Perspex root directory (the directory containing");
	console.log("the file 'perspex-app.js'), although you may select another");
	console.log("file name or location by editing backend/lib/config.js");
};

/**
 * Check to see if user count > 0. If yes,
 * warn and exit.
 */
var exit_if_already_users = function()
{
	return User.count().then(function(res)
		{
			if (res > 0)
				{
					warn_already_users();
					return 1;
				}
		}	
	);
	
};

var main = function()
{
	if (argv.h)
	{
		showUsage();
		return 0;
	}
	if ( (! argv.u) || (! argv.p) )
	{
		showUsage();
		return 1;
	}
	console.log("You entered:");
	console.log("\tUser: " + argv.u);
	console.log("\tPassword: " + argv.p);
	
	
	// Check to see if there are already users. If so, exit.
	
	User.count().
	success(function(res)
			{
				console.log("in then function. res = " + res);
				if (res > 0)
					{
						console.log("There are already users.");
						return 1;
					}
			}
	);
	return 3;
	
	
	return 0;
};

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
console.log("You entered:");
console.log("\tUser: " + argv.u);
console.log("\tPassword: " + argv.p);


// Check to see if there are already users. If so, exit.
console.log("just before call to count()");
User.count().then(function(res)
		{
			console.log("in then function. res = " + res);
			if (res > 0)
				{
					console.log("There are already users.");
					process.exit(2);
				}
		}
);
process.exit(0);



//process.exit(main());