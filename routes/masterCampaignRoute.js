var express = require('express');
var router = express.Router();
var redshift = require('../redshift.js');
var masterCampaign = require('../models/masterCampaignModel');
var bodyParser = require('body-parser');
var User = require('../models/userRedshift');
var dateformat = require('dateformat')

var sunn = require('../models/mcadigitalid');
var bbb = require('../models/businessgroupnameinsertion');



var app = express()
var pp;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

var tacticModel = require('../models/viewModels/tacticModel');
router.get('/tactic', tacticModel.list);
router.get('/program', function (req, res) {
    var r = JSON.stringify(req.body);

    var programlist = require('../models/viewModels/tacticModel');
    programlist.name(req.params.campaignId, function (response) {
        res.send(response)
    });
});


router.get('/mastercampaign', masterCampaign.list);
router.get('/subcampaign', masterCampaign.subcampaign1);
router.get('/savedraft', masterCampaign.saveDraft);



router.get('/getprogramtypes:id', function (req, res) {
    var bbb = require('../models/businessgroupnameinsertion');
    bbb.names1(req.params.id, function (response) {
        console.log('campaign data are' + response);
        res.send(response)
    });
})

router.get('/savedraft', function (req, res) {
    /* var bbb = require('../models/businessgroupnameinsertion');
    bbb.names1(req.params.id,function(response){
    console.log('campaign data are'+response); */
    res.render('../views/CST/savedraft')
});

router.get('/log:id', function (req, res) {
    var ss = req.params.id;
    var sss = ss.split(",")
    console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeee' + sss[0]);
    res.render('../views/CST/masss', { name: ss[0] })
});

router.get('/saveDrafrhandler:id', function (req, res) {
   // console.log('reee' + req.params.id);
    var result = req.params.id.split(',');
    console.log('rrrr' + result);
    var campaignManagerName = result[0];
    var campaignManager = result[1];
    var campaignManagerDesc = result[2];
    var startDate = result[3];
    var endDate = result[4];
    var campaignID = result[5];
    console.log('start date' + startDate + 'End date' + endDate);

    masterCampaign.bhbhbnames1(req,res,campaignID,startDate,endDate)
});










router.post('/campaignregistration', function (req, res) {

    console.log('in campaignpage');
    var campaignName = req.body.CampaignName;
    console.log('in campaignpage' + campaignName);
    var Campaignmanager = req.body.Campaignmanager;
    console.log('in Campaignmanager' + Campaignmanager);
    var Campaigndescriptiongoals = req.body.Campaigndescriptiongoals;
    console.log('in Campaigndescriptiongoals' + Campaigndescriptiongoals);

    var mcasegmentid = req.body.mcasegment;
    console.log('in mcasegment' + mcasegmentid);

    var businesstypename = req.body.businesstype;
    console.log('in businesstype' + businesstypename);

    var businessgroupname = req.body.businessgroup;
    console.log('in businessgroup' + businessgroupname);

    var programfamilyname = req.body.programfamilies;
    console.log('in programfamilies' + programfamilyname);

    var startdate = req.body.startdate;
    console.log("startdate " + startdate);
    var enddate = req.body.enddate;
    console.log('end date ' + enddate);
    var clientid = 1;
    var mastercampaignid = 1;
    var status = 1;
    var isactive = 1;
    var mcadigitalid = 'ari123';
    var day = dateformat(startdate, "yy")
    console.log("date is" + day);
    var namingConvention = day + campaignName;
    console.log("naming convention is" + namingConvention);

    var res = sunn.sub(businessgroupname);
    console.log("value is " + res);
    var ff = res.substring(1, res.length - 2);
    var fff = "" + ff + ""
    console.log("ff is" + fff);
    var newbusinessgroup;
    var newBuss = {
        mastercampaignid: mastercampaignid,
        clientid: clientid,
        mcasegmentname: mcasegmentid,
        businessgroupname: businessgroupname,
        businesstypename: businesstypename,
        programfamilyname: programfamilyname,
        campaignName: campaignName,
        Campaigndescriptiongoals: Campaigndescriptiongoals,
        Campaignmanager: Campaignmanager,
        startdate: startdate,
        enddate: enddate,
        status: status,
        isactive: isactive,
        namingConvention: namingConvention,
        mcadigitalid: mcadigitalid

    };


    User.createbb(newBuss, res, function (err, user) {
        if (err) {
            console.log('out side error');
            res.writeHead(500, { 'contet-type': 'text/html' });
            res.send('<h1>Error Connecting data<h1>');
        } else {
            console.log("ins");
        }
    });

});

router.post('/subcampaignregistration', function (req, res) {

    console.log('in subregistration');
    var mastercampaignID = req.body.campaign;
    console.log('in subcampaignpage' + mastercampaignID);
    var programfamilyid = req.body.programtype;
    console.log('in programtype' + programfamilyid);
    var programname = req.body.programname;
    console.log('in programname' + programname);

    var campaignmanager = req.body.campaignmanager;
    console.log('in campaignmanager' + campaignmanager);

    var prodescgoals = req.body.prodescgoals;
    console.log('in prodescgoals' + prodescgoals);

    var market = req.body.market;
    console.log('in market' + market);

    var mcasegmentID = req.body.mcasegment;
    console.log('in mcasegment' + mcasegmentID);

    var businessgroupid = req.body.businessgroup;
    console.log('in businessgroup' + businessgroupid);

    var businesslineid = req.body.businessline;
    console.log('in businessline' + businesslineid);

    var secbusinesgroup = req.body.secbusinesgroup;
    console.log('in secbusinesgroup' + secbusinesgroup);

    var secbusinessline = req.body.secbusinessline;
    console.log('in secbusinessline' + secbusinessline);

    var leadbusinesstype = req.body.leadbusinesstype;
    console.log('in leadbusinesstype' + leadbusinesstype);

    var industrytype = req.body.industrytype;
    console.log('in industrytype' + industrytype);

    var secbusinesstype = req.body.secbusinesstype;
    console.log('in secbusinesstype' + secbusinesstype);


    var totalbudget = req.body.totalbudget;
    console.log('in totalbudget' + totalbudget);


    var totalspend = req.body.totalspend;
    console.log('in totalspend' + totalspend);


    var MQLG = req.body.MQLG;
    console.log('in MQLG' + MQLG);


    var MQLL = req.body.MQLL;
    console.log('in MQLL' + MQLL);


    var MQLH = req.body.MQLH;
    console.log('in MQLH' + MQLH);

    var MQLBM = req.body.MQLBM;
    console.log('in MQLBM' + MQLBM);

    var SALG = req.body.SALG;
    console.log('in SALG' + SALG);

    var SALL = req.body.SALL;
    console.log('in SALL' + SALL);

    var SALH = req.body.SALH;
    console.log('in SALH' + SALH);

    var SALB = req.body.SALB;
    console.log('in SALB' + SALB);

    var TPLG = req.body.TPLG;
    console.log('in TPLG' + TPLG);

    var TPLL = req.body.TPLL;
    console.log('in TPLL' + TPLL);

    var TPLH = req.body.TPLH;
    console.log('in TPLH' + TPLH);

    var TPLB = req.body.TPLB;
    console.log('in TPLB' + TPLB);

    var startdate = req.body.startdate;
    console.log("startdate " + startdate);
    var enddate = req.body.enddate;
    console.log('end date ' + enddate);

    var clientid = 1;
    // var mastercampaignid = 1;
    var status = 1;
    var isactive = 1;
    var programdigitalid = 'pri123';
    var day = dateformat(startdate, "yy")
    console.log("date is" + day);
    var namingConvention = day + mastercampaignID;
    console.log("naming convention is" + namingConvention);

    var subcampaign = {
        mastercampaignid: mastercampaignID,
        programfamilyid: programfamilyid,
        programname: programname,
        campaignmanager: campaignmanager,
        programdescription: prodescgoals,
        marketname: market,
        startdate: startdate,
        enddate: enddate,
        mcasegmentid: mcasegmentID,
        businessgroupid: businessgroupid,
        businesslineid: businesslineid,
        secbusinesgroup: secbusinesgroup,
        secbusinessline: secbusinessline,
        businesstypeid: leadbusinesstype,
        industryid: industrytype,
        secbusinesstype: secbusinesstype,
        totalbudget: totalbudget,
        totalspend: totalspend,
        MQLG: MQLG,
        MQLL: MQLL,
        MQLH: MQLH,
        MQLBM: MQLBM,
        SALG: SALG,
        SALL: SALL,
        SALH: SALH,
        SALB: SALB,
        TPLG: TPLG,
        TPLL: TPLL,
        TPLH: TPLH,
        TPLB: TPLB,
        clientid: clientid,
        status: status,
        isactive: isactive,
        namingConvention: namingConvention,
        programdigitalid: programdigitalid

    };


    User.createSubcampaign(subcampaign, res, function (err, user) {
        if (err) {
            console.log('out side error');
            res.writeHead(500, { 'contet-type': 'text/html' });
            res.send('<h1>Error Connecting data<h1>');
        } else {
            console.log("ins");
        }
    });

});




//router.get('/mastercampaign', (req, res)=>
//{

//redshift.query('SELECT mcasegmentid, mcasegmentname FROM apps."mcasegments"', {raw: true}, function(err, data, fields){
//  if(err) throw err;
//    console.log(data);
//    console.log(data[0].mcasegmentname);
//    console.log(data[0]);
//    console.log(data.length);
//  res.render('../views/CST/mastercampaign', {page_title:"Master Campaign", data:data});
//

//    });
//});

module.exports = router;
