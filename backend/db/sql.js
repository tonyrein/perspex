var userdb_name = require('../lib/config').config.userdb_name;

module.exports = function(){
	var sqlite3 = require('sqlite3');
	
	Sequelize = require('sequelize'),
	/* Update database credentials here
	 * based on your own system's configuration
	 */
	sql = {
		'name': userdb_name,
		'user': 'NA',
		'host': 'NA',
		'password': 'NA',
	};

	sql.db = new sqlite3.Database(sql.name);

	var sequelize = exports.sequelize = new Sequelize(sql.name, sql.user, sql.password,
			{
				dialect: 'sqlite',
				storage: sql.name,
				logging: false,
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
