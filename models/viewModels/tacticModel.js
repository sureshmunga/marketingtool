var redshift = require('../../redshift.js');
var async = require("async");
var moment = require('moment');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select(), $in = sql.in;
var mcaselect = sql.select();
var businesstypeselect = sql.select();
var programFamilySelect = sql.select();
var tacticviewmodel = require('../tactic');//tacticModelView

module.exports.list = function (req, res) {
    async.parallel([
      function (callback) { 
          redshift.query('SELECT a.mastercampaignid,a.mastercampaignname FROM apps."mastercampaigns" a', callback) 
        }  
    ], 
    function (err, results) {
        // console.log('Campaign Rows');
        // console.log(JSON.stringify(results[0].rows));
        res.render('../views/CST/tactic', { campaign: results[0].rows });
    });
}

//   module.exports.list = function (req, res) {
//     async.parallel([
//         function (callback) {
//           redshift.query('SELECT t.*,p.mastercampaignid FROM apps.tactic t inner join apps.programs p on t.programid=p.programid', callback)
//           //console.log("callback result is" + callback);
//         }
//       ], function (err, results) {
//         res.render('../views/CST/tactic', { tactic: results[0].rows });
//       });
//   }