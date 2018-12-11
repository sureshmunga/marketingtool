jQuery.noConflict();
$(document).ready(function(){
    $(document).on('click','#btnDigitaltouchpoint',function(){
        $('#txtSource_chosen').removeAttr("style");
        $('#txtMedium_chosen').removeAttr("style");
        return false;
    });

    $(document).on("change", "#drpDIDFilter", function () {

        var didfilter = $("#drpDIDFilter").val();
        var Id = $('#tacticid').val();

        var data = {
            "tacticId": Id,
            "filter" : didfilter
        };

        $.post("/TacticCampaign/GetFilterDID", { "tacticId": Id, "filter": didfilter }, function (response) {
            if (response.Status) {
                DigitalGrid(response.Result);
            }
            else {
                ConfigurationModel.AlertDialog("Response", response.Message);
            }
        });
        return false;
    });
    $("#gridReport tbody").on('click', '.btn-mc-action', function () {
        var tacticid = $('#tacticid').val();
        var digitalid = parseInt($(this).attr('dId'))
        var action = $(this).attr('dtype');
        var data = {
            "statustype": action,
            "Id": digitalid,
            "tacticid": tacticid
        };
        if (action === "Hide" || action === "restore") {
            actionUrl = "/TacticCampaign/CancelDigitalTouchPoint";
            var mesg = "";
            if (action == "Hide") {
                mesg = 'Are you sure you want to hide digital touch point ?';
            }
            else {
                mesg = 'Are you sure you want to ' + action + '?';
            }

            ConfigurationModel.ConfirmationDialog('Confirmation', mesg, function () {
                
                $.ajax({
                    type: 'POST',
                    contentType: "application/json",
                    url: actionUrl,
                    data: JSON.stringify(data),
                    success: function (response) {
                        ConfigurationModel.AlertDialog("Alert", response.Message);
                        if (response.Status) {
                            DigitalGrid(response.Result);
                        }

                    },
                    error: function (jqxhr, textStatus, error) {

                    }
                });
                $("#btnNoConfirmYesNo").find(".modal-footer").find(".draft-btn").click();
            });
        }        
    });

    $(document).on("change", "#txtSource", function () {
        var TacticTypeId = $("#drpTacticType").val();
        if ($('#txtSource :selected').text() == "Other" || $('#txtSource :selected').text() == "email list" || $('#txtSource :selected').text() == "event name" || $('#txtSource :selected').text() == "webinar vendor") {
            if ($('#txtSource :selected').text() == "Other") {
                $('#lblOther').html('Other');
                $("#lblMedium").addClass("col30_redbar");
                $("#lblMedium").removeClass("col30");
            }
            else if ($('#txtSource :selected').text() == "email list") {
                $('#lblOther').html('email list');
    
            }
            else if ($('#txtSource :selected').text() == "event name") {
                $('#lblOther').html('event name');
    
            }
            else if ($('#txtSource :selected').text() == "webinar vendor") {
                $('#lblOther').html('webinar vendor');
    
            }
            $('#divSource').removeClass("col-md-8");
            $('#divSource').addClass("col-md-4");
            $('#divOther').show();
        }
        else {
            $('#divSource').removeClass("col-md-4");
            $('#divSource').addClass("col-md-8");
            $('#divOther').hide();
            if (TacticTypeId == 89) {
                $("#lblMedium").addClass("col30");
                $("#lblMedium").removeClass("col30_redbar");
                $("#dvMedium").text("");
            }
            
        }
    });
});

//Digital Touchpoint
function ftacticData() {
    $("#txtTacticID").val($("#tcampaigndigitalid").val());
    $("#txtTName").val($("#txtTacticName").val());
    $("#txtType").val($("#drpTacticType option:selected").text());
    $(document).on('change','#drpBusinessType', function() {
        var drpTacticType = $('#drpTacticType').val();
        var tacticid = $('#tacticid').val();
        var data={
            "tacticId":tacticid,
            "tactictypeid":drpTacticType
        };
        $.post('/tactic/getdidbytacticid',{data:data},function(response){  
            if (response.status) {
               
                DigitalGrid(response.Result.DIDList);
            }
            else {
                ConfigurationModel.AlertDialog("Response", response.Message);
            }
        });
    });
    return false;
}

function EnableButton() {
    $("#btnSave").removeAttr("disabled");
    $("#btnsubmit").removeAttr("disabled");
    $('#btnAdd').removeAttr('disabled')

}
function DisableButton() {
    $("#btnSave").attr("disabled", "disabled");
    $("#btnsubmit").attr("disabled", "disabled");
    $('#btnAdd').attr('disabled', 'disabled')
}
function savedigitalpoint(status) {
    var DigitalTouchPointViewModel = [];
    var tacticid = $('#tacticid').val();
    //var index = 0
    $('#gridReport tbody tr').each(function (index) {
        var obj = ($(this).context.id).split('_')[1];
        if (obj != undefined) {
            var id = $("#hid" + obj).val();
            var gridstatus = $('#status' + obj + '').html();

            if (id == "0" || gridstatus === 'Draft') {

                var model = {
                    "Id": id,
                    "Source_Id": $('#hidsource' + obj + '').val(),
                    "Content": $('#content' + obj + '').html() == "null" ? '' : $('#content' + obj + '').html(),
                    "Medium_Id": $('#hidmedium' + obj + '').val(),
                    "Term": $('#term' + obj + '').html() == "null" ? '' : $('#term' + obj + '').html(),
                    "TacticType_Id": $('#drpTacticType option:selected').val(),
                    "tacticid": tacticid,
                    "status": status,
                    "OtherSource": $('#hidothersource' + obj + '').val(),
                    "AchorLink": $('#hidachorlink' + obj + '').html().trim() == "null" ? '' : $('#hidachorlink' + obj + '').html(),//$('#hidachorlink' + obj + '').val(),
                    "Url": $('#url' + obj + '').html().trim() == "null" ? '' : $('#url' + obj + '').html()
                };
                DigitalTouchPointViewModel.push(model);
            }
        }

    });
    if (DigitalTouchPointViewModel != null && DigitalTouchPointViewModel.length != 0) {
        DisableButton();
        $.post("/tactic/didsave", { model: DigitalTouchPointViewModel }, function (response) {
            ConfigurationModel.AlertDialog("Message", response.Message);
            EnableButton();
            if (response.Status) {

                DigitalGrid(response.Result);
                if (status == "Complete") {
                    window.location = "/tactic/DownloadExcel?model=" + tacticid;
                    EnableButton();
                }

            }
        });
    }
    else {
        ConfigurationModel.AlertDialog("Message", "Please add atleast one digital row to save.");
    }
}

function ReExportdigitalpoint() {
    var tacticid = $('#tacticid').val();
    window.location = "/TacticCampaign/DownloadExcel?model=" + tacticid;
}

function closepopup() {
    var modal = document.getElementById("digital-pop");
    modal.style.display = "none";

}

function checkUrlForUTM(Url) {
    var queryStr = Url.indexOf('?'); 
    if (queryStr != -1) {
        return true;
    } else {       
        return false;
    }
}

function checkUrlFordot(Url) {   
    var dotStr = Url.indexOf('.');
    if (dotStr != -1) {
        return false;       
    } else {
        return true;
    }
}

function checkUrlForMpercnt(Url) {
    var MpercntStr = Url.indexOf('&');
    if (MpercntStr != -1) {
        return true;
    } else {
        return false;
    }
}

function checkUrlhttp(Url) {
    var MpercntStr = Url.indexOf('http');
    if (MpercntStr != -1) {
        return true;
    } else {        
        return false;
    }
}


function fDigitalValidation() {
    $('#dvsource').hide();
    $('#dvMedium').hide();
    $('#dvContent').hide();
    $('#dvTerms').hide();
    $('#dvother').hide();
    $('#dvUrl').hide();
    $('#dvAnchorLink').hide();
    var valid = false;


    var tactictype_id = $("#drpTacticType").val();
    if (tactictype_id != "76" && tactictype_id != "89") {
        if ($("#txtSource").val().trim() == "") {
            $("#dvsource").text("Please select Source");
            $('#dvsource').show();
            valid = true;
        }
        if ($("#txtMedium").val().trim() == "") {
            $("#dvMedium").text("Please select Medium");
            $('#dvMedium').show();
            valid = true;
        }
    }
    if ($('#txtSource :selected').text() == "Other") {
        if ($("#txtOther").val().trim() == "") {
            $("#dvother").text("Please enter Source Name");
            $('#dvother').show();
            valid = true;
        }
        if ($("#txtMedium").val().trim() == "") {
            $("#dvMedium").text("Please select Medium");
            $('#dvMedium').show();
            valid = true;
        }
    }
    var txtachorlink = $("#txtAnchorLink").val().trim();
    if (txtachorlink != "") {
        var dotStr = txtachorlink.indexOf(' ');
        var hashStr = txtachorlink.indexOf('#');
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        if (!regex.test(txtachorlink)) {//Please enter anchor link without space and special characters.
            $("#dvAnchorLink").text("Please enter anchor link without space and special characters.");
            $('#dvAnchorLink').show();
            valid = true;
        }
        else {
            if (dotStr != -1) {
                $("#dvAnchorLink").text("Please enter anchor link without space and special characters.");
                $('#dvAnchorLink').show();
                valid = true;
            }
            else if (hashStr != -1) {
                $("#dvAnchorLink").text("Please enter anchor link without space and special characters.");
                $('#dvAnchorLink').show();
                valid = true;
            }
        }
    }

    if ($("#txtUrl").val().trim() != "") {

        var txturl = $("#txtUrl").val().trim();
        var IsexistUTMtr = checkUrlForUTM(txturl);
        var IsexistDotstr = checkUrlFordot(txturl);
        var IsexistMpercntstr = checkUrlForMpercnt(txturl);
        var ishttpsvalid = checkUrlhttp(txturl);
        var queryStr = txturl.indexOf('://');
        var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
        if (!re.test(txturl)) {
            $("#dvUrl").text("Please enter valid url");
            $('#dvUrl').show();
            valid = true;
        }
        else if (IsexistUTMtr) {
            $("#dvUrl").text("Please enter url without UTM parameter");
            $('#dvUrl').show();
            valid = true;
        }
        else if (IsexistDotstr) {
            $("#dvUrl").text("Please enter valid url with dot like .com, .org, .net etc");
            $('#dvUrl').show();
            valid = true;
        }
        else if (IsexistMpercntstr) {
            $("#dvUrl").text("Please enter url without &");
            $('#dvUrl').show();
            valid = true;
        }
        else if (ishttpsvalid) {
            $("#dvUrl").text("Please enter url without http or https");
            $('#dvUrl').show();
            valid = true;
        }
        else if (queryStr != -1) {
            $("#dvUrl").text("Please enter valid url without ://");
            $('#dvUrl').show();
            valid = true;
        }


    }
    return valid;
}
function AddRow() {
    var responseTblRow;
    if (fDigitalValidation()) {
        return false;
    }
    if ($('#hdnIndex').val() == "") {
        $('#hdnIndex').val("-1");
    }

    var index = Number($('#hdnIndex').val()) + 1;
    var sourceval = $("#txtSource").val();
    var source = "";
    if (sourceval != "0" && sourceval != "-1") {
        source = $("#txtSource option:selected").text();        
        var divOther = $("#divOther").is(":hidden");
        if (divOther) {
            source = "";
            $("#txtOther").val("");
        }
        else {
            source = $("#txtOther").val();
        }
        //if (source == 'Other' || sourceval == "16") {
        //    source = $("#txtOther").val();
        //}
        
        
    }
    var medium = $("#txtMedium option:selected");
    var medumtext = "";
    if (medium.val() != "0" && medium.val() != "-1") {
        medumtext = medium.text();
    }
    //<td id="othersource' + index + '">' + $("#txtOther").val() + '</td>\
    //<td id="anchorLink' + index + '">' + $("#txtAnchorLink").val() + '</td>\
    //<input type="hidden" id="hidachorlink' + index + '" value="' + $("#txtAnchorLink").val() + '"/>
    responseTblRow = $('<tr id="tr_' + index + '">\<td id="digitalid' + index + '">0<input type="hidden" id="hid' + index + '" value="0"/></td>\
                           <td id="source' + index + '">' + source + '<input type="hidden" id="hidsource' + index + '" value="' + $("#txtSource").val() + '"/><input type="hidden" id="hidothersource' + index + '" value="' + $("#txtOther").val() + '"/></td>\
                           <td id="medium' + index + '">' + medumtext + '<input type="hidden" id="hidmedium' + index + '" value="' + $("#txtMedium").val() + '"/>\
                           </td>\
                           <td id="content' + index + '">' + $("#txtContent").val() + '</td>\
                           <td id="term' + index + '">' + $("#txtTerms").val() + '</td>\
                           <td id="hidachorlink' + index + '">' + $("#txtAnchorLink").val() + '</td>\
                           <td id="url' + index + '">' + $("#txtUrl").val() + '</td>\
                           <td id="status' + index + '">Draft</td>\
                           <td><a onclick="removerow(' + index + ')" title="Delete" class="btn-mc-action" value="Delete" data-toggle="modal"><i class="fa fa-trash" aria-hidden="true"></i></a></td>\
                       </tr>');

    $('#gridReport tbody').append(responseTblRow);
    $('#hdnIndex').val(index);
    $("#txtSource").val("");
    $("#txtMedium").val("");
    $("#txtContent").val("");
    $("#txtTerms").val("");
    $("#txtOther").val("");
    $("#txtAnchorLink").val("");
    $("#txtUrl").val("");
    $('#hdnIndex').val(index);
    //mandatorySourceMedium();
    $("#divOther").hide();
    EnableButton();
    $("#btnReExport").attr("disabled", "disabled");
    return false;
}
function removerow(id) {
    var tr = $("#tr_" + id);
    ConfigurationModel.ConfirmationDialog('Confirmation', 'Are you sure you want to delete?', function () {
        $('#gridReport tbody').find(tr).remove();

    });
    return false;
}
function DigitalGrid(dataset) {
    $('#gridReport tbody').find('tr').remove();
    var isSubmiited = true;
    $.each(dataset.DigitalTouchPoint, function (index, item) {
        var hideaction = "";
        if (item.IsCancel == false) {
            if (item.IsSource == false) {
                hideaction = "<a href='#' dtype='Hide' title='Hide' dId=" + item.Id + " class='btn-mc-action' value='hide' ><i class='fa fa-remove' aria-hidden='true'></i></a>";
            }
        }
        else {
            type = "restore";
            hideaction = '<a href="#" dtype="restore" title="restore" dId=' + item.Id + ' class="btn-mc-action" value="restore" ><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></a>';
        }
        //item.Sources == "Other" ||
        //<input type="hidden" id="hidachorlink' + index + '" value="' + item.AchorLink + '"/>
        var Source = item.Sources == "email list" || item.Sources == "event name" || item.Sources == "webinar vendor" ? item.Sources + "-" + item.OtherSource : (item.Sources == "Other" ? item.OtherSource : item.Sources);
        var DigitalId = item.InheritStatus == 'Submitted' ? item.DisplayDigitalId : '';
        var responseTblRow = $('<tr id="tr_' + index + '">\<td style="text-align: left;" id="digitalid' + index + '">' + DigitalId + ' <input type="hidden" id="hid' + index + '" value="' + item.Id + '"/> </td>\
                           <td id="source' + index + '">' + Source + '<input type="hidden" id="hidsource' + index + '" value="' + item.Source_Id + '"/>\
                           <input type="hidden" id="hidothersource' + index + '" value="' + item.OtherSource + '"/></td>\
                           <td id="medium' + index + '">' + item.Medium + '<input type="hidden" id="hidmedium' + index + '" value="' + item.Medium_Id + '"/></td>\
                           <td id="content' + index + '">' + item.Content + '</td>\
                           <td id="term' + index + '">' + item.Term + '</td>\
                           <td id="hidachorlink' + index + '">' + item.AchorLink + '</td>\
                           <td id="url' + index + '">' + item.Url + '</td>\
                           <td id="status' + index + '">' + item.InheritStatus + '</td>\
                           <td><a ' + (item.InheritStatus == 'Submitted' ? "disabled='disabled'" : "onclick='return DeleteSingleDigitalpoint(" + item.Id + ")'") + ' title="Delete" class="btn-mc-action" value="Delete" data-toggle="modal"><i class="fa fa-trash" aria-hidden="true"></i></a>\
                               ' + hideaction + ' </td> \
                       </tr>');

        $('#gridReport tbody').append(responseTblRow);
        $('#hdnIndex').val(index);
        if (item.InheritStatus != 'Submitted') {
            EnableButton();
            isSubmiited = false;
        }
    });

    if (dataset.DigitalTouchPoint.length > 0 && isSubmiited) {
        $("#btnReExport").removeAttr("disabled");
    }
}

function DeleteSingleDigitalpoint(Id) {
    ConfigurationModel.ConfirmationDialog('Confirmation', 'Are you sure you want to delete?', function () {
        var tacticid = $('#tacticid').val();
        DisableButton();
        var url = "/TacticCampaign/DeleteSingleDigitalPoint?digitalId=" + Id + "&tacticId=" + tacticid + "&date=" + new Date()
        $.get(url, function (response) {
            EnableButton();
            //ConfigurationModel.AlertDialog("Response", response.Message);
            if (response.Status) {
                DigitalGrid(response.Result);
            }
        });
    });
}
function fDeleteDigitalpoint() {

    var Id = $('#tacticid').val();
    var url = "/TacticCampaign/DeleteDigitalPoint?tacticId=" + Id + "&dt=" + new Date();
    $.get("/TacticCampaign/DeleteDigitalPoint?tacticId=" + Id + "", function (response) {
        ConfigurationModel.AlertDialog("Response", response.Message);
        EnableButton();
        if (response.Status) {
            DigitalGrid(response.Result);
        }
    });
}
