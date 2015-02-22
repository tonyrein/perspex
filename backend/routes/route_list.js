/**
 * Centralizes routing logic. "Main" app should
 * call addRoutes() to set up routing.
 * 
 */
app_routes 	= require('./application'),
auth_routes	= require('./authentication');
data_routes = require('./data');

var perspexGETRoutes = [
// vert (appg.get, app.post...), page_path (regex string), auth required? (bool), admin required? (bool),
// method (function)
{
	page_path : '(/|/login)',
	auth : false,
	admin : false,
	method : app_routes.login
}, {
	page_path : '/logout',
	auth : false,
	admin : false,
	method : app_routes.logout
},

{
	page_path : '/home',
	auth : true,
	admin : false,
	method : app_routes.home
}, {
	page_path : '/help',
	auth : true,
	admin : false,
	method : app_routes.help
},

{
	page_path: '/admin/admin_home',
	auth: true,
	admin: true,
	method: app_routes.adminHome
},
{
	page_path : '/admin/setup',
	auth : true,
	admin : true,
	method : app_routes.setup
}, {
	page_path : '/admin/create_user',
	auth : true,
	admin : true,
	method : app_routes.createUser
}, {
	page_path : '/admin/update_user',
	auth : true,
	admin : true,
	method : app_routes.updateUser
},

{
	page_path : '/data/build_query',
	auth : true,
	admin : false,
	method : app_routes.buildQueryPage
},
{
	page_path : '/data/get_csv',
	auth : true,
	admin : false,
	method : data_routes.getCSV
}, {
	page_path : '/data/get_count',
	auth : true,
	admin : false,
	method : data_routes.getCount
},
];

var perspexPOSTRoutes = [
{
	page_path : '/api/update_user',
	auth : true,
	admin : true,
	method : auth_routes.localUpdate
}, {
	page_path : '/api/create_user',
	auth : true,
	admin : true,
	method : auth_routes.localCreate
}, {
	page_path : '/api/delete_user',
	auth : true,
	admin : true,
	method : auth_routes.localDelete
}, {
	page_path : '/api/update_password',
	auth : true,
	admin : true,
	method : auth_routes.localPasswordUpdate
}, {
	page_path : '/api/login',
	auth : false,
	admin : false,
	method : auth_routes.localAuthentication
}, ];


function isAuthenticated(req, resp, next)
{
	if (req.user)
	{
		return next();
	}
	resp.redirect('/login');
}

// Use this to verify that logged-in user has
// sufficient privileges for desired operation.
// For example:
// app.get('/admin/dangerous_stuff',
// isAuthenticated,
// isInRole('ADMIN'),
// function(req, resp
// { ... }
// );

function limitToAdmin()
{
	return function(req, resp, next)
	{
		if (isAdmin())
			{
				return next();
			}
			else
			{
				resp.redirect('/login');
			}
	};
}

exports.isAdmin = function()
{
	return (req.user && req.user.role === 'ADMIN');
}
exports.isAuthenticated = isAuthenticated
exports.limitToAdmin = limitToAdmin;

exports.addRoutes = function(app)
{
	for (var i = 0; i < perspexGETRoutes.length; i++)
	{
		r = perspexGETRoutes[i];
		if (r.admin)
		{
			app.get(r.page_path, isAuthenticated, isInRole('ADMIN'), r.method);
			continue;
		}
		if (r.auth)
		{
			app.get(r.page_path, isAuthenticated, r.method);
			continue;
		}
		app.get(r.page_path, r.method);
	}
	for (var i = 0; i < perspexPOSTRoutes.length; i++)
	{
		r = perspexPOSTRoutes[i];
		if (r.admin)
		{
			app.post(r.page_path, isAuthenticated, isInRole('ADMIN'), r.method);
			continue;
		}
		if (r.auth)
		{
			app.post(r.page_path, isAuthenticated, r.method);
			continue;
		}
		app.post(r.page_path, r.method);
	}
}

//
// app.get('(/|/login)', app_routes.login);
// app.get('/home', auth_routes.isAuthenticated, app_routes.home);
// app.get('/help', auth_routes.isAuthenticated, app_routes.help);
// app.get('/setup', auth_routes.isAuthenticated, app_routes.setup);
// app.get('/create', app_routes.createUser);
// app.get('/user/update', auth_routes.isAuthenticated, app_routes.updateUser);
// app.get('/logout', app_routes.logout);
//
// //local authentication routes
// app.post('/user/create', auth_routes.localCreate);
// app.post('/user/delete', auth_routes.isAuthenticated,
// auth_routes.localDelete);
// app.post('/user/update', auth_routes.isAuthenticated,
// auth_routes.localUpdate);
// app.post('/user/password', auth_routes.isAuthenticated,
// auth_routes.localPasswordUpdate);
// app.post('/login', auth_routes.localAuthentication);
//
// app.get('/non_ui/get_data', auth_routes.isAuthenticated,
// non_ui_routes.get_data);
// app.get('/non_ui/get_count', auth_routes.isAuthenticated,
// non_ui_routes.get_count);
