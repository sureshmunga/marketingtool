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
            '.chosen-select-width': { width: '60%' }
        }
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }

        $('select').chosen().trigger('chosen:updated');
        // $('#globalLoader').remove();
        // $("#IdLoadView").removeClass("OnLoaderscroll");
    });
    
    $(document).on('click', '#btnDraft', function () {//fvalidationonsubmit() === 
        if (true) {
            var campaignData =CollectTacticFormData();
            campaignData.Status = 'Draft';
            $.post('/cst/campaignsave',{data:campaignData},function(response){
                alert(response.messagae);
                if(response.status){
                    location.href='/cst/campaignlist';
                }
            });
        }
        else {
            var pos = $(focusId).offset().top;
            $('body, html').animate({ scrollTop: pos - 70 });
        }
        return false;
    });

    $(document).on('click', '#btnSubmit', function () {//fvalidationonsubmit() === 
        if (true) {
            var campaignData =CollectTacticFormData();
            campaignData.Status = 'Active';
            $.post('/cst/campaignsave',{data:campaignData},function(response){
                alert(response.messagae);
                if(response.status){
                    location.href='/cst/campaignlist';
                }
            });
        }
        else {
            var pos = $(focusId).offset().top;
            $('body, html').animate({ scrollTop: pos - 70 });
        }
        return false;
    });
});


function CollectTacticFormData() {

    var data = {
    };
    data.campaignid = $('#campaignid').val();
    data.CampaignName = $('#CampaignName').val();
    data.Campaignmanager = $('#Campaignmanager').val();
    data.Campaigndescription = $('#Campaigndescription').val();

    data.mcasegment = [];
    $('#lstmcasegment').closest('.form-group').find('ul li.search-choice').each(function () {
        data.mcasegment.push($('#lstmcasegment option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.BusinessGroup = [];
    $('#lstBusinessGroup').closest('.form-group').find('ul li.search-choice').each(function () {
        data.BusinessGroup.push($('#lstBusinessGroup option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.BusinessType = [];
    $('#lstBusinessType').closest('.form-group').find('ul li.search-choice').each(function () {
        data.BusinessType.push($('#lstBusinessType option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.ProgramFamilies = [];
    $('#lstProgramFamilies').closest('.form-group').find('ul li.search-choice').each(function () {
        data.ProgramFamilies.push($('#lstProgramFamilies option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.StartDate = $("#txtStartDate").val();
    data.EndDate = $("#txtEndDate").val();
    
    return data;
}