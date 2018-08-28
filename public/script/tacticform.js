$(document).ready(function () {

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

    $(document).on('change','#drpCampaign',function(){
        var campaignId = $('#drpCampaign').val();
        $.post('/cst/program',{campaignId : campaignId},function(response){
            $('#drpProgram').find("option").remove();
            $('#drpProgram').append('<option value=0>None selected</option>');
            $.each(response, function (index, item) {
                $('#drpProgram').append('<option value=' + item.Id + '>' + item.Value + '</option>');
            });
        });
    });

    $(document).on('change','#drpProgram',function(){
        var drpProgram = $('#drpProgram').val();
        $.post('/cst/program',{ProgramId : drpProgram},function(response){
            
        });
    });


    $(document).on('click', '#btntacticDraft', function () {
        alert("hi");
        return false;
    });
});