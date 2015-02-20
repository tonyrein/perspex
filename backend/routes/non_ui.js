/**
 * Routes which snag data for the client instead of
 * being primarily about rendering HTML.
 */


/**
 * Writes '{ count: num }' to resp,
 * 
 */
exports.get_count = function(req, resp)
{
	var doc_type = req.param('doc_type');
	if (!doc_type) {
		throw new Error('You must supply a document type');
	}
	//var dataFormat = req.param('fmt') || 'CSV'; // default to CSV if none given
	var query_string = req.param('query_string', '');
	var numStr = req.param('num_to_fetch', '10');
	var howMany = parseInt(numStr, 10) || 10; // convert number string into an int. If NaN, use default.
	var metaParams = {
		type: doc_type,
//		how_many: howMany,
	};
	// fields is a comma-delimited string
	//if (req.param('fields')) { metaParams.fields = req.param('fields'); }
	// start_date and end_date are in the format 'YYYY-MM-DD HH:MM:SS'
	if (req.param('start_date')) { metaParams.start_date = req.param('start_date'); }
	if (req.param('end_date')) { metaParams.end_date = req.param('end_date'); }
	
	metaParams.query_string = query_string;
	metaParams.out_stream = resp;
	var getCount = require('../lib/get_es_records').getCount;
	getCount(metaParams);
};


exports.get_data = function(req, resp) {
	// This should have logic added to differentiate a request for
	// data in CSV form vs. other (tabular display) and call the
	// correct library function. For now, CSV is the only choice.
	
	var doc_type = req.param('doc_type');
	if (!doc_type) {
		throw new Error('You must supply a document type');
	}
	var dataFormat = req.param('fmt') || 'CSV'; // default to CSV if none given
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
	var getCSV = require('../lib/get_es_records').getCSV;
	getCSV(metaParams);

	
//	switch(dataFormat)
//	{
//	case 'CSV':
//		var getCSV = require('../lib/get_es_records').getCSV;
//		getCSV(metaParams);
//		break;
//	case 'TABLE': // nothing yet for this
//		break;
//	case 'COUNT_ONLY':
//		var getCount = require('../lib/get_es_records').getCount;
//		getCount(metaParams);
//		break;
//	
//	}
};