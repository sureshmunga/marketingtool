jQuery.noConflict();
$(document).ready(function () {
    
    $('select').chosen().trigger('chosen:updated');
    $(".chosen-choices").outerWidth('100%');
    $(document).on('click', 'a[data-select-all="selectunselect"]', function () {
        var selectallElement = $(this).attr('data-target-id');
        var nextStage = $(this).attr('data-next-stage');

        if (nextStage === "select") {
            $('#' + selectallElement + ' option').prop('selected', true);
            $(this).attr('data-next-stage', "unselect");
            $(this).text("Select None");

        } else {
            $('#' + selectallElement + ' option').prop('selected', false);
            $(this).attr('data-next-stage', "select");
            $(this).text("Select All");
        }

        $('#' + selectallElement).trigger('chosen:updated');

    });

    $(document).ajaxStart(function () {
        // $("<div id='globalLoader'><div class='loader'></div></div>")
        //       .dialog({ modal: true, dialogClass: 'dialogbg' }).show();

        // $("#IdLoadView").addClass("OnLoaderscroll");

        // $(".ui-dialog-titlebar").hide();
        // $("body").addClass("disable-scroll");
    });
    $(document).ajaxComplete(function () {

        // $(".form-control").css({ "height": "auto" });
        // $("body").removeClass("disable-scroll");
        var config = {
            '.chosen-select': {},
            '.chosen-select-deselect': { allow_single_deselect: true },
            '.chosen-select-no-single': { disable_search_threshold: 10 },
            '.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
            '.chosen-select-rtl': { rtl: true },
            '.chosen-select-width': { width: '95%' }
        }
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }

        $('select').chosen().trigger('chosen:updated');
        // $('#globalLoader').remove();
        // $("#IdLoadView").removeClass("OnLoaderscroll");
    });
    
});
