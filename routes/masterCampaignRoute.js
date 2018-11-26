var express = require('express');
var router = express.Router();
var campaignModel = require('../models/viewModels/masterCampaignModel');
var bodyParser = require('body-parser');
var User = require('../models/userRedshift');
var dateformat = require('dateformat');
var auth = require('./authencation');


// var sunn = require('../models/mcadigitalid');
// var bbb = require('../models/businessgroupnameinsertion');
// var exphbs = require('express-handlebars');
// var path = require('path');
// var redshift = require('../redshift.js');
//var subcampaign = require('../models/viewModels/subcampaignModel');

router.get('/campaignlist', auth.ensureAuthenticated, campaignModel.campaignlist);
router.get('/campaign', auth.ensureAuthenticated, campaignModel.getMasterCampaignList);
router.get('/campaign:id', auth.ensureAuthenticated, campaignModel.getCampaignbyId);
router.get('/campaign/:id', auth.ensureAuthenticated, function(req, res){
    campaignModel.getCampaignbyId(req,res,req.params.id);
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
    var status = "Active";
    var isactive = 1;
    //var mcadigitalid = 'ari123';
    var  uniqueNumber = 0;

    var date = Date.now();
    
    if (date <= uniqueNumber) {
        date = ++uniqueNumber;
    } else {
        uniqueNumber = date;
    }

    console.log('unique number is'+date)
    var uniqueID =date;
    var mcadigitalid ='M'+ uniqueID.toString().slice(-5);
    console.log('mca digital ID is' + mcadigitalid);

    //var lastFiveChars = date.substr(-5);
    //console.log(lastFive);
    var res11;
    var day = dateformat(startdate, "yy")
    console.log("date is" + day);
    var namingConvention = day + '-'+ campaignName;
    console.log("naming convention is" + namingConvention);
    var user = req.session.passport.user
    // //var res = sunn.sub(businessgroupname);
    // console.log("value is " + res);
    // var ff = res.substring(1, res.length - 2);
    // var fff = "" + ff + ""
    // console.log("ff is" + fff);
    var newbusinessgroup;
    var newBuss = {
        mastercampaignid: mastercampaignid,
        clientid: clientid,
        mcaSegmentId: mcasegmentid,
        businessGroupID: businessgroupname,
        businessTypeId: businesstypename,
        programFamiliesID: programfamilyname,
        campaignName: campaignName,
        Campaigndescriptiongoals: Campaigndescriptiongoals,
        Campaignmanager: Campaignmanager,
        startdate: startdate,
        enddate: enddate,
        status: status,
        isactive: isactive,
        namingConvention: namingConvention,
        mcadigitalid: mcadigitalid,
        createdby:user
    };


    User.createMasterCampaignData(newBuss, res11).then(function(res44){
        console.log(res44);
        if(res44){
            console.log('inserted succ');
            res.render('../views/index');

        }
        //res.render();
       
    })
    //res.render('../views/CST/savedraft');

});

router.post('/updatecampaignregistration', function (req, res) {
    

    console.log('in campaignpage' + JSON.stringify(req.body));

    console.log('user session '+ JSON.stringify(req.session.passport.user));
    var start = req.body["data[StartDate]"];
    var day = dateformat(start, "yy")
    console.log("date is" + day);
    var campaignName = req.body["data[campname]"];
    var namingConvention = day + '-'+ campaignName;
    var data = {
        "CampaignId":req.body["data[CampaignId]"],
        "CampaignName":req.body["data[campname]"],
        "CampaignManager":req.body["data[campaignManager]"],
        "CampaignDescription":req.body["data[campaignDesc]"],
        "mcaSegmentId":req.body["data[mcaSegment][]"],
        "businessGroupID":req.body["data[businessGroup][]"],
        "businessTypeId":req.body["data[businessType][]"],
        "programFamiliesID":req.body["data[programFamilies][]"],
        "StartDate":req.body["data[StartDate]"],
        "EndDate":req.body["data[EndDate]"],
        "Status":req.body["data[Status]"],
        "user":req.session.passport.user,
        "namingconvention":namingConvention
    };


    // User.updateMasterCampaignData(data, res, function (err, user) {
    //     if (err) {
    //         console.log('out side error');
    //         res.writeHead(500, { 'contet-type': 'text/html' });
    //         res.send('<h1>Error Connecting data<h1>');
    //     } else {
    //         console.log("ins");
    //     }
    // });
    // User.updateMasterCampaignData(subcampaign, res).then(function(response){
    //     res.send(response)
    // })
    // }).catch(function(err){
    //     console.log('error is' + err)
    // })

    User.updateMasterCampaignData(data, res).then(function(response){
        console.log('ressssssss' + JSON.stringify(response))
        res.send(response)
    }).catch(function(err){
console.log('error is ibefre updae finctio'+ err);
    })
});


router.post('/campaignsavedradt', function (req, res) {
    

    console.log('in campaignpage save dfart' + JSON.stringify(req.body));

    console.log('user session '+ JSON.stringify(req.session.passport.user));
    var start = req.body["data[StartDate]"];
    var day = dateformat(start, "yy")
    console.log("date is" + day);
    var campaignName = req.body["data[campname]"];
    var namingConvention = day + '-'+ campaignName;
    var newBuss = {
       // "CampaignId":req.body["data[CampaignId]"],
        "CampaignName":req.body["data[campname]"],
        "CampaignManager":req.body["data[campaignManager]"],
        "CampaignDescription":req.body["data[campaignDesc]"],
        "mcaSegmentId":req.body["data[mcaSegment][]"],
        "businessGroupID":req.body["data[businessGroup][]"],
        "businessTypeId":req.body["data[businessType][]"],
        "programFamiliesID":req.body["data[programFamilies][]"],
        "StartDate":req.body["data[StartDate]"],
        "EndDate":req.body["data[EndDate]"],
        "Status":req.body["data[Status]"],
        "user":req.session.passport.user,
        "namingconvention":namingConvention
    };


    // User.updateMasterCampaignData(data, res, function (err, user) {
    //     if (err) {
    //         console.log('out side error');
    //         res.writeHead(500, { 'contet-type': 'text/html' });
    //         res.send('<h1>Error Connecting data<h1>');
    //     } else {
    //         console.log("ins");
    //     }
    // });
    // User.updateMasterCampaignData(subcampaign, res).then(function(response){
    //     res.send(response)
    // })
    // }).catch(function(err){
    //     console.log('error is' + err)
    // })

    // User.createMasterCampaignSaveDraft(newBuss, res, function (err, user) {
    //     if (err) {
    //         console.log('out side error');
    //         res.writeHead(500, { 'contet-type': 'text/html' });
    //         res.send('<h1>Error Connecting data<h1>');
    //     } else {
    //         console.log("ins");
    //     }
    // });

    User.createMasterCampaignSaveDraft(newBuss , res).then(function(ress){
        console.log('inside ;;;;')
        res.send(ress);
        //res.render('../views/cst/savedraft');
    })
});



    // User.createSubcampaign(subcampaign, res).then(function(response){
    //     res.send(response)
    // })
    // }).catch(function(err){


    //     console.log('error is' + err)
    // })



module.exports = router;

