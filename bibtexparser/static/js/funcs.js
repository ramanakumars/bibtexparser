$(function() {
    $('textarea.upload-text').on('keyup paste change', function() {
        parse_text();
    });
    $('input[type=checkbox]').on('change', function() {
        parse_text();
    });
});

function parse_text() {
    $.ajax({
        url: '/parse/',
        type: 'post',
        data: {'bibdata': $("#bibtext").val(), 'template': $("#templatetext").val(), 
            "sort": $("#sort").is(":checked"), "clean": $("#clean").is(":checked")},
        success: function(response){
            $("code#output-text").text(response);
        }
    });
}

jQuery(document).ready(function ($) {
    $('form.file-upload').submit(function(event) {
        // alert("submitted!");
        var form = $(this);
        $.ajax({
            url: '/upload/',
            type: 'post',
            data: new FormData(this),
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                var textbox = form.parent().next().children();
                $(textbox).val(response);
                parse_text();
            }
        });
        return false;
    });

    parse_text();

});


$(function() {
    $('input.file-upload').change(function() {
        var fname = $(this)[0].files[0].name;
        var span  = $(this).next();
        span.text(fname);
        span.css("color", 'black');
    });
});

$(function() {
    $('input#template').change(function() {
        var fname = $("input#template")[0].files[0].name;
        $('span#templatefilename').text(fname);
        $('span#templatefilename').css("color", 'black');
    });
});