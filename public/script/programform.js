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

    $(document).on('change', '#drpCampaign', function () {
        var campaignId = $('#drpCampaign').val();
        $.get('/program/campaign' + campaignId, function (response) {

            bindProgramfamily(response.programFamily);
            bindMCASegment(response.MCASegment);
            bindmarket(response.market);
            bindBusinessGroup(response.BusinessGroup);
            bindBusinessType(response.BusinessType);
        });
    });

    $(document).on('change', '#drpBusinessGroup', function () {
        var drpBusinessGroup = Number($('#drpBusinessGroup').val());
        var data = {};
        var BGId = [];
        BGId.push(drpBusinessGroup);
        data.BGId = BGId.join();
        console.log(data.BGId);
        $.post('/program/bgchange', { data: data }, function (response) {
            bindBusinessLine(response.BusinessLine);
        });
    });

    $(document).on('change', '#lstBusinessGroup', function () {
        var data = {};
        var Ids = [];
        $('#lstBusinessGroup').closest('.form-group').find('ul li.search-choice').each(function () {
            Ids.push($('#lstBusinessGroup option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
        });

        data.BGId = Ids.join();
        //console.log(data.BGId);
        $.post('/program/bgchange', { data: data }, function (response) {
            bindSecBusinessLine(response.BusinessLine);
        });
    });

    $(document).on('change', '#drpBusinesstype', function () {
        var drpBusinessType = Number($('#drpBusinesstype').val());
        var data = {};
        var BGId = [];
        BGId.push(drpBusinessType);
        data.BTId = BGId.join();

        $.post('/program/btchange', { data: data }, function (response) {
            bindIndustry(response.Industry);
        });
    });
    $(document).on('change', '#lstBusinesstype', function () {
        var data = {};
        var BGId = [];
        $('#lstBusinesstype').closest('.form-group').find('ul li.search-choice').each(function () {
            BGId.push($('#lstBusinesstype option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
        });

        data.BTId = BGId.join();
        //console.log(data.BGId);
        $.post('/program/btchange', { data: data }, function (response) {
            bindSecIndustry(response.Industry);

        });
    });

    $(document).on('click', '#btnDraft', function () {//fvalidationonsubmit() === 
        if (true) {
            var Data =CollectTacticFormData();
            Data.Status = 'Draft';
            $.post('/program/programsave',{data:Data},function(response){
                alert(response.messagae);
                if(response.status){
                    location.href='/program/plist/';
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
            var Data =CollectTacticFormData();
            Data.Status = 'Active';
            $.post('/program/programsave',{data:Data},function(response){
                alert(response.messagae);
                if(response.status){
                    location.href='/program/plist';
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
    data.programId = $("#programId").val();
    data.CampaignId = $('#drpCampaign').val();
    data.ProgramFamily = $('#drpProgramFamily').val();
    data.Name = $('#txtName').val().trim();
    data.Campaignmanager = $('#txtCampaignmanager').val().trim();
    data.Description = $('#txtDescription').val();

    data.MarketId = [];
    $('#lstMarkets').closest('.form-group').find('ul li.search-choice').each(function () {
        data.MarketId.push($('#lstMarkets option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.StartDate = $("#txtStartDate").val();
    data.EndDate = $("#txtEndDate").val();
    // data.StartDate = $.datepicker.formatDate('mm/dd/yy', $("#txtStartDate").datepicker("getDate"));
    // data.EndDate = $.datepicker.formatDate('mm/dd/yy', $("#txtEndDate").datepicker("getDate"));
    data.MCASegment = $("#drpMCASegment").val();

    data.BusinessGroupId = $('#drpBusinessGroup').val();
    data.BusinessLineId = $('#drpBusinessline').val();

    data.BusinessGroup = [];
    $('#lstBusinessGroup').closest('.form-group').find('ul li.search-choice').each(function () {
        data.BusinessGroup.push($('#lstBusinessGroup option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });
    data.Businessline = [];
    $('#lstBusinessline').closest('.form-group').find('ul li.search-choice').each(function () {
        data.Businessline.push($('#lstBusinessline option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.BusinessTypeId = $('#drpBusinesstype option:selected').val();
    data.IndustryId = $('#drpIndustry option:selected').val();

    data.lstBusinesstype = [];
    $('#lstBusinesstype').closest('.form-group').find('ul li.search-choice').each(function () {
        data.lstBusinesstype.push($('#lstBusinesstype option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });
    data.lstIndustry = [];
    $('#lstIndustry').closest('.form-group').find('ul li.search-choice').each(function () {
        data.lstIndustry.push($('#lstIndustry option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.Budget = $('#txtBudget').val();
    data.Spend = $('#txtSpend').val();

    data.MQLGol = $('#MQLGola').val();
    data.MQLLow = $('#MQLLow').val();
    data.MQLHigh = $('#MQLHigh').val();
    data.MQLSource = $('#MQLSource').val();

    data.SALGol = $('#SALGol').val();
    data.SALLow = $('#SALLow').val();
    data.SALHigh = $('#SALHigh').val();
    data.SALSource = $('#SALSource').val();

    data.TPGol = $('#TPGol').val();
    data.TPLow = $('#TPLow').val();
    data.TPHigh = $('#TPHigh').val();
    data.TPSource = $('#TPSource').val();
    //data.TacticCampaignReachResponseViewModels = Getmetricreachdata();

    return data;
}

function bindSecIndustry(data) {
    $('#lstIndustry').find("option").remove();
    //$('#lstMarkets').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#lstIndustry').append('<option value=' + item.industryid + '>' + item.industryname + '</option>');
    });
}

function bindIndustry(data) {
    $('#drpIndustry').find("option").remove();
    $('#drpIndustry').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpIndustry').append('<option value=' + item.industryid + '>' + item.industryname + '</option>');
    });
}
function bindBusinessType(data) {
    $('#drpBusinesstype').find("option").remove();
    $('#drpBusinesstype').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpBusinesstype').append('<option value=' + item.businesstypeid + '>' + item.businesstypename + '</option>');
    });
    $('#lstBusinesstype').find("option").remove();
    $.each(data, function (index, item) {
        $('#lstBusinesstype').append('<option value=' + item.businesstypeid + '>' + item.businesstypename + '</option>');
    });
}
function bindSecBusinessLine(data) {
    $('#lstBusinessline').find("option").remove();
    //$('#lstMarkets').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#lstBusinessline').append('<option value=' + item.businesslineid + '>' + item.businesslinename + '</option>');
    });
}
function bindBusinessLine(data) {
    $('#drpBusinessline').find("option").remove();
    $('#drpBusinessline').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpBusinessline').append('<option value=' + item.businesslineid + '>' + item.businesslinename + '</option>');
    });
}
function bindBusinessGroup(data) {
    $('#drpBusinessGroup').find("option").remove();
    $('#drpBusinessGroup').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpBusinessGroup').append('<option value=' + item.businessgroupid + '>' + item.businessgroupname + '</option>');
    });
    $('#lstBusinessGroup').find("option").remove();
    $.each(data, function (index, item) {
        $('#lstBusinessGroup').append('<option value=' + item.businessgroupid + '>' + item.businessgroupname + '</option>');
    });
}
function bindProgramfamily(data) {
    $('#drpProgramFamily').find("option").remove();
    $('#drpProgramFamily').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpProgramFamily').append('<option value=' + item.programfamiliyid + '>' + item.programfamiliyname + '</option>');
    });
}

function bindMCASegment(data) {
    $('#drpMCASegment').find("option").remove();
    $('#drpMCASegment').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpMCASegment').append('<option value=' + item.mcasegmentid + '>' + item.mcasegmentname + '</option>');
    });
}

function bindmarket(data) {
    $('#lstMarkets').find("option").remove();
    $.each(data, function (index, item) {
        $('#lstMarkets').append('<option value=' + item.marketid + '>' + item.marketname + '</option>');
    });
}
