var express = require('express');
var router = express.Router();
var tacticModel = require('../models/viewModels/tacticModel');
var bodyParser = require('body-parser');
var dateformat = require('dateformat')

var sunn = require('../models/mcadigitalid');
var bbb = require('../models/businessgroupnameinsertion');

var app = express();
// Get Homepage
//router.get('/tactic', tacticModel.list);

router.get('/tactic', tacticModel.list);
router.get('/campaign:id', function (req, res) {
    tacticModel.programlst(req.params.id, function (response) {
        res.send(response)
    });
});
router.get('/program:id', function (req, res) {
    tacticModel.onprogramchange(req.params.id, function (response) {
        res.send(response)
    });
});
router.post('/bgchange',function(req,res){
    var data={
        "ProgramId":req.body["data[ProgramId]"],
        "BGId":req.body["data[BGId]"]
    };
    tacticModel.onbgchange(data,res, function (response) {
        res.send(response)
    });
});

router.post('/btchange',function(req,res){
    var data={
        "ProgramId":req.body["data[ProgramId]"],
        "BTId":req.body["data[BTId]"]
    };
    tacticModel.onbtchange(data,res, function (response) {
        res.send(response)
    });
});

router.post('/tacticsave',function(req,res){
    console.log(JSON.stringify(req.body));
    var data = {
        "TacticId":req.body["data[TacticId]"],
        "CampaignId":req.body["data[CampaignId]"],
        "ProgramId":req.body["data[ProgramId]"],
        "ProgramJobId":req.body["data[ProgramJobId]"],
        "TacticTypeId":req.body["data[TacticTypeId]"],
        "Name":req.body["data[Name]"],
        "TacticDescription":req.body["data[TacticDescription]"],
        "MCASegmentId":req.body["data[MCASegmentId]"],
        "MarketId":req.body["data[MarketId]"],
        "StartDate":req.body["data[StartDate]"],
        "EndDate":req.body["data[EndDate]"],
        "BusinessGroupId":req.body["data[BusinessGroupId]"],
        "BusinessLineId":req.body["data[BusinessLineId]"],
        "BusinessTypeId":req.body["data[BusinessTypeId]"],
        "IndustryId":req.body["data[IndustryId]"],
        "Vendor":req.body["data[Vendor]"]
    };

    tacticModel.ontacticsave(data,res, function (response) {
        res.send(response)
    });
});


module.exports = router;