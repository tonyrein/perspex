var express	= require('express'),
app 		= express(),
config 		= require('./config/config').configure(app),
https	    = require('https'),
http        = require('http'),
app_routes 	= require('./backend/routes/application'),
auth_routes	= require('./backend/routes/authentication');
non_ui_routes = require('./backend/routes/non_ui');

// Application routes. Some of these are forbidden for
// visitors who are not logged in -- those are protected
// by including 'auth_routes.isAuthenticated' in the call
// to app.get(). When it's time to actually send the content,
// this is done by calling the appropriate method in app_routes.
//
app.get('(/|/login)', app_routes.login);
app.get('/data/*', auth_routes.isAuthenticated, app_routes.doDataPages);
app.get('/home', auth_routes.isAuthenticated, app_routes.home);
app.get('/help', auth_routes.isAuthenticated, app_routes.help);
app.get('/setup', auth_routes.isAuthenticated, app_routes.setup);
app.get('/create', app_routes.createUser);
app.get('/user/update', auth_routes.isAuthenticated, app_routes.updateUser);
app.get('/logout', app_routes.logout);

//local authentication routes
app.post('/user/create', auth_routes.localCreate);	
app.post('/user/delete', auth_routes.isAuthenticated, auth_routes.localDelete);
app.post('/user/update', auth_routes.isAuthenticated, auth_routes.localUpdate);
app.post('/user/password', auth_routes.isAuthenticated, auth_routes.localPasswordUpdate);
app.post('/login', auth_routes.localAuthentication);

app.get('/non_ui/get_data', auth_routes.isAuthenticated, non_ui_routes.get_data);

// 404 catchall
app.use( app_routes.catchall);

http.createServer(app).listen(3000);

/* //Uncomment for SSL
https.createServer(app.ssl, app).listen(3001);
*/