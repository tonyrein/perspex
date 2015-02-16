/**
 * Routes which snag data for the client instead of
 * being primarily about rendering HTML.
 */

exports.get_data = function(req, resp) {
	// This should have logic added to differentiate a request for
	// data in CSV form vs. other (tabular display) and call the
	// correct library function. For now, CSV is the only choice.
	var getCSV = require('../lib/get_csv').getCSV;
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
	
	getCSV(metaParams);
};