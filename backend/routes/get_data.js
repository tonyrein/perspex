/**
 * Forward call from client to Elasticsearch server and stream results to client
 */
// req contains search parameters:
// * doc_type (mandatory)
// * query_string (optional) - string specifying fields and field values
// to match in the format field:value. For example, if you want to search
// for records with a country_code of "DE" you would put the following
// into the URL:
// query_string=country_code:DE
// Criteria can be combined. For example, to search for records with a
// country_code
// of "DE," and host of "ares" you would specify:
// query_string="country_code:DE AND bifrozt_host:ares"
// You may also use OR, and use "-" before a criterion which must NOT match;
// for example:
// query_string="-country_code:US" would match records with country code
// other than "US."
// You may also specify date ranges to be matched against the timestamps
// of the record. The dates must be in iso8601 format and for best results
// should have "Z" appended to denote UTC. For example, for Feb 2, 2015 5:00 am
// you would use:
//		2015-02-02T05:00:00Z
// You may specify start_date, stop_date, or both. For example:
//		...&end_date=2015-01-01T00:00:00Z for everything up to Jan 1, 2015.
//		...&start_date=2014-12-20T00:00:00Z for all since Dec 20, 2014.
//		...&start_date=2014-12-20T00:00:00Z&end_date=2014-12-20T23:59:59Z
//			for everything on Dec 20, 2014.
//		Date ranges are inclusive.
//
//
// * num_to_fetch (optional) - defaults to 10 if not specified
//
// * fields_to_fetch (optional) - a comma-delimited list of fields to return.
// Defaults
// to "all" if not specified.
//
//

var doScroll = require('../lib/do_scroll').doScroll;

exports.get_data = function(req, resp) {
	var doc_type = req.param('doc_type');
	if (!doc_type) {
		throw new Error('You must supply a document type');
	}
	var query_string = req.param('query_string', '');
	var numStr = req.param('num_to_fetch', '10');
	var howMany = parseInt(numStr, 10) || 10; // convert number string into an int. If NaN, use default.
	var metaParams = {
		type: doc_type,
		how_many: howMany,
	};
	// fields is a comma-delimited string
	if (req.param('fields')) { metaParams.fields = req.param('fields'); }
	// start_date and end_date are in the format 'YYYY-MM-DD HH:MM:SS'
	if (req.param('start_date')) { metaParams.start_date = req.param('start_date'); }
	if (req.param('end_date')) { metaParams.end_date = req.param('end_date'); }
	
	metaParams.query_string = query_string;
	metaParams.out_stream = resp;
	
	doScroll(metaParams);
};

