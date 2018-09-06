$(document).ready(function () {
    // handlebars.registerHelper('if_eq', function(a, b, opts) {
    //     if(a == b)
    //         return opts.fn(this);
    //     else
    //         return opts.inverse(this);
    //   });
    $('select').chosen().trigger('chosen:updated');
    $(".chosen-choices").outerWidth(705);
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

    $(document).on('change','#drpCampaign',function(){
        var campaignId = $('#drpCampaign').val();
        $.get('/tactic/campaign'+campaignId,function(response){            
            $('#drpProgram').find("option").remove();
            $('#drpProgram').append('<option value=0>None selected</option>');
            $.each(response.program, function (index, item) {
                $('#drpProgram').append('<option value=' + item.programid + '>' + item.programname + '</option>');
            });

            $('#drpTacticType').find("option").remove();
            $('#drpTacticType').append('<option value=0>None selected</option>');
            $.each(response.tactictype, function (index, item) {
                $('#drpTacticType').append('<option value=' + item.tactictypeId + '>' + item.tactictypeName + '</option>');
            });
        });
    });

    $(document).on('change','#drpProgram',function(){
        var drpProgram = $('#drpProgram').val();
        
        $.get('/tactic/program'+drpProgram,function(response){
            bindProgramjob(response.programjob);
            bindMCASegment(response.MCASegment);
            bindmarket(response.market);
            bindBusinessGroup(response.BusinessGroup);
            bindBusinessLine(response.BusinessLine);
            bindBusinessType(response.BusinessType);
            bindIndustry(response.Industry);
        });
    });
    
    $(document).on('change','#drpBusinessGroup', function() {
        var drpProgram = $('#drpProgram').val();
        var drpBusinessGroup = $('#drpBusinessGroup').val();
        var data={
            "ProgramId":drpProgram,
            "BGId":drpBusinessGroup
        };
        $.post('/tactic/bgchange',{data:data},function(response){  
            bindBusinessLine(response.BusinessLine);
        });
    });

    $(document).on('change','#drpBusinessType', function() {
        var drpProgram = $('#drpProgram').val();
        var drpBusinessType = $('#drpBusinessType').val();
        var data={
            "ProgramId":drpProgram,
            "BTId":drpBusinessType
        };
        $.post('/tactic/btchange',{data:data},function(response){   
            bindIndustry(response.Industry);
        });
    });


    $(document).on('click', '#btntacticDraft', function () {//fvalidationonsubmit() === 
        if (true) {
            var tacticData =CollectTacticFormData();
            tacticData.Status = 'Draft';
            $.post('/tactic/tacticsave',{data:tacticData},function(response){
                alert(response.messagae);
                if(response.status){
                    location.href='/tactic/tactic/'+response.tacticid;
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
            var tacticData =CollectTacticFormData();
            tacticData.Status = 'Active';
            $.post('/tactic/tacticsave',{data:tacticData},function(response){
                alert(response.messagae);
                if(response.status){
                    location.href='/tactic/tlist';
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

function bindmarket(data){
    $('#lstMarkets').find("option").remove();
    //$('#lstMarkets').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#lstMarkets').append('<option value=' + item.marketid + '>' + item.marketname + '</option>');
    });
}
function bindIndustry(data){
    $('#drpIndustry').find("option").remove();
    $('#drpIndustry').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpIndustry').append('<option value=' + item.industryid + '>' + item.industryname + '</option>');
    });
}
function bindBusinessType(data){
    $('#drpBusinessType').find("option").remove();
    $('#drpBusinessType').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpBusinessType').append('<option value=' + item.businesstypeid + '>' + item.businesstypename + '</option>');
    });
}
function bindBusinessLine(data){
    $('#drpBusinessLine').find("option").remove();
    $('#drpBusinessLine').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpBusinessLine').append('<option value=' + item.businesslineid + '>' + item.businesslinename + '</option>');
    });
}
function bindBusinessGroup(data){
    $('#drpBusinessGroup').find("option").remove();
    $('#drpBusinessGroup').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpBusinessGroup').append('<option value=' + item.businessgroupid + '>' + item.businessgroupname + '</option>');
    });
}
function bindProgramjob(data){    
    $('#drpProgramJob').find("option").remove();
    $('#drpProgramJob').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpProgramJob').append('<option value=' + item.ProgramJobId + '>' + item.pfamilyjobname + '</option>');
    });
}
function bindMCASegment(data){
    $('#drpMCASegment').find("option").remove();
    $('#drpMCASegment').append('<option value=0>None selected</option>');
    $.each(data, function (index, item) {
        $('#drpMCASegment').append('<option value=' + item.mcasegmentid + '>' + item.mcasegmentname + '</option>');
    });
}

function CollectTacticFormData() {

    var data = {
    };
    data.TacticId = $('#tacticid').val();
    data.CampaignId = $('#drpCampaign').val();
    data.ProgramId = $('#drpProgram').val();
    data.ProgramJobId = $('#drpProgramJob').val();
    data.TacticTypeId = $('#drpTacticType').val();
    data.Name = $('#txtTacticName').val().trim();
    data.TacticDescription = $('#txtDescription').val().trim();
    data.MCASegmentId = $('#drpMCASegment').val();

    data.MarketId = [];
    $('#lstMarkets').closest('.form-group').find('ul li.search-choice').each(function () {
        data.MarketId.push($('#lstMarkets option').eq(parseInt($(this).find('a').attr('data-option-array-index'))).val());
    });

    data.StartDate = $("#txtStartDate").val();
    data.EndDate = $("#txtEndDate").val();
    // data.StartDate = $.datepicker.formatDate('mm/dd/yy', $("#txtStartDate").datepicker("getDate"));
    // data.EndDate = $.datepicker.formatDate('mm/dd/yy', $("#txtEndDate").datepicker("getDate"));
    
    data.BusinessGroupId = $('#drpBusinessGroup').val();
    data.BusinessLineId = $('#drpBusinessLine').val();

    data.BusinessTypeId = $('#drpBusinessType option:selected').val();
    data.IndustryId=$('#drpIndustry option:selected').val();
    
    data.Vendor = $('#txtVendor').val().trim();
    //data.TacticCampaignReachResponseViewModels = Getmetricreachdata();
    
    return data;
}