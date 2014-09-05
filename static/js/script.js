/*
    Author: Mephasto
*/
$(document).ready(function() {
    'use strict';

    $('#datepicker').datepicker();
    $('#datepicker-b').datepicker();
    $('.timepicker').timepicker();
    
    $('.date').each(function(){
        var uglydate = $(this).html();
        $(this).html(dateFormat(uglydate, "dd/mm/yy"));
    })
    
    // Pretty Dates
    var date = $('#datepicker').val();
    if (date != '') {
    	date = dateFormat(date, "dd/mm/yy");
    	$('#datepicker').val(date);
    }

    var date = $('#datepicker-b').val();
    if (date != '') {
    	date = dateFormat(date, "dd/mm/yy");
    	$('#datepicker-b').val(date);
	}

	// Pill Type DropDown .change()
    $('#pill_type').change(pillTypeChange());
    
    function pillTypeChange() {
        var type = $('#pill_type').val();
        if (type == 'default') {
        	$('#video').hide();
        	$('#url').show();
        	$('#texto_boton').show();
        }
        if (type == 'no-link'){
        	$('#video').hide();
        	$('#url').hide();
        	$('#texto_boton').hide();
        }
        if (type == 'video'){
        	$('#video').show();
        	$('#url').hide();
        	$('#texto_boton').hide();
        }
        console.log(type);
	}
    pillTypeChange();

});
