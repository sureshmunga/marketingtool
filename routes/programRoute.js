var express = require('express');
var router = express.Router();
var programModel = require('../models/viewModels/programModel');
var bodyParser = require('body-parser');
var dateformat = require('dateformat');
var auth = require('./authencation');
var app = express();

router.get('/program', auth.ensureAuthenticated, programModel.getcampaign);
router.get('/program/:id', auth.ensureAuthenticated, function(req, res){
    programModel.gettacticbyid(req.params.id,res);
});
router.get('/plist',auth.ensureAuthenticated, programModel.getprogramall);

router.get('/campaign:id', auth.ensureAuthenticated, function (req, res) {
    
    programModel.programlst(req.params.id, function (response) {
        res.send(response);
    });
});

router.get('/program', programModel.subcampaign1);
router.get('/program',programModel.getPrograme);
router.get('/getprogramtypes:id', function (req, res) {
    var bbb = require('../models/businessgroupnameinsertion');
    bbb.names1(req.params.id, function (response) {
        console.log('campaign data are' + JSON.stringify(response));
        res.send(response);
    });
});


router.get('/getbusinesslines:id', function (req, res) {
    console.log('inside new function' + req.params.id);
    var bbb = require('../models/businessgroupnameinsertion');
    bbb.businesslines(req.params.id, function (response) {
        console.log('campaign data are' + JSON.stringify(response));
        res.send(response);
    });
});

router.get('/getindustry:id', function (req, res) {
    console.log('inside new function');
    var bbb = require('../models/businessgroupnameinsertion');
    bbb.industry(req.params.id, function (response) {
        console.log('industry data are' + JSON.stringify(response));
        res.send(response);
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
    //var programdigitalid = 'pri123';
    var  uniqueNumber1 = 0;

    var date1 = Date.now();
    
    if (date1 <= uniqueNumber1) {
        date1 = ++uniqueNumber1;
    } else {
        uniqueNumber1 = date1;
    }

    console.log('unique number is'+date1)
    var uniqueID1 =date1;
    var programdigitalid ='P'+ uniqueID1.toString().slice(-5);
    console.log('ProgrM ID is' + programdigitalid);
    var user = req.session.passport.user;
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
        programdigitalid: programdigitalid,
        createdby:user

    };


    // User.createSubcampaign(subcampaign, res, function (err, user) {
    //     if (err) {
    //         console.log('out side error');
    //         res.writeHead(500, { 'contet-type': 'text/html' });
    //         res.send('<h1>Error Connecting data<h1>');
    //     } else {
    //         console.log("Updated succesfully" + user);
    //     }
    // });

    programModel.createSubcampaign(subcampaign, res).then(function(ress){
        if(ress){
            res.render('../views/index')
        }
    })
});




router.post('/updatesubcampaignregistration', function (req, res) {

    console.log('in subregistration' + req.body.programid);
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
    //var programdigitalid = 'pri123';
    var  uniqueNumber1 = 0;

    var date1 = Date.now();
    
    if (date1 <= uniqueNumber1) {
        date1 = ++uniqueNumber1;
    } else {
        uniqueNumber1 = date1;
    }

    console.log('unique number is'+date1)
    var uniqueID1 =date1;
    var programdigitalid ='P'+ uniqueID1.toString().slice(-5);
    console.log('ProgrM ID is' + programdigitalid);
    var user = req.session.passport.user;
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
        programdigitalid: programdigitalid,
        updatedby:user,
        programId:req.body.programid

    };


    User.UpdateSubcampaign(subcampaign, res, function (err, user) {
        if (err) {
            console.log('out side error');
            res.writeHead(500, { 'contet-type': 'text/html' });
            res.send('<h1>Error Connecting data<h1>');
        } else {
            console.log("Updated succesfully" + user);
            res.render('../views/index');
        }
    });
});


router.post('/subcampaignsavedradt', function (req, res) {

    
    console.log('in campaignpage save dfart' + JSON.stringify(req.body));

    console.log('user session '+ JSON.stringify(req.session.passport.user));
    var start = req.body["data[startDate]"];
    var day = dateformat(start, "yy")
    console.log("date is" + day);
    var programName = req.body["data[programName]"];
    var namingConvention = day + '-'+ programName;
    
    var subcampaign = {
        mastercampaignid: req.body["data[mastercampaigID]"],
        programfamilyid: req.body["data[programtypeID]"],
        programname: req.body["data[programName]"],
        campaignmanager: req.body["data[campaignManager]"],
        programdescription: req.body["data[programDesc]"],
        marketname: req.body["data[markets][]"],
        startdate: req.body["data[startDate]"],
        enddate: req.body["data[endDate]"],
        mcasegmentid: req.body["data[mcaSegment]"],
        businessgroupid: req.body["data[leadBusinessGroup]"],
        businesslineid: req.body["data[leadBusinessLine]"],
        secbusinesgroup: req.body["data[secBusinessGroup][]"],
        secbusinessline: req.body["data[secBusinessLines][]"],
        businesstypeid: req.body["data[leadBusinessType]"],
        industryid: req.body["data[LeadIndustry]"],
        secbusinesstype: req.body["data[secBusinessType][]"],
        totalbudget: req.body["data[totalBudget]"],
        totalspend: req.body["data[totalSpend]"],
        MQLG: req.body["data[MQLG]"],
        MQLL: req.body["data[MQLL]"],
        MQLH: req.body["data[MQLH]"],
        MQLBM: req.body["data[MQLBM]"],
        SALG: req.body["data[SALG]"],
        SALL: req.body["data[SALL]"],
        SALH: req.body["data[SALH]"],
        SALB: req.body["data[SALB]"],
        TPLG: req.body["data[TPLG]"],
        TPLL: req.body["data[TPLL]"],
        TPLH: req.body["data[TPLH]"],
        TPLB: req.body["data[TPLB]"],
        clientid: 1,
        status: "Draft",
        isactive: 1,
        namingConvention: namingConvention,
        createdby:req.session.passport.user

    };
    User.createSubcampaign(subcampaign, res).then(function(respp){
        if(respp){
            res.send(respp);
        }

    })
});

module.exports = router;