/**
 * "Factory" to create a csvwriter tied to a particular writable
 *  stream, using fields as its header.
 */
function makeCSVWriter(outStream, fields)
{
	// Otherwise, set up outStream to receive CSV content:
	outStream.setHeader('Content-Type', 'text/csv');
	outStream.setHeader('Content-disposition',
			'attachment;filename=query_result.csv');
	var csvWriter = require('csv-write-stream');
	// csvWriter needs an array of strings, not a comma-delimited string
	var fieldArray = fields.split(',');
	var writer = csvWriter({
		headers : fieldArray
	});
	writer.pipe(outStream).on('error', function(e)
	{
		console.log("Error: " + e)
	});
	return writer;
}
/**
 * Constructs an object suitable for using as the "body" parameter of an
 * Elasticsearch call.
 */
function buildClientParams(metaParams)
{
	var u = require('./utils'); // some fields are sent double-quoted,
	// so we'll use this module to take care of that.
	var params = {
		type : metaParams.type,
	};

	// If fields were specified, set them in params.
	// fields is a comma-delimited string of field names.
	// It
	if (metaParams.fields && metaParams.fields.length > 0)
	{
		params.fields = metaParams.fields;
	}
	else
	// otherwise, use defaults:
	{
		var es_cfg = require('./config').config.es;

		switch (metaParams.type)
		{
			case 'HonSSH_Attempt':
				params.fields = es_cfg.common_fields + ','
						+ es_cfg.default_attempt_fields;
				break;
			case 'HonSSH_SessionLogEntry':
				params.fields = es_cfg.common_fields + ','
						+ es_cfg.default_session_log_fields;
				break;
			case 'HonSSH_SessionRecording':
				params.fields = es_cfg.common_fields + ','
						+ es_cfg.default_session_recording_fields;
				break;
			case 'HonSSH_SessionDownload':
				params.fields = es_cfg.common_fields + ','
						+ es_cfg.default_session_download_fields;
				break;
			default:
				throw new Error('Invalid document type.');
		}

	}
	// Are there dates specified in the search parameters? If so,
	// convert the dates into their "values" (seconds since Epoch)
	// and build up a range string such as
	// "timestamp:{1420261200000 TO 1420347545000}" If only
	// one date is given, use '*' for the other end of the range.
	if (metaParams.start_date || metaParams.end_date)
	{
		var scratchString, startString, endString, dateRangeString, scratchDate;

		if (metaParams.start_date)
		{
			scratchString = u.stripDoubleQuotes(metaParams.start_date);
			scratchDate = new Date(scratchString);
			startString = scratchDate.valueOf().toString();
		}
		else
		{
			startString = '*';
		}
		if (metaParams.end_date)
		{
			scratchString = u.stripDoubleQuotes(metaParams.end_date);
			scratchDate = new Date(scratchString);
			endString = scratchDate.valueOf().toString();
		}
		else
		{
			endString = '*';
		}
		params.q = 'timestamp:{' + startString + ' TO ' + endString + '}';
	}

	// Finally, if there is a query string, add that.
	if (metaParams.query_string)
	{
		var scratchString = metaParams.query_string;
		if (scratchString) // anything left after double quotes are stripped?
		{
			if (params.q)
			{
				params.q += ' AND ' + scratchString;
			}
			else
			{
				params.q = scratchString;
			}
		}
	}
	// All done -- return the result
	return params;
} // end of buildClientParams()

function _retrieveCountAsJSON(clientParams, outStream)
{
	var es_cfg = require('./config').config.es;
	// initialize output stream -- tell browser
	// what we're going to send:
	outStream.setHeader('Content-Type', 'application/json');

	var elasticsearch = require('elasticsearch');
	var client = new elasticsearch.Client({
		host : es_cfg.host + ':' + es_cfg.port
	});
	client
			.count(
					clientParams,
					function(err, resp)
					{
						var jsonObj = {};
						if (err)
						{
							console.log(err);
							console.log(err.stack);
							jsonObj = {
								error : 'Database server responded with an error. Please ask the system administrator to investigate.'
							};
						}
						else
						{
							jsonObj = {
								count : resp.count
							};

						}
						outStream.send(JSON.stringify(jsonObj));
					});
}

/**
 * Use Elasticsearch's scroll and scan api to retrieve desired number of
 * records.
 * 
 * Convert records to csv and pipe them to the designated target stream.
 * 
 * @param clientParams { }
 * @param howMany -
 *          number of records to fetch
 * @param outStream -
 *          target to send the results to
 */
function _doScroll(clientParams, howMany, outStream)
{
	var es_cfg = require('./config').config.es;

	var elasticsearch = require('elasticsearch');
	var client = new elasticsearch.Client({
		host : es_cfg.host + ':' + es_cfg.port
	});
	var running_total = 0;

	// If number of records we're requesting is less than
	// chunk size, set clientParams.size to number of records.
	// Otherwise, set it to chunk size.
	clientParams.size = Math.min(howMany, es_cfg.chunk_size);

	clientParams.scroll = es_cfg.scroll_duration;

	var writer = null;
	client.search(clientParams, function getMoreUntilDone(err, resp)
	{
		if (err)
		{
			console.log(err);
			console.log(err.stack);
			var goToError = require('./utils').goToErrorPage;
			goToError(outStream,
					'Database server responded with an error. Please ask the system administrator to investigate.');
			return;
		}
		var grand_total = 0;
		if (resp && resp.hits && resp.hits.hits)
		{
			grand_total = resp.hits.total;
		}
		if (grand_total === 0)
		{
			// if no results, send back status 204:
			var j = JSON.stringify({
				message : 'Query returned no records'
			});
			outStream.writeHead(204, {
				'Content-Length' : j.length,
				'Content-Type' : 'application/json'
			});
			outStream.write(j);
			outStream.end();
			return;
		}
		// We have results to send back:

		if (!writer)
		{
			// Create the writer with fields as header, link it to outStream,
			// and initialize it to accept text/csv.
			writer = makeCSVWriter(outStream, clientParams.fields);
		}
		resp.hits.hits.every(function(hit)
		{
			// If the query specified fields, then the actual data for each
			// record will be in hit.fields. Otherwise, it will be in
			// hit._source. Why? Who knows?
			// Since we always specify fields explicitly, we will use fields.
			// 
			writer.write(hit.fields);
			running_total++;
			// Return false as soon we've written as many
			// records as were requested. That will stop the
			// implied loop.
			return running_total < howMany;
		});
		// If there are still records to get, then
		// "unroll" the scroll another turn. Pass the
		// scroll id ES sent us as part of the response
		// in the previous iteration.
		if (running_total < resp.hits.total && running_total < howMany)
		{
			client.scroll({
				scrollId : resp._scroll_id,
				scroll : es_cfg.scroll_duration
			}, getMoreUntilDone);
		}
		else
		{
			writer.end();
			return;
		}
	});
} // end of _doScroll()

/**
 * Use _doScroll() to snag data and pipe it in CSV format into stream passed as
 * part of metaParams.
 */
exports.getCSV = function(metaParams)
{
	var clientParams = buildClientParams(metaParams);
	var howMany = metaParams.how_many || 1000;
	var outStream = metaParams.out_stream;
	_doScroll(clientParams, howMany, outStream);
};

// Send, as JSON, the count of records that would be returned by
// this query. This was probably invoked as the result of an
// AJAX call from the client.
exports.getCount = function(metaParams)
{
	var clientParams = buildClientParams(metaParams);
	var outStream = metaParams.out_stream;
	_retrieveCountAsJSON(clientParams, outStream)
}