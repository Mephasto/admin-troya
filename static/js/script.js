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

});
