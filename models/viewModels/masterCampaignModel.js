var redshift = require('../../redshift');
var async = require("async");
var moment = require('moment');
var sql = require('sql-bricks-sqlite');

var mastercampaign = sql.select(),
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
      redshift.query(SQLQuery, callback);
      //console.log("callback result is" + callback);
    }
  ], function (err, results) {
    for (var i = 0; i < results[0].rows.length; i++) {
      var sd = new Date(results[0].rows[i].startdate);   
      var ed =   new Date(results[0].rows[i].enddate);
      results[0].rows[i].startdate = sd.getMonth() + '-' +sd.getDate() + '-'+ sd.getFullYear();
      results[0].rows[i].enddate = ed.getMonth() + '-' + ed.getDate() + '-'+ ed.getFullYear();
    }
    res.render('../views/CST/campaignlist', {
      campaignlist: results[0].rows
    });
  });
}


module.exports.getCampaignbyId = function (req, res, id) {
  var cmpaignId = id;
  var programFamily = "select a.programfamiliyname,b.programfamilyid,a.programfamiliyid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.programfamilies a LEFT JOIN apps.mastercampaignsprogramfamilies b" +
    "  on a.programfamiliyid = b.programfamilyid" +
    "  and mastercampaignid =" + cmpaignId + "";

  var businessGroup = "select a.businessgroupname,b.businessgroupid,a.businessgroupid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.businessgroups a LEFT JOIN apps.mastercampaignsbusinessgroups b" +
    "  on a.businessgroupid = b.businessgroupid" +
    "  and mastercampaignid =" + cmpaignId + "";
  console.log(JSON.stringify(businessGroup));
  

  var businessType = "select a.businesstypename,b.businesstypeid,a.businesstypeid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.businesstype a LEFT JOIN apps.mastercampaignsbusinesstype b" +
    "  on a.businesstypeid = b.businesstypeid" +
    "  and mastercampaignid =" + cmpaignId + "";

  var mcaSegment = "select a.mcasegmentname,b.mcasegmentid,a.mcasegmentid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.mcasegments a LEFT JOIN apps.mastercampaignsmcasegments b" +
    "  on a.mcasegmentid = b.mcasegmentid" +
    "  and mastercampaignid =" + cmpaignId + "";

  async.parallel([
    function (callback) {
      redshift.query(businessGroup, callback);
    },
    function (callback) {
      redshift.query(mcaSegment, callback);
    },
    function (callback) {
      redshift.query(businessType, callback);
    },
    function (callback) {
      redshift.query(programFamily, callback);
    },
    function (callback) {
      redshift.query(mastercampaign.select('apps.mastercampaigns.mastercampaignid', 'apps.mastercampaigns.campaignmanager', 'apps.mastercampaigns.campaigndescription', 'apps.mastercampaigns.mastercampaignname', 'apps.mastercampaigns.startdate', 'apps.mastercampaigns.enddate').from('apps.mastercampaigns').where($in('apps.mastercampaigns.mastercampaignid', cmpaignId)).toParams(), callback)
    },

  ], function (err, results) {
    var star = results[4].rows[0].startdate;
    var fordate = date.format(star, 'YYYY-MM-DD');
    var end = results[4].rows[0].enddate;
    var enddate = date.format(end, 'YYYY-MM-DD');
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