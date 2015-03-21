var sequelize 	= module.parent.exports.sequelize;
var Sequelize 		= require('sequelize');

/* Sequelize model definition for user
 * All options, types and validations can be found
 * on their website
 */
module.exports = model = sequelize.define('User',
{
	password: {
		type:Sequelize.STRING, 
		allowNull: false
	},
	username: {
		type:Sequelize.STRING, 
		allowNull: false
	},
	role: { // either 'USER' or 'ADMIN'
		type: Sequelize.STRING,
		allowNull: false
	},
	email_address: {
		type: Sequelize.STRING,
		validate: {
			isEmail:{
	                    msg: "Email address is invalid"
			},
		}
	},
	
	},
	{
		underscored:true
	}
);

model.sync();

