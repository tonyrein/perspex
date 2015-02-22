/**
 * New node file
 */
//var frameSrc = "http://localhost/kibana";

$("#kibanaModal").on('show.bs.modal', function()
{
	  $(this).find('.modal-body').css({
              width:'auto', //probably not needed
              height:'auto', //probably not needed 
              'max-height':'100%'
       });
});

//$('#btnOpenKibana').click(function(){
//	console.log('in btnOpenKibana.click()');
// /   $('#kibanaModal').on('show', function () {
//		console.log('in kibanaModal event handler for show');
//
 //       $('#kibanaIframe').attr("src",frameSrc);
//      
//	});
//    $('#kibanaModal').modal({show:true})
//});
