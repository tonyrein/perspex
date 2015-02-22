/**
 * Utilities
 * 
 */


//function stripDoubleQuotes(str)
//{
//	console.log("String is " + str);
//	if (str[0] === '"') { str = str.slice[1]; }
//	console.log("String is " + str);
//	if (str[str.length-1] === '"') { str = str.slice(0,str.length-2); }
//	return str;
//}

exports.stripDoubleQuotes = function(str)
{
	if (str[0] === '"') { str = str.slice(1); }
	if (str[str.length-1] === '"') { str = str.slice(0,str.length-2); }
	return str;
}

/**
 * Render the error message template page
 * with the given message to the given stream.
 */
exports.goToErrorPage = function(res, message)
{
	res.setHeader('Content-Type', 'text/html');
	res.render('general_error', {
		title : 'Error',
		error_message: message,
		nav_class : 'navbar-login',
		nav_links : [ {
			title : 'Home',
			href : '/home'
		}, {
			title : 'Create User',
			href : '/create'
		}, {
			title : 'Help',
			href : '/help'
		}, {
			title : 'Logout',
			href : '/logout'
		} ],
	});
}
