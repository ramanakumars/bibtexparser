$(function() {
    $('textarea#template').on('keyup paste', function() {
        $.ajax({
            url: '/test/',
            type: 'post',
            data: $('form#template-test').serialize(),
            success: function(response){
                $("code#template-output").text(response);
            }
        });
    });
});

jQuery(document).ready(function ($) {
    $('#parse').submit(function(event) {
        // alert("submitted!");
        $.ajax({
            url: '/parse/',
            type: 'post',
            data: new FormData(this),
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                $("code#parse-output").text(response);
            }
        });
        return false;
    });
    $.ajax({
        url: '/test/',
        type: 'post',
        data: $('form#template-test').serialize(),
        success: function(response){
            $("code#template-output").text(response);
        }
    });
});


$(function() {
    $('input#bibfile').change(function() {
        var fname = $("input#bibfile")[0].files[0].name;
        $('span#bibfilename').text(fname);
        $('span#bibfilename').css("color", 'black');
    });
});

$(function() {
    $('input#template').change(function() {
        var fname = $("input#template")[0].files[0].name;
        $('span#templatefilename').text(fname);
        $('span#templatefilename').css("color", 'black');
    });
});