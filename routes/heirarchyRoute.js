var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var dateformat = require('dateformat');
var model = require('../models/viewModels/heirarchyModel');
var app = express();

router.get('/heirarchy', model.getheirarchy);
router.get('/program', function (req, res) {
    model.getprogrambyCampaign(function (response) {
        res.send(response);
    });
});

module.exports = router;