jQuery.noConflict();
$(document).ready(function () {
    GetMastercmpReport($(this));
    $("#mastercmpDeepdiveViewclick").on("click", function () {
        GetMastercmpReport($(this));
    });
    $("#childcmpDeepdiveViewclick").on("click", function () {
        $.getJSON("/report/GetChildDeepDive/", function (response) {
            var dataset = response.Result;
            if ($('#reportViewChildDeepDiveGrid')[0].childNodes.length > 0) {
                $('#reportViewChildDeepDiveGrid').dataTable().fnDestroy();
            }
            var table = $('#reportViewChildDeepDiveGrid').DataTable({
                "oLanguage": {
                    "sEmptyTable": "No Data available."
                },
                dom: '<"toolbar"><ft><lp>',
                paging: true,
                searching: true,
                ordering: true,
                info: false,
                data: dataset,
                "lengthMenu": [10, 25, 50, 75, 100],
                initComplete: function (settings, json) {
                    $("input[type=search]").attr("maxlength", "100");
                    $("#reportViewChildDeepDiveGrid").find('thead tr').attr('class', 'bg-skyblue text-white');
                    //panel.find("#reportViewChildGrid_paginate").attr('class', 'page-link');
                    //panel.find("pagination").attr('class', 'page-link');
                },
                columns: [
                    { title: "Program ID", data: "ProgramID", className: "text-nowrap col-lg-3" },
                    { title: "Tactic ID", data: "TacticID", className: "text-nowrap col-lg-3" },
                    { title: "Tactic", data: "Tactic", className: "text-nowrap col-lg-3" },
                    { title: "Program Family", data: "ProgramFamily", className: "text-nowrap col-lg-3" },
                    { title: "Program Job", data: "programjob", className: "text-nowrap col-lg-3" },
                    { title: "Tactic Type", data: "TacticType", className: "text-nowrap col-lg-3" },
                    { title: "MCA Segment", data: "MCASegment", className: "text-nowrap col-lg-3" },
                    { title: "Campaign Manager", data: "CampaignManager", className: "text-nowrap col-lg-3" },
                    { title: "Created By", data: "CreatedBy", className: "text-nowrap col-lg-3" },
                    { title: "Vendor", data: "Vendor", className: "text-nowrap col-lg-3" },
                    { title: "Lead Business Group", data: "LeadBusinessGroup", className: "text-nowrap col-lg-3" },
                    { title: "Lead Business Line", data: "LeadBusinessLine", className: "text-nowrap col-lg-3" },
                    { title: "Secondary Business Group", data: "BusinessGroup", className: "text-nowrap col-lg-3" },
                    { title: "Secondary Business Line", data: "BusinessLine", className: "text-nowrap col-lg-3" },
                    { title: "Business Type", data: "BusinessType", className: "text-nowrap col-lg-3" },
                    { title: "Industry", data: "Industry", className: "text-nowrap col-lg-3" },
                    { title: "Status", data: "Status", className: "text-nowrap col-lg-3" },
                ],
            });
            columnfilter(table, 'reportViewChildDeepDiveGrid');
        });
    });

    $("#tacticcmpDeepdiveViewclick").on("click", function () {
        $.getJSON("/report/scopecst/GetTacticDeepDive/", function (response) {
            var dataset = response.programbycampaign;
            if ($('#reportViewTacticDeepDiveGrid')[0].childNodes.length > 0) {
                $('#reportViewTacticDeepDiveGrid').dataTable().fnDestroy();
            }
            var table = $('#reportViewTacticDeepDiveGrid').DataTable({
                "oLanguage": {
                    "sEmptyTable": "No Data available."
                },
                dom: '<"toolbar"><ft><lp>',
                paging: true,
                searching: true,
                ordering: true,
                info: false,
                data: dataset,
                "lengthMenu": [10, 25, 50, 75, 100],
                initComplete: function (settings, json) {
                    $("input[type=search]").attr("maxlength", "100");
                    $("#reportViewTacticDeepDiveGrid").find('thead tr').attr('class', 'bg-skyblue text-white');
                    // panel.find("#reportViewTacticGrid_paginate").attr('class', 'page-link');
                    //  panel.find("pagination").attr('class', 'page-link');
                },
                columns: [
                    { title: "Tactic ID", data: "TacticID", className: "text-nowrap col-lg-2" },
                    { title: "Digital ID", data: "DigitalID", className: "text-nowrap col-lg-3" },
                    { title: "Tactic", data: "Tactic", className: "text-nowrap col-lg-3" },
                    { title: "MCA Segment", data: "MCASegment", className: "text-nowrap col-lg-3" },
                    { title: "Program", data: "Program", className: "text-nowrap col-lg-3" },
                    { title: "Created By", data: "CreatedBy", className: "text-nowrap col-lg-3" },
                    { title: "Status", data: "Status", className: "text-nowrap col-lg-3" },
                    { title: "Source", data: "Source", className: "text-nowrap col-lg-3" },
                    { title: "Medium", data: "Medium", className: "text-nowrap col-lg-3" },
                    { title: "Content", data: "Content", className: "text-nowrap col-lg-3" },
                    { title: "Term", data: "Term", className: "text-nowrap col-lg-3" },
                ]
            });
            columnfilter(table, 'reportViewTacticDeepDiveGrid');
        });
    });


    $("#rptMasterDeepD_btn").on('click', function (e) {
        e.preventDefault();
        var retseedatetime = getCurrentDate();
        window.location = "/ScopeCST/ExportDeepDive?type=master&date=" + retseedatetime;
        //$('<table>')
        // .append(
        //    $("#reportViewMasterDeepDiveGrid").DataTable().$('tr').clone()
        // ).table2excel({
        //    name: "Table2Excel",
        //    filename: "Master DeepDive_" + retseedatetime 
        //});
    });

    $("#rptChildDeepD_btn").on('click', function (e) {
        e.preventDefault();
        var retseedatetime = getCurrentDate();
        window.location = "/ScopeCST/ExportDeepDive?type=sub&date=" + retseedatetime;
        //$('<table>')
        // .append(
        //    $("#reportViewChildDeepDiveGrid").DataTable().$('tr').clone()
        // ).table2excel({
        //    name: "Table2Excel",
        //    filename: "SubCampaign DeepDive_" + retseedatetime
        //});
    });

    $("#rptTacticDeepD_btn").on('click', function (e) {
        e.preventDefault();
        var retseedatetime = getCurrentDate();
        window.location = "/ScopeCST/ExportDeepDive?type=tactic&date=" + retseedatetime;
        //$('<table>')
        // .append(
        //    $("#reportViewTacticDeepDiveGrid").DataTable().$('tr').clone()
        // )
        //.table2excel({
        //    name: "Table2Excel",
        //    filename: "TacticDeepDive Report_" + retseedatetime
        //});
    });

    function getCurrentDate() {
        var datestring = new Date();
        var year = datestring.getFullYear();
        var month = datestring.getMonth() + 1;
        locale = "en-us",
            month = datestring.toLocaleString(locale, { month: "long" });// "+ 1" becouse the 1st month is 0
        var day = datestring.getDate();
        var hour = datestring.getHours();
        var minutes = datestring.getMinutes();
        var secconds = datestring.getSeconds();
        return seedatetime = day + '_' + month + '_' + year + '_' + hour + ':' + minutes + ':' + secconds;
    }
});



function GetMastercmpReport(panel) {

    $.get("/report/program", function (response) {
        var dataset = response.programbycampaign;
        if ($('#reportViewMasterDeepDiveGrid')[0].childNodes.length > 0) {
            $('#reportViewMasterDeepDiveGrid').dataTable().fnDestroy();
        }
        var table = $('#reportViewMasterDeepDiveGrid').DataTable({
            "oLanguage": {
                "sEmptyTable": "No Data available."
            },
            dom: '<"toolbar"><ft><lp>',
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: dataset,
            "lengthMenu": [10, 25, 50, 75, 100],
            initComplete: function (settings, json) {
                $("input[type=search]").attr("maxlength", "100");
                // $("#reportViewMasterDeepDiveGrid").find('thead tr').attr('class', 'bg-skyblue text-white');
                // panel.find("#reportViewMasterGrid_paginate").attr('class', 'page-link');
                // panel.find("pagination").attr('class', 'page-link');
            },
            columns: [
                { title: "Campaign ID", data: "campaingid" },
                { title: "Program ID", data: "programdigitalid" },
                { title: "Program", data: "programname" },
                { title: "Campaign Manager", data: "campaignmanager" },
                { title: "Created By", data: "createdby" },
                { title: "Business Group", data: "businessgroupname" },
                { title: "Business Line", data: "businesslinename" },
                { title: "Business Type", data: "businesstypename" },
                { title: "Industry", data: "industryname"  },
                { title: "Status", data: "status"  },
                { title: "Budget", data: "budget"  },
                { title: "Spend", data: "spend" },
            ],
        });
        //columnfilter(table, 'reportViewMasterDeepDiveGrid');
    });
}