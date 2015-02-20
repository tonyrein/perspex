/**
 * New node file
 */
'use strict';

var QPProcessor = {
	init : function() {
		$("#select_doc_type").val('attempt');
		$("#select_doc_type").bind('change', QPProcessor.selChangeRecordType);
		$("#select_doc_type_all").bind('change',
				QPProcessor.selChangeRecordType);
		$("input[name=query_method]:radio").bind('click',
				QPProcessor.queryMethodChanged);
		$("input[name=query_method]:radio").val('FIELDS');
		QPProcessor.setupRecordTypeOptions('attempt');
		QPProcessor.setupQueryMethodOptions('FIELDS');
		$("#chk-any-start_date")
				.bind('click', QPProcessor.chkClickDateCheckbox);
		$("#chk-any-end_date").bind('click', QPProcessor.chkClickDateCheckbox);
		$("#btn-get-csv").bind('click', QPProcessor.btnCSVClicked);
		$("#btn-get-count").bind('click', QPProcessor.btnCountClicked);
		
		QPProcessor.initDateControls();
		$("#sel_success").val('-1');
	},

	initDateControls : function() {
		$("#chk-any-start_date").prop('checked', true);
		$("#chk-any-end_date").prop('checked', true);
		$("#dt-start_date").addClass('hide');
		$("#dt-end_date").addClass('hide');
	},

	// event handlers
	selChangeRecordType : function(ev) {
		// ev.preventDefault();
		currentRecordType = ev.target.value;
		QPProcessor.setupRecordTypeOptions(currentRecordType);
	},

	queryMethodChanged : function(ev) {
		// ev.preventDefault();
		// alert(ev.target.dataset.val);
		// ev.target.prop('checked', true);
		currentQueryMethod = ev.target.dataset.val;
		QPProcessor.setupQueryMethodOptions(currentQueryMethod);
	},

	chkClickDateCheckbox : function(ev) {
		var startChecked = $("#chk-any-start_date").prop('checked');
		var endChecked = $("#chk-any-end_date").prop('checked');
		if (startChecked) {
			$("#dt-start_date").addClass('hide');

		} else {
			$("#dt-start_date").removeClass('hide');
		}
		if (endChecked) {
			$("#dt-end_date").addClass('hide');

		} else {
			$("#dt-end_date").removeClass('hide');
		}
	},

	btnCountClicked: function(ev)
	{
		QPProcessor.getCount();
	},
	
	btnCSVClicked : function(ev) {
		QPProcessor.getCSV();
	}, // end btnExecuteClicked

	btnTableClicked : function(ev) {
//		QPProcessor.getTabularData();
	},

	// methods used by event handlers
	showQueryByClick : function() {
		$("#query-by-click-controls").removeClass('hidden');
		$("#freeform-query-controls").addClass('hidden');
	},

	showQueryFreeform : function() {
		$("#freeform-query-controls").removeClass('hidden');
		$("#query-by-click-controls").addClass('hidden');
	},

	setupQueryMethodOptions : function(currentQueryMethod) {
		switch (currentQueryMethod) {
		case 'FIELDS':
			QPProcessor.showQueryByClick();
			break;
		case 'FREEFORM':
			QPProcessor.showQueryFreeform();
			break;
		}
	},
	setupRecordTypeOptions : function(currentRecordType) {
		switch (currentRecordType) {
		case 'attempt':
			$("#div-flds-attempt").removeClass('hide');
			$("#div-flds-sessionlogentry").addClass('hide');
			$("#div-flds-sessionrecording").addClass('hide');
			$("#div-flds-sessiondownload").addClass('hide');

			$("#div-checkboxes-attempt").removeClass('hide');
			$("#div-checkboxes-sessionlogentry").addClass('hide');
			$("#div-checkboxes-sessionrecording").addClass('hide');
			$("#div-checkboxes-sessiondownload").addClass('hide');
			break;
		case 'sessionlogentry':
			$("#div-flds-attempt").addClass('hide');
			$("#div-flds-sessionlogentry").removeClass('hide');
			$("#div-flds-sessionrecording").addClass('hide');
			$("#div-flds-sessiondownload").addClass('hide');

			$("#div-checkboxes-attempt").addClass('hide');
			$("#div-checkboxes-sessionlogentry").removeClass('hide');
			$("#div-checkboxes-sessionrecording").addClass('hide');
			$("#div-checkboxes-sessiondownload").addClass('hide');
			break;
		case 'sessionrecording':
			$("#div-flds-attempt").addClass('hide');
			$("#div-flds-sessionlogentry").addClass('hide');
			$("#div-flds-sessionrecording").removeClass('hide');
			$("#div-flds-sessiondownload").addClass('hide');

			$("#div-checkboxes-attempt").addClass('hide');
			$("#div-checkboxes-sessionlogentry").addClass('hide');
			$("#div-checkboxes-sessionrecording").removeClass('hide');
			$("#div-checkboxes-sessiondownload").addClass('hide');
			break;
		case 'sessiondownload':
			$("#div-flds-attempt").addClass('hide');
			$("#div-flds-sessionlogentry").addClass('hide');
			$("#div-flds-sessionrecording").addClass('hide');// switch(dataFormat)
			$("#div-flds-sessiondownload").removeClass('hide');

			$("#div-checkboxes-attempt").addClass('hide');
			$("#div-checkboxes-sessionlogentry").addClass('hide');
			$("#div-checkboxes-sessionrecording").addClass('hide');
			$("#div-checkboxes-sessiondownload").removeClass('hide');
			break;

		} // end switch

	},

	gatherQueryParams : function() {
		var query_params = {} // place to put whatever we find
		// First, get the common text fields
		var param_name;
		$("#div-flds-common input[type=text]").each(function(ind, el) {
			if (el.value) {
				param_name = (el.id).slice(4);
				query_params[param_name] = el.value;
			}
		});
		// Now get the text fields for whichever doc type is selected:
		var selectedType = $("#select_doc_type").val();
		// Change this selector to use classes of elements instead?
		var selector = "#div-flds-" + selectedType + " input[type=text]";
		$(selector).each(function(ind, el) {
			if (el.value) {
				param_name = (el.id).split('-')[1]; // part between first and
				// second dashes
				query_params[param_name] = el.value;
			}
		});
		// If "attempt" is selected, get "success" selection:
		if ('attempt' === selectedType) {
			var sVal = $("#sel_success").val();
			if (sVal !== '-1') {
				query_params['success'] = sVal;
			}
		}
		// alert("selector:" + selector);
		return query_params;
	},

	getQuantity : function() {
		var numText = $("#txt-num_to_fetch")[0].value;
		return parseInt(numText, 10) || 10;
	},

	getDateRange : function() {
		var startChecked = $("#chk-any-start_date").prop('checked');
		var endChecked = $("#chk-any-end_date").prop('checked');
		var start_date, end_date;
		if (startChecked) {
			start_date = null;
		} else {
			start_date = $("#dt-start_date")[0].value;
		}
		if (endChecked) {
			end_date = null;
		} else {
			end_date = $("#dt-end_date")[0].value;
		}
		return {
			start_date : start_date,
			end_date : end_date
		};
	},

	getFieldList : function() {
		var retString = '';
		$("#div-common-checkboxes input[type=checkbox]").each(
				function(ind, el) {
					if (el.checked) {
						var fldName = (el.id).split('-')[0];
						retString += fldName + ',';
					}
				});
		// now get the checkboxes specific to the selected record type
		var selectedType = $("#select_doc_type").val();
		var selector = "#div-checkboxes-" + selectedType
				+ " input[type=checkbox]";
		$(selector).each(function(ind, el) {
			if (el.checked) {
				var fldName = (el.id).split('-')[0];
				retString += fldName + ',';
			}
		});
		// remove last comma, if present
		if (retString.slice(-1) === ',') {
			retString = retString.slice(0, retString.length - 1);
		}
		return retString;
	},

	getESDocType : function() {
		var scratchString = $("#select_doc_type").val();
		// convert this into the ES document type:
		switch (scratchString) {
		case 'attempt':
			return 'HonSSH_Attempt';
			break;
		case 'sessionlogentry':
			return 'HonSSH_SessionLogEntry';
			break;
		case 'sessionrecording':
			return 'HonSSH_SessionRecording';
			break;
		case 'sessiondownload':
			return 'HonSSH_SessionDownload';
			break;
		default:
			alert('Invalid document type selected. Please try again.');
			return null;
		}
	},

	assembleParameters : function() {
		var assembly = {};
		assembly.query_params = QPProcessor.gatherQueryParams();
		assembly.num_to_fetch = QPProcessor.getQuantity();
		assembly.date_params = QPProcessor.getDateRange();
		assembly.field_list = QPProcessor.getFieldList();
		assembly.doc_type = QPProcessor.getESDocType();
		if (!assembly.doc_type) {
			alert('Invalid document type selected. Please try again.');
			return;
		}
		return assembly;
	},

	buildParameterString : function(assembly) {
		var paramString = '';
		if (assembly.field_list) {
			paramString += '&fields=' + assembly.field_list;
		}
		if (assembly.date_params.start_date) {
			paramString += '&start_date=' + assembly.date_params.start_date;
		}
		if (assembly.date_params.end_date) {
			paramString += '&end_date=' + assembly.date_params.end_date;
		}
		paramString += '&num_to_fetch=' + assembly.num_to_fetch;
		var scratchString = '';
		for ( var k in assembly.query_params) {
			if (assembly.query_params.hasOwnProperty(k)) {
				if (scratchString) {
					scratchString += ' AND ';
				}
				scratchString += k + ':' + assembly.query_params[k];
			}
		}
		if (scratchString.length > 0) {
			paramString += '&query_string=' + scratchString;
		}
		return paramString;
	},

	// Gather values of the form controls and assemble a query URL, then go to
	// that url..
	getCSV : function() {
		var assembly = QPProcessor.assembleParameters();
		if (!assembly.doc_type) {
			alert('Invalid document type selected. Please try again.');
			return;
		}

		// TODO: Sanitize input!
		var query_url = 'http://' + window.location.host
				+ '/non_ui/get_data?doc_type=' + assembly.doc_type;

		query_url += QPProcessor.buildParameterString(assembly);
		alert("URL: " + query_url);
		window.location = query_url;
	},

	// Should result in tabular display in a new page.
	// getTabularData: function() { QPProcessor.getData('TABLE'); },

	// Display count of records ES would send back for this query.
	// Assemble and dispatch an AJAX call and
	// display the result in an alert box.
	getCount : function() {
		var assembly = QPProcessor.assembleParameters();
		if (!assembly.doc_type) {
			alert('Invalid document type selected. Please try again.');
			return;
		}

		// TODO: Sanitize input!
		var queryUrl = 'http://' + window.location.host + '/non_ui/get_count';
		// ?doc_type=' + assembly.doc_type;
		var queryString = QPProcessor.buildParameterString(assembly);

		$.ajax({
			url : queryUrl,
			type : 'GET',
			dataType : 'JSON',
			data : queryString + '?doc_type=' + assembly.doc_type,
			success : function(json) {
				alert('Query would return ' + json.count + ' records.');
			},
			error : function(xhr, status, errorThrown) {
				alert("Sorry, there was a problem!");
				console.log("Error: " + errorThrown);
				console.log("Status: " + status);
				console.dir(xhr);
			},

		});
	},

}; // end of var QPProcessor = ...

var currentRecordType = 'attempt';
var currentQueryMethod = 'FIELDS';

// run init when page is ready:
$(document).ready(function() {
	'use strict';
	QPProcessor.init();
});
