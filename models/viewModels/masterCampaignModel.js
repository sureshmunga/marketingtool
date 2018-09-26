var redshift = require('../../redshift');
var async = require("async");
var moment = require('moment');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select(), $in = sql.in;
var mcaselect = sql.select(), $in = sql.in;
var businesstypeselect = sql.select(), $in = sql.in;
var programFamilySelect = sql.select(), $in = sql.in;
var mastercampaign = sql.select(), $in = sql.in;
var programtabdata = sql.select(), $in = sql.in;
var programfamily = sql.select(), $in = sql.in;
var mcasegments = sql.select(), $in = sql.in;
var leadbusinessgroups = sql.select(), $in = sql.in;
var leadbusinessline = sql.select(), $in = sql.in;
var leadbusinesstype = sql.select(), $in = sql.in;
var leadindustry = sql.select(), $in = sql.in;
var markets = sql.select(), $in = sql.in;
var secbusinessgroups = sql.select(), $in = sql.in;
var secbusinesslines = sql.select(), $in = sql.in;
var secbusinesstype = sql.select(), $in = sql.in;

var date = require('date-and-time');

module.exports.getMasterCampaignList = function (req, res) {
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


module.exports.masterCampaignsaveDraft = function (req, res) {

  async.parallel([
    function (callback) {
      redshift.query('SELECT a.mastercampaignid,a.mastercampaignname,a.campaignmanager,a.campaigndescription,a.startdate,a.enddate FROM apps."mastercampaigns" a', callback)
      //console.log("callback result is" + callback);
    }
  ], function (err, results) {
    console.log(results[0].rows.length)
    // var startdate = results[0].rows[0].startdate;
    // var formatStartDate = date.format(startdate, 'YYYY-MM-DD');
    for(var i=0;i<results[0].rows.length;i++){
      var ff=[]
      var startdd = results[0].rows[i].startdate;
      var ff = date.format(startdd, 'YYYY-MM-DD');
      // var enddateee = console.log(results[0].rows[i].enddate);
      // var formatenddate = date.format(enddateee, 'YYYY-MM-DD');
    }
    console.log('formatted date ', ff);
    console.log(results[0].rows[0].startdate);
    console.log(results[0].rows[0].enddate);

    res.render('../views/CST/savedraft', { mastercampaign: results[0].rows, });
  });
}


exports.getMasterCampaignData = function (req, res, id) {

  
  
  var cmpaignId = id;
  console.log("campaign ID is " + cmpaignId);
//   sELECT distinct a.programfamiliyname,b.programfamilyid,a.programfamiliyid
// FROM apps.programfamilies a LEFT JOIN apps.mastercampaignsprogramfamilies b
// ON a.programfamiliyid = b.programfamilyid and b.mastercampaignid=153
  var programFamily = "select a.programfamiliyname,b.programfamilyid,a.programfamiliyid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.programfamilies a LEFT JOIN apps.mastercampaignsprogramfamilies b"
  +"  on a.programfamiliyid = b.programfamilyid"
  +"  and mastercampaignid ="+cmpaignId+""
  console.log(JSON.stringify(programFamily));
  redshift.query(programFamily,function(err,res){
      if(err) console.log('get Program families  : '+ err);
      else 
      {
          console.log('res ' + JSON.stringify(res));
      }
  });

  var businessGroup = "select a.businessgroupname,b.businessgroupid,a.businessgroupid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.businessgroups a LEFT JOIN apps.mastercampaignsbusinessgroups b"
  +"  on a.businessgroupid = b.businessgroupid"
  +"  and mastercampaignid ="+cmpaignId+""
  console.log(JSON.stringify(businessGroup));
  redshift.query(businessGroup,function(err,res){
      if(err) console.log('get business groups : '+ err);
      else 
      {
          console.log('res ' + JSON.stringify(res));
      }
  });

  var businessType = "select a.businesstypename,b.businesstypeid,a.businesstypeid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.businesstype a LEFT JOIN apps.mastercampaignsbusinesstype b"
  +"  on a.businesstypeid = b.businesstypeid"
  +"  and mastercampaignid ="+cmpaignId+""
  console.log(JSON.stringify(businessType));
  redshift.query(businessType,function(err,res){
      if(err) console.log('get businessType : '+ err);
      else 
      {
          console.log('res ' + JSON.stringify(res));
      }
  });

  var mcaSegment = "select a.mcasegmentname,b.mcasegmentid,a.mcasegmentid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.mcasegments a LEFT JOIN apps.mastercampaignsmcasegments b"
  +"  on a.mcasegmentid = b.mcasegmentid"
  +"  and mastercampaignid ="+cmpaignId+""
  console.log(JSON.stringify(mcaSegment));
  redshift.query(mcaSegment,function(err,res){
      if(err) console.log('get businessType : '+ err);
      else 
      {
          console.log('res ' + JSON.stringify(res));
      }
  });
  
    async.parallel([
    function (callback) { redshift.query(businessGroup, callback) },
    function (callback) { redshift.query(mcaSegment, callback) },
    function (callback) { redshift.query(businessType, callback) },
    function (callback) { redshift.query(programFamily, callback) },
    function (callback) { redshift.query(mastercampaign.select('apps.mastercampaigns.mastercampaignid', 'apps.mastercampaigns.campaignmanager', 'apps.mastercampaigns.campaigndescription', 'apps.mastercampaigns.mastercampaignname', 'apps.mastercampaigns.startdate', 'apps.mastercampaigns.enddate').from('apps.mastercampaigns').where($in('apps.mastercampaigns.mastercampaignid', cmpaignId)).toParams(), callback) },
  
  ], function (err, results) {
    console.log(results[0].rows);
    console.log(results[1].rows);
    console.log(results[2].rows);
    console.log(results[3].rows);
    console.log(results[4].rows[0].startdate);
    var star = results[4].rows[0].startdate;
    var fordate = date.format(star, 'YYYY-MM-DD');
    console.log('formatted date ', fordate);
    var end = results[4].rows[0].enddate;
    var enddate = date.format(end, 'YYYY-MM-DD');
    console.log('formatted date ', enddate);
    res.render('../views/CST/saveDrafrhandler', { businessgroups: results[0].rows, mcasegment: results[1].rows, businessType: results[2].rows, programFamilies: results[3].rows, mastercampaign: results[4].rows, startDate: fordate, endDate: enddate });
  });


}


