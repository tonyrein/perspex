/*
 * Jade is awesome, pass whatever data you want into the view. Just like that. 
 * Current setup
 * 
 * nav_class = given class to add to nav-bar for custom styles, etc
     nav_class: 'navbar-home',
 * 
 * nav_links = array of links to appear in the navigation bar with title and href

    nav_links: [
      { title: 'Home', href: '/home'},
      { title: 'Setup', href: '/setup'},
      { title: 'Update User', href: '/admin/update_user'},
      { title: 'Logout', href: '/logout'}
    ]
 * 
 * user = if you need to pass in the current user to the partial
       user: req.user
 *
 * coffeescript = array of javascript to pass into a given view
      coffeescript: [
        {js: '/js/postHelper.js'}
      ],
 * 
 * styles = array of styles to pass into a given view
        styles: [
        {css: '/css/somefile.css'}
      ],
 *
 * hide_navbar = boolean to hide or show navbar - false by default
        hide_navbar:true
 */

var publicNavLinks = [ {
	title : 'Home',
	href : '/home'
}, {
	title : 'Log Out',
	href : '/logout'
}, ];

var userNavLinks = [ {
	title : 'Help',
	href : '/help'
}, {
	title : 'Data',
	href : '/data/build_query'
}, ];

var adminNavLinks = [ {
	title : 'Admin',
	href : '/admin/admin_home'
}, ];

exports.home = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}
	res.render('home', {
		title : 'Home',
		nav_class : 'navbar-home',
		nav_links : navLinks,
		user: req.user,
	});
};

exports.setup = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}

	res.render('setup', {
		title : 'Setup',
		nav_class : 'navbar-setup',
		nav_links : navLinks,
	});
};

exports.login = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}

	res.render('login', {
		title : 'Login',
		nav_class : 'navbar-login',
		nav_links : navLinks,
		user : req.user
	});
};

exports.help = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}
	res.render('help', {
		title : 'help',
		nav_class : 'navbar-login',
		nav_links : navLinks,
		user : req.user
	});
};

exports.buildQueryPage = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}
	res.render('data/build_query', {
		title : 'Build Data Query',
		nav_class : 'navbar-login',
		nav_links : navLinks,
		user : req.user
	});

};
exports.createUser = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}

	res.render('create', {
		title : 'Create User',
		coffeescript : [ {
			js : '/js/postHelper.js'
		} ],
		nav_links : navLinks,
	});
};

exports.updateUser = function(req, res)
{
	var navLinks = [];
	if (req.user)
	{
		navLinks.concat(userNavLinks);
		if (req.user.role === 'ADMIN')
		{
			navLinks = publicNavLinks.concat(userNavLinks).concat(adminNavLinks);
		}
		else
		{
			navLinks = publicNavLinks.concat(userNavLinks);
		}
	}
	else
	{
		navLinks = publicNavLinks;
	}
	res.render('update', {
		title : 'Update User',
		coffeescript : [ {
			js : '/js/postHelper.js'
		} ],
		nav_links : navLinks,
		user : req.user
	});
};

exports.adminHome = function(req, res)
{
	res.render('admin/admin_home', {
		title : 'Perspex System and User Administration',
		nav_links : publicNavLinks.concat(userNavLinks, adminNavLinks),
	});
};

exports.logout = function(req, res)
{
	req.logout();
	res.redirect('/');
};

exports.catchall = function(req, res)
{
	res.render('404', {
		title : '404',
		hide_navbar : true
	});
};
