/**
 * 
 */

// all environments
var port = process.env.PORT || '3000';
var es_index = 'hon_ssh';
var es_chunk_size = '5000';
var es_scroll_duration = '30s';
var env = 'development';
var view_engine = 'jade';
var views = __dirname + '/views';
var userdb_name = 'perspex.db';

var es_host = '', es_port = '';
if ('development' == env)
{
	es_host = 'localhost';
	es_port = '9200';
}

module.exports.config = {
	port : port,
	es : {
		index : es_index,
		host : es_host,
		port : es_port,
		chunk_size : es_chunk_size,
		scroll_duration : es_scroll_duration,
		common_fields : 'bifrozt_host,timestamp,source_ip,country_code,country_name',
		default_attempt_fields : 'success,user,password',
		default_session_log_fields : 'channel,message',
		default_session_download_fields : 'filename',
		default_session_recording_fields : 'filename,contents',
	},
	env : env,
	userdb_name: userdb_name,
	view_engine : view_engine,
	views : views,
};