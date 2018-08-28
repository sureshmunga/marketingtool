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
var tacticModel = require('../models/viewModels/tacticModel');
router.get('/tactic', tacticModel.list);
router.get('/program', function (req, res) {
    var r = JSON.stringify(req.body);
    
    var programlist = require('../models/viewModels/tacticModel');
    programlist.name(req.params.campaignId, function (response) {
        res.send(response)
    });
});


module.exports = router;