var redshift = require('../../redshift');
var async = require("async");
var moment = require('moment');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select(),
  $in = sql.in;
var mcaselect = sql.select(),
  $in = sql.in;
var businesstypeselect = sql.select(),
  $in = sql.in;
var programFamilySelect = sql.select(),
  $in = sql.in;
var mastercampaign = sql.select(),
  $in = sql.in;
var programtabdata = sql.select(),
  $in = sql.in;
var programfamily = sql.select(),
  $in = sql.in;
var mcasegments = sql.select(),
  $in = sql.in;
var leadbusinessgroups = sql.select(),
  $in = sql.in;
var leadbusinessline = sql.select(),
  $in = sql.in;
var leadbusinesstype = sql.select(),
  $in = sql.in;
var leadindustry = sql.select(),
  $in = sql.in;
var markets = sql.select(),
  $in = sql.in;
var secbusinessgroups = sql.select(),
  $in = sql.in;
var secbusinesslines = sql.select(),
  $in = sql.in;
var secbusinesstype = sql.select(),
  $in = sql.in;

var date = require('date-and-time');

module.exports.getMasterCampaignList = function (req, res) {
  async.parallel([
    function (callback) {
      redshift.query('SELECT mcasegmentid,    mcasegmentname FROM apps."mcasegments"', callback)
    },
    function (callback) {
      redshift.query('SELECT businessgroupid, businessgroupname  FROM apps."businessgroups"', callback)
    },
    function (callback) {
      redshift.query('SELECT businesstypeid,businesstypename  FROM apps."businesstype"', callback)
    },
    function (callback) {
      redshift.query('SELECT programfamiliyid,programfamiliyname  FROM apps."programfamilies"', callback)
    }

  ], function (err, results) {
    console.log(results[0].rows);
    console.log('second row');
    console.log(results[1].rows);
    res.render('../views/CST/mastercampaign', {
      mcasegment: results[0].rows,
      businessgroups: results[1].rows,
      businesstype: results[2].rows,
      programfamilies: results[3].rows
    });
  });
}


module.exports.campaignlist = function (req, res) {
  async.parallel([
    function (callback) {
      var SQLQuery = 'SELECT a.mastercampaignid as id,a.mastercampaignname as campaignname,' +
        ' a.campaignmanager as manageremail,a.campaigndescription as Description,a.startdate,a.enddate, ' +
        ' a.mcampaigndigitalid as campaignid, a.status, a.createdby ' +
        ' FROM apps."mastercampaigns" a';
      redshift.query(SQLQuery, callback)
      //console.log("callback result is" + callback);
    }
  ], function (err, results) {
    for (var i = 0; i < results[0].rows.length; i++) {
      results[0].rows[i].startdate = new Date(results[0].rows[i].startdate).toDateString();
      results[0].rows[i].enddate = new Date(results[0].rows[i].enddate).toDateString();
    }
    res.render('../views/CST/campaignlist', {
      campaignlist: results[0].rows
    });
  });
}


exports.getMasterCampaignData = function (req, res, id) {

  var cmpaignId = id;
  console.log("campaign ID is " + cmpaignId);
  async.parallel([
    function (callback) {
      redshift.query(select.distinct('apps.businessgroups.businessgroupname', 'apps.businessgroups.businessgroupid').from('apps.businessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsbusinessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams(), callback)
    },
    function (callback) {
      redshift.query(mcaselect.distinct('apps.mcasegments.mcasegmentname', 'apps.mcasegments.mcasegmentid').from('apps.mcasegments').where($in('apps.mastercampaignsmcasegments.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsmcasegments').on('apps.mastercampaignsmcasegments.mcasegmentid', 'apps.mcasegments.mcasegmentid').toParams(), callback)
    },
    function (callback) {
      redshift.query(businesstypeselect.distinct('apps.businesstype.businesstypename', 'apps.businesstype.businesstypeid').from('apps.businesstype').where($in('apps.mastercampaignsbusinesstype.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsbusinesstype').on('apps.mastercampaignsbusinesstype.businesstypeid', 'apps.businesstype.businesstypeid').toParams(), callback)
    },
    function (callback) {
      redshift.query(programFamilySelect.distinct('apps.programfamilies.programfamiliyname', 'apps.programfamilies.programfamiliyid').from('apps.programfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', cmpaignId)).innerJoin('apps.mastercampaignsprogramfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams(), callback)
    },
    function (callback) {
      redshift.query(mastercampaign.select('apps.mastercampaigns.mastercampaignid', 'apps.mastercampaigns.campaignmanager', 'apps.mastercampaigns.campaigndescription', 'apps.mastercampaigns.mastercampaignname', 'apps.mastercampaigns.startdate', 'apps.mastercampaigns.enddate').from('apps.mastercampaigns').where($in('apps.mastercampaigns.mastercampaignid', cmpaignId)).toParams(), callback)
    },

  ], function (err, results) {
    var star = results[4].rows[0].startdate;
    var fordate = date.format(star, 'YYYY-MM-DD');
    console.log('formatted date ', fordate);
    var end = results[4].rows[0].enddate;
    var enddate = date.format(end, 'YYYY-MM-DD');
    console.log('formatted date ', enddate);
    res.render('../views/CST/saveDrafrhandler', {
      businessgroups: results[0].rows,
      mcasegment: results[1].rows,
      businessType: results[2].rows,
      programFamilies: results[3].rows,
      mastercampaign: results[4].rows,
      startDate: fordate,
      endDate: enddate
    });
  });
}