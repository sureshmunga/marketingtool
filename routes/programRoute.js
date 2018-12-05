var express = require('express');
var router = express.Router();
var programModel = require('../models/viewModels/programModel');
var bodyParser = require('body-parser');
var dateformat = require('dateformat');
var auth = require('./authencation');
var app = express();

router.get('/program', auth.ensureAuthenticated, programModel.getcampaign);

router.get('/program/:id', auth.ensureAuthenticated, function (req, res) {
    programModel.getprogramById(req.params.id, res);
});
router.get('/plist', auth.ensureAuthenticated, programModel.getprogramall);

router.get('/campaign:id', auth.ensureAuthenticated, function (req, res) {

    programModel.oncampaignchange(req.params.id, function (response) {
        res.send(response);
    });
});

router.post('/bgchange', auth.ensureAuthenticated, function (req, res) {
    var data = {
        "BGId": req.body['data[BGId]']
    };
    //console.log(req.body);
    programModel.onbgchange(data, res, function (response) {
        res.send(response);
    });
    //res.send('');
});

router.post('/btchange', auth.ensureAuthenticated, function (req, res) {
    var data = {
        "BTId": req.body["data[BTId]"]
    };
    programModel.onbtchange(data, res, function (response) {
        res.send(response)
    });
});

router.post('/programsave', auth.ensureAuthenticated, function (req, res) {
    console.log('user session ' + JSON.stringify(req.session.passport.user));
    var data = {
        "programid": req.body["data[programId]"],
        "CampaignId": req.body["data[CampaignId]"],
        "ProgramFamily": req.body["data[ProgramFamily]"],
        "Campaignmanager": req.body["data[Campaignmanager]"],
        "Description": req.body["data[Description]"],
        "Name": req.body["data[Name]"],
        "MarketId": req.body["data[MarketId][]"],
        "StartDate": req.body["data[StartDate]"],
        "EndDate": req.body["data[EndDate]"],
        "MCASegmentId": req.body["data[MCASegment]"],
        "BusinessGroupId": req.body["data[BusinessGroupId]"],
        "BusinessLineId": req.body["data[BusinessLineId]"],
        "BusinessGroup": req.body["data[BusinessGroup][]"],
        "Businessline": req.body["data[Businessline][]"],
        "BusinessTypeId": req.body["data[BusinessTypeId]"],
        "IndustryId": req.body["data[IndustryId]"],
        "Businesstype": req.body["data[lstBusinesstype][]"],
        "Industry": req.body["data[lstIndustry][]"],
        "Budget": req.body["data[Budget]"],
        "Spend": req.body["data[Spend]"],
        "MQLGol": req.body["data[MQLGol]"],
        "MQLLow": req.body["data[MQLLow]"],
        "MQLHigh": req.body["data[MQLHigh]"],
        "MQLSource": req.body["data[MQLSource]"],
        "SALGol": req.body["data[SALGol]"],
        "SALLow": req.body["data[SALLow]"],
        "SALHigh": req.body["data[SALHigh]"],
        "SALSource": req.body["data[SALSource]"],
        "TPGol": req.body["data[TPGol]"],
        "TPLow": req.body["data[TPLow]"],
        "TPHigh": req.body["data[TPHigh]"],
        "TPSource": req.body["data[TPSource]"],
        "status": req.body["data[Status]"],
        "user": req.session.passport.user
    };

    programModel.onprogramsave(data, res, function (response) {
        res.send(response)
    });
});


module.exports = router;