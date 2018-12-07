jQuery.noConflict();
$(document).ready(function () {
    GetMastercmpReport($(this));
    $("#mastercmpDeepdiveViewclick").on("click", function () {
        GetMastercmpReport($(this));
    });
    $("#childcmpDeepdiveViewclick").on("click", function () {
        $.getJSON("/report/tactic/", function (response) {
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
                    //$("#reportViewChildDeepDiveGrid").find('thead tr').attr('class', 'bg-skyblue text-white');
                    //panel.find("#reportViewChildGrid_paginate").attr('class', 'page-link');
                    //panel.find("pagination").attr('class', 'page-link');
                },
                columns: [
                    { title: "Program ID", data: "programdigitalid", className: "text-nowrap" },
                    { title: "Tactic ID", data: "tcampaigndigitalid", className: "text-nowrap" },
                    { title: "Tactic", data: "tacticname", className: "text-nowrap" },
                    { title: "Program Family", data: "programfamiliyname", className: "text-nowrap" },
                    { title: "Program Job", data: "pfamilyjobname", className: "text-nowrap" },
                    { title: "Tactic Type", data: "tactictypename", className: "text-nowrap" },
                    { title: "MCA Segment", data: "mcasegmentname", className: "text-nowrap" },
                    { title: "Campaign Manager", data: "campaignmanager", className: "text-nowrap" },
                    { title: "Created By", data: "createdby", className: "text-nowrap" },
                    { title: "Vendor", data: "vendor", className: "text-nowrap" },
                    { title: "Business Group", data: "businessgroupname", className: "text-nowrap" },
                    { title: "Business Line", data: "businesslinename", className: "text-nowrap" },
                    { title: "Business Type", data: "businesstypename", className: "text-nowrap" },
                    { title: "Industry", data: "industryname", className: "text-nowrap" },
                    { title: "Status", data: "status", className: "text-nowrap" },
                ],
            });
            //columnfilter(table, 'reportViewChildDeepDiveGrid');
        });
    });

    $("#tacticcmpDeepdiveViewclick").on("click", function () {
        $.getJSON("/report/did/", function (response) {
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
                    //$("#reportViewTacticDeepDiveGrid").find('thead tr').attr('class', 'bg-skyblue text-white');
                    // panel.find("#reportViewTacticGrid_paginate").attr('class', 'page-link');
                    //  panel.find("pagination").attr('class', 'page-link');
                },
                columns: [
                    { title: "Tactic ID", data: "tcampaigndigitalid", className: "text-nowrap" },
                    { title: "Digital ID", data: "did", className: "text-nowrap" },
                    { title: "Tactic", data: "tacticname", className: "text-nowrap" },
                    { title: "MCA Segment", data: "mcasegmentname", className: "text-nowrap" },
                    { title: "Program", data: "programname", className: "text-nowrap" },
                    { title: "Created By", data: "createdby", className: "text-nowrap" },
                    { title: "Status", data: "status", className: "text-nowrap" },
                    { title: "Source", data: "sourcename", className: "text-nowrap" },
                    { title: "Medium", data: "mediumname", className: "text-nowrap" },
                    { title: "Content", data: "content", className: "text-nowrap" },
                    { title: "Term", data: "term", className: "text-nowrap" },
                ]
            });
            //columnfilter(table, 'reportViewTacticDeepDiveGrid');
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
                { title: "Campaign ID", data: "campaingid", className: "text-nowrap" },
                { title: "Program ID", data: "programdigitalid", className: "text-nowrap" },
                { title: "Program", data: "programname", className: "text-nowrap" },
                { title: "Campaign Manager", data: "campaignmanager", className: "text-nowrap" },
                { title: "Created By", data: "createdby", className: "text-nowrap" },
                { title: "Business Group", data: "businessgroupname", className: "text-nowrap" },
                { title: "Business Line", data: "businesslinename", className: "text-nowrap" },
                { title: "Business Type", data: "businesstypename", className: "text-nowrap" },
                { title: "Industry", data: "industryname", className: "text-nowrap"  },
                { title: "Status", data: "status" , className: "text-nowrap" },
                { title: "Budget", data: "budget" , className: "text-nowrap" },
                { title: "Spend", data: "spend", className: "text-nowrap" },
            ],
        });
        //columnfilter(table, 'reportViewMasterDeepDiveGrid');
    });
}