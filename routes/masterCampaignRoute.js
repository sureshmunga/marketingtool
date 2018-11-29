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
router.get('/campaign', auth.ensureAuthenticated, campaignModel.getCampaign);
//router.get('/campaign:id', auth.ensureAuthenticated, campaignModel.getCampaignbyId);
router.get('/campaign/:id', auth.ensureAuthenticated, function (req, res) {
    campaignModel.getCampaignbyId(req, res, req.params.id);
});

router.post('/campaignsave', function (req, res) {
    var data = {
        "mastercampaignid": req.body["data[campaignid]"],
        "mastercampaignname": req.body["data[CampaignName]"],
        "campaignmanager": req.body["data[Campaignmanager]"],
        "campaigndescription": req.body["data[Campaigndescription]"],
        "mcasegment": req.body["data[mcasegment][]"],
        "BusinessGroup": req.body["data[BusinessGroup][]"],
        "BusinessType": req.body["data[BusinessType][]"],
        "ProgramFamilies": req.body["data[ProgramFamilies][]"],
        "startdate": req.body["data[StartDate]"],
        "enddate": req.body["data[EndDate]"],
        "status": req.body["data[Status]"],
        "user": req.session.passport.user
    };
    //console.log('print 1 '+JSON.stringify(data));
    campaignModel.campaignsave(data, res, function (response) {
        res.send(response);
    });
});


module.exports = router;