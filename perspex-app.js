// set a global variable so that other
// modules can find stuff:
var path = require('path');
global.appRoot = path.resolve(__dirname);

var express	= require('express');
var app 		= express();
var config 		= require('./config/config').configure(app);
var https	    = require('https');
var http        = require('http');

var appSettings = require('./backend/lib/config').config;

var route_list = require('./backend/routes/route_list');

route_list.addRoutes(app);

// 404 catchall
app.use( app_routes.catchall);

var appPort = appSettings.port;
console.log('Starting perspex server on port ' + appPort)
http.createServer(app).listen(appPort);

/* //Uncomment for SSL
https.createServer(app.ssl, app).listen(3001);
*/