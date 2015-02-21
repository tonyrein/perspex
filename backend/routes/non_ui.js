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
	if (!doc_type)
	{
		throw new Error('You must supply a document type');
	}
	// var dataFormat = req.param('fmt') || 'CSV'; // default to CSV if none given
	var query_string = req.param('q', '');
	var numStr = req.param('num_to_fetch', '10');
	var metaParams = {
		type : doc_type,
	};
	var dparams = req.param('date_params');
	if (dparams)
	{
		if (dparams.start_date)
		{
			metaParams.start_date = dparams.start_date;
		}
		if (dparams.end_date)
		{
			metaParams.end_date = dparams.end_date;
		}
	}
	metaParams.query_string = query_string;
	metaParams.out_stream = resp;
	var getCount = require('../lib/get_es_records').getCount;
	getCount(metaParams);
};

exports.get_data = function(req, resp)
{
	var doc_type = req.param('doc_type');
	if (!doc_type)
	{
		throw new Error('You must supply a document type');
	}
	var dataFormat = req.param('fmt') || 'CSV'; // default to CSV if none given
	var query_string = req.param('q', '');
	var numStr = req.param('num_to_fetch', '10');
	var howMany = parseInt(numStr, 10) || 10; // convert number string into an
																						// int. If NaN, use default.
	var metaParams = {
		type : doc_type,
		how_many : howMany,
	};
	// fields is a comma-delimited string
	if (req.param('fields'))
	{
		metaParams.fields = req.param('fields');
	}
	if (req.query.start_date) { metaParams.start_date = req.query.start_date; }
	if (req.query.end_date) { metaParams.end_date = req.query.end_date; }

	metaParams.query_string = query_string;
	metaParams.out_stream = resp;
	var getCSV = require('../lib/get_es_records').getCSV;
	getCSV(metaParams);

};