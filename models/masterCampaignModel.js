var redshift = require('../redshift.js');
var async = require("async");
var moment = require('moment');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select(), $in = sql.in;
var mcaselect = sql.select();
var businesstypeselect = sql.select();
var programFamilySelect = sql.select();
//var sss = select.distinct();
//module.exports.list = function(req, res){
//  redshift.query('SELECT mcasegmentid, mcasegmentname FROM apps."mcasegments"', {raw: true}, function(err, datamcaSegment){
//    if(err) throw err;
//    console.log(datamcaSegment[0].mcasegmentname);
//     res.render('../views/CST/mastercampaign', {page_title:"Master Campaign", data:datamcaSegment});
//  });
//}


module.exports.list = function (req, res) {
  async.parallel([
    function (callback) { redshift.query('SELECT mcasegmentid,    mcasegmentname FROM apps."mcasegments"', callback) },
    function (callback) { redshift.query('SELECT businessgroupid, businessgroupname  FROM apps."businessgroups"', callback) },
    function (callback) { redshift.query('SELECT businesstypeid,businesstypename  FROM apps."businesstype"', callback) },
    function (callback) { redshift.query('SELECT programfamiliyid,programfamiliyname  FROM apps."programfamilies"', callback) }

  ], function (err, results) {
    console.log(results[0].rows);
    console.log('second row');
    console.log(results[1].rows);
    res.render('../views/CST/mastercampaign', { mcasegment: results[0].rows, businessgroups: results[1].rows, businesstype: results[2].rows, programfamilies: results[3].rows });
  });
}

module.exports.subcampaign = function (req, res) {
  async.parallel([
    function (callback) {
      redshift.query('SELECT mcasegmentid,    mcasegmentname FROM apps."mcasegments"', callback)
      console.log("callback result is" + callback);
    },
    function (callback) { redshift.query('SELECT businessgroupid, businessgroupname  FROM apps."businessgroups"', callback) },
    function (callback) { redshift.query('SELECT businesstypeid,businesstypename  FROM apps."businesstype"', callback) },
    function (callback) { redshift.query('SELECT programfamiliyid,programfamiliyname  FROM apps."programfamilies"', callback) },
    function (callback) { redshift.query('SELECT marketid,marketname  FROM apps."market"', callback) }
  ], function (err, results) {
    console.log(results[0].rows);
    console.log('second row');
    console.log(results[1].rows);
    console.log('third row');
    console.log('market' + results[4].rows);
    res.render('../views/CST/subcampaign', { mcasegment: results[0].rows, businessgroups: results[1].rows, businesstype: results[2].rows, programfamilies: results[3].rows, market: results[4].rows });
  });
}
module.exports.subcampaign1 = function (req, res) {
  async.parallel([
    function (callback) {
      redshift.query('SELECT mcasegmentid,    mcasegmentname FROM apps."mcasegments"', callback)
      console.log("callback result is" + callback);
    },
    function (callback) { redshift.query('SELECT businessgroupid, businessgroupname  FROM apps."businessgroups"', callback) },
    function (callback) { redshift.query('SELECT businesstypeid,businesstypename  FROM apps."businesstype"', callback) },
    function (callback) { redshift.query('SELECT programfamiliyid,programfamiliyname  FROM apps."programfamilies"', callback) },
    function (callback) { redshift.query('SELECT marketid,marketname  FROM apps."market"', callback) },
    function (callback) { redshift.query('select mastercampaignid,mastercampaignname from apps."mastercampaigns"', callback) },
    function (callback) { redshift.query('select businesslineid,businesslinename from apps."businesslines"', callback) },
    function (callback) { redshift.query('select industryid,industryname from apps."industry"', callback) }
  ], function (err, results) {
    console.log(results[0].rows);
    console.log('second row');
    console.log(results[1].rows);
    console.log('third row');
    console.log('market' + results[4].rows);
    console.log('campaign' + results[5].rows);
    res.render('../views/CST/subcampaign', { mcasegment: results[0].rows, businessgroups: results[1].rows, businesstype: results[2].rows, programfamilies: results[3].rows, market: results[4].rows, campaign: results[5].rows, businessline: results[6].rows, industry: results[7].rows });
  });
}
/* 
module.exports.mca = function(mcasegmentname,req,res){

  redshift.parameterizedQuery('SELECT mcasegmentid FROM apps."mcasegments" WHERE "mcasegmentname" = $1', [mcasegmentname], { raw: true } , function(err,res){
    if(err){

    }else{
      console.log("mcaid is "+ JSON.stringify(res));
      return (JSON.stringify(res))
    }
  });
sqlbri
}
 */
module.exports.saveDraft = function (req, res) {
  async.parallel([
    function (callback) {
      redshift.query('SELECT a.mastercampaignid,a.mastercampaignname,a.campaignmanager,a.campaigndescription,a.startdate,a.enddate FROM apps."mastercampaigns" a', callback)
      //console.log("callback result is" + callback);
    }
  ], function (err, results) {
    console.log(JSON.stringify(results[0].rows));

    res.render('../views/CST/savedraft', { mastercampaign: results[0].rows });
  });
}


module.exports.list11 = function (req, res) {
  async.parallel([
    function (callback) { redshift.query('SELECT mcasegmentid,    mcasegmentname FROM apps."mcasegments"', callback) },
  ], function (err, results) {
    console.log(results[0].rows);
    console.log('second row');
    console.log(results[1].rows);
    res.render('../views/CST/saveDrafrhandler', { mcasegment: results[0].rows, businessgroups: results[1].rows, businesstype: results[2].rows, programfamilies: results[3].rows });
  });
}


exports.bhbhbnames1 = function (req, res, id,startdate,enddate) {
  //var startdate = {"startdate":startdate}
  var startdate = startdate;
  var endDate = enddate;
  console.log('inside start date' + startdate);
  console.log('inside start date' + endDate);
  var cmpaignId = id;
  console.log("campaign ID is " + cmpaignId);
  /* var statement1 = select.distinct('apps.businessgroups.businessgroupname', 'apps.businessgroups.businessgroupid').from('apps.businessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsbusinessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams();
  var statement2 = select.distinct('apps.businessgroups.businessgroupname', 'apps.businessgroups.businessgroupid').from('apps.businessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsbusinessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams();
  var statement3 = select.distinct('apps.mcasegments.mcasegmentname', 'apps.mcasegments.mcasegmentid').from('apps.mcasegments').where($in('apps.mastercampaignsmcasegments.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsmcasegments').on('apps.mastercampaignsmcasegments.mcasegmentid', 'apps.mcasegments.mcasegmentid').toParams();
  console.log('statement1 is' + JSON.stringify(statement1))
  console.log('statement3 is' + JSON.stringify(statement3)) */
 // console.log(programFamilySelect.distinct('apps.programfamilies.programfamiliyname', 'apps.programfamilies.programfamiliyid').from('apps.programfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsprogramfamilies').on('apps.mastercampaignsprogramfamilies.programfamiliyid', 'apps.programfamilies.programfamiliyid').toParams());
  async.parallel([
    function (callback) { redshift.query(select.distinct('apps.businessgroups.businessgroupname', 'apps.businessgroups.businessgroupid').from('apps.businessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsbusinessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams(), callback) },
   function (callback) { redshift.query(mcaselect.distinct('apps.mcasegments.mcasegmentname', 'apps.mcasegments.mcasegmentid').from('apps.mcasegments').where($in('apps.mastercampaignsmcasegments.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsmcasegments').on('apps.mastercampaignsmcasegments.mcasegmentid', 'apps.mcasegments.mcasegmentid').toParams(), callback) },
   function (callback) { redshift.query(businesstypeselect.distinct('apps.businesstype.businesstypename', 'apps.businesstype.businesstypeid').from('apps.businesstype').where($in('apps.mastercampaignsbusinesstype.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsbusinesstype').on('apps.mastercampaignsbusinesstype.businesstypeid', 'apps.businesstype.businesstypeid').toParams(), callback) },
    function (callback) { redshift.query(programFamilySelect.distinct('apps.programfamilies.programfamiliyname', 'apps.programfamilies.programfamiliyid').from('apps.programfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsprogramfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams(), callback) },
    function (callback) { redshift.parameterizedQuery('SELECT mastercampaignid,mastercampaignname,campaignmanager,campaigndescription,startdate,enddate FROM apps."mastercampaigns" WHERE "mastercampaignid" = $1', [cmpaignId], callback  )},
  ], function (err, results) {
    //console.log(results[0].rows);
    //console.log(results[1].rows);
    //console.log(results[2].rows);
    console.log(results[3].rows);
    console.log(results[4].rows);
   /*  console.log('second row');
    console.log(results[1].rows); */
    res.render('../views/CST/saveDrafrhandler', { businessgroups: results[0].rows,mcasegment: results[1].rows,businessType: results[2].rows, programFamilies: results[3].rows,mastercampaign: results[4].rows,startDate:startdate,enddate:endDate});
  });


}





      //console.log('inside names' + groupname + 'master campaign id is ' + mastercampaignId);
      //select('*').from('person').innerJoin('address').on('person.addr_id', 'address.id');
      //SELECT a.mastercampaignid,a.programfamilyid,c.programfamiliyname  FROM apps.mastercampaignsprogramfamilies a, apps.programfamilies c WHERE a.mastercampaignid=114 and a.programfamilyid=c.programfamiliyid

      //where($in('businessgroupname', groupname)).toParams();
