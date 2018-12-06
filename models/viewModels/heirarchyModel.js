var redshift = require('../../redshift.js');
var async = require("async");
var moment = require('moment');
var utilhelpers = require("../utilhelper.js");


module.exports.getheirarchy = function (req, res) {
    res.render('../views/cst/heirarchy');
};

module.exports.getprogrambyCampaign = function(callback){    
    async.parallel([
        function (callback) { 
            redshift.query('select * from campaignheirarchy', callback) 
          }
      ], 
      function (err, data) {
            if(err){
                console.log(err);
            } else{
                return callback({programbycampaign:data[0].rows});
            }
      });
};
