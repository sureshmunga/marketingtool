var express = require('express');
var router = express.Router();
var tacticModel = require('../models/viewModels/tacticModel');
var bodyParser = require('body-parser');
var dateformat = require('dateformat')

var sunn = require('../models/mcadigitalid');
var bbb = require('../models/businessgroupnameinsertion');

var app = express();
var auth = require('./authencation');
// Get Homepage
//router.get('/tactic', tacticModel.list);

router.get('/tactic',auth.ensureAuthenticated, tacticModel.gettactic);

router.get('/tactic:id',auth.ensureAuthenticated, tacticModel.gettacticbyid);

router.get('/tactic/:id',auth.ensureAuthenticated, function (req, res) {
    tacticModel.gettacticbyid(req.params.id, res);
});
router.get('/tlist',auth.ensureAuthenticated, tacticModel.gettacticall);


router.get('/campaign:id',auth.ensureAuthenticated, function (req, res) {

    tacticModel.programlst(req.params.id, function (response) {
        res.send(response)
    });
});
router.get('/program:id', auth.ensureAuthenticated,function (req, res) {
    tacticModel.onprogramchange(req.params.id, function (response) {
        res.send(response)
    });
});



router.post('/bgchange', auth.ensureAuthenticated, function (req, res) {
    var data = {
        "ProgramId": req.body["data[ProgramId]"],
        "BGId": req.body["data[BGId]"]
    };
    tacticModel.onbgchange(data, res, function (response) {
        res.send(response)
    });
});

router.post('/btchange', auth.ensureAuthenticated, function (req, res) {
    var data = {
        "ProgramId": req.body["data[ProgramId]"],
        "BTId": req.body["data[BTId]"]
    };
    tacticModel.onbtchange(data, res, function (response) {
        res.send(response)
    });
});

router.post('/tacticsave',auth.ensureAuthenticated, function (req, res) {
    console.log(JSON.stringify(req.body));
    console.log('user session ' + JSON.stringify(req.session.passport.user));
    var data = {
        "tacticid": req.body["data[TacticId]"],
        "CampaignId": req.body["data[CampaignId]"],
        "ProgramId": req.body["data[ProgramId]"],
        "ProgramJobId": req.body["data[ProgramJobId]"],
        "TacticTypeId": req.body["data[TacticTypeId]"],
        "Name": req.body["data[Name]"],
        "TacticDescription": req.body["data[TacticDescription]"],
        "MCASegmentId": req.body["data[MCASegmentId]"],
        "MarketId": req.body["data[MarketId][]"],
        "StartDate": req.body["data[StartDate]"],
        "EndDate": req.body["data[EndDate]"],
        "BusinessGroupId": req.body["data[BusinessGroupId]"],
        "BusinessLineId": req.body["data[BusinessLineId]"],
        "BusinessTypeId": req.body["data[BusinessTypeId]"],
        "IndustryId": req.body["data[IndustryId]"],
        "Vendor": req.body["data[Vendor]"],
        "status": req.body["data[Status]"],
        "user": req.session.passport.user
    };

    tacticModel.ontacticsave(data, res, function (response) {
        res.send(response)
    });
});

router.post('/getdidbytacticid',auth.ensureAuthenticated, function (req, res) {
    var data = {
        "tacticId": req.body["data[tacticId]"],
        "tactictypeid": req.body["data[tactictypeid]"]
    };

    tacticModel.getdidbytacticid(data, res, function (response) {
        res.send(response)
    });
});

router.post('/didsave', auth.ensureAuthenticated, function (req, res) {
    var data = [];
    var count = req.body.count;
    console.log(count);
    var model = {};
    for (var i = 0; i < count; i++) {
        model = {
            "digitalid" : req.body['model['+i+'][Id]'],
            "sourceid" : req.body['model['+i+'][Source_Id]'],
            "content" : req.body['model['+i+'][Content]'],
            "mediumid" : req.body['model['+i+'][Medium_Id]'],
            "term" : req.body['model['+i+'][Term]'],
            "tactictypeid" : req.body['model['+i+'][TacticType_Id]'],
            "tacticid" : req.body['model['+i+'][tacticid]'],
            "status" : req.body['model['+i+'][status]'],
            "othersource" : req.body['model['+i+'][OtherSource]'],
            "anchorlink" : req.body['model['+i+'][AnchorLink]'],
            "url" : req.body['model['+i+'][Url]'],
            "clientid" : "1", 
            "user": req.session.passport.user
        };
        data.push(model);
    }
    tacticModel.didsave(data,res, function (response) {
        res.send(response);
    });
});



module.exports = router;