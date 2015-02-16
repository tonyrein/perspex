module.exports = function(){
	var sqlite3 = require('sqlite3');
	Sequelize = require('sequelize'),

	/* Update database credentials here
	 * based on your own system's configuration
	 */
	sql = {
		'name':'perspex.db',
		'user': 'NA',
		'host': 'NA',
		'password': 'NA',
	};

	sql.db = new sqlite3.Database(sql.name);

	var sequelize = exports.sequelize = new Sequelize(sql.name, sql.user, sql.password,
			{
				dialect: 'sqlite',
				storage: sql.name
			});
 
	sequelize.authenticate().complete( function(err) {
		if (err) {
			new Error('backend/db/sql.js: unable to connect to the database:', err);
		} 
	});

	// include models here
	sql.User = require('../models/user');

	return sql;
}();
