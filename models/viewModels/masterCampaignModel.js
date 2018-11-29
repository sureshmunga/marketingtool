var redshift = require('../../redshift');
var async = require("async");
var moment = require('moment');
var mastercampaign = redshift.import('./models/mastercampaign.js');
var date = require('date-and-time');
var mcasegment = redshift.import('./models/mcasegment.js');
var programfamilies = redshift.import('./models/programfamilies.js');
var businessgroup = redshift.import('./models/businessgroup.js');
var businesstype = redshift.import('./models/businesstype.js');
var utilhelpers = require("../utilhelper.js");

module.exports.getCampaign = function (req, res) {
  async.parallel([
    function (callback) {
      redshift.query('SELECT mcasegmentid,mcasegmentname FROM apps."mcasegments" where isactive=1', callback);
    },
    function (callback) {
      redshift.query('SELECT businessgroupid, businessgroupname  FROM apps."businessgroups" where isactive=1', callback);
    },
    function (callback) {
      redshift.query('SELECT businesstypeid,businesstypename  FROM apps."businesstype" where isactive=1', callback);
    },
    function (callback) {
      redshift.query('SELECT programfamiliyid,programfamiliyname  FROM apps."programfamilies" where isactive=1', callback);
    }

  ], function (err, results) {
    res.render('../views/CST/mastercampaign', {
      mcasegment: results[0].rows,
      businessgroups: results[1].rows,
      businessType: results[2].rows,
      programFamilies: results[3].rows
    });
  });
};


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
      var ed = new Date(results[0].rows[i].enddate);
      results[0].rows[i].startdate = sd.getMonth() + '-' + sd.getDate() + '-' + sd.getFullYear();
      results[0].rows[i].enddate = ed.getMonth() + '-' + ed.getDate() + '-' + ed.getFullYear();
    }
    res.render('../views/CST/campaignlist', {
      campaignlist: results[0].rows
    });
  });
};


module.exports.getCampaignbyId = function (req, res, id) {
  var cmpaignId = id;
  var programFamily = "select a.programfamiliyname,b.programfamilyid,a.programfamiliyid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect " +
    " FROM apps.programfamilies a LEFT JOIN apps.mastercampaignsprogramfamilies b" +
    " on a.programfamiliyid = b.programfamilyid" +
    " and mastercampaignid =" + cmpaignId + "";

  var businessGroup = "select a.businessgroupname,b.businessgroupid,a.businessgroupid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.businessgroups a LEFT JOIN apps.mastercampaignsbusinessgroups b" +
    "  on a.businessgroupid = b.businessgroupid" +
    "  and mastercampaignid =" + cmpaignId + "";

  var businessType = "select a.businesstypename,b.businesstypeid,a.businesstypeid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.businesstype a LEFT JOIN apps.mastercampaignsbusinesstype b" +
    "  on a.businesstypeid = b.businesstypeid" +
    "  and mastercampaignid =" + cmpaignId + "";

  var mcaSegment = "select a.mcasegmentname,b.mcasegmentid,a.mcasegmentid,(CASE WHEN b.mastercampaignid is null THEN FALSE ELSE TRUE END) AS isselect FROM apps.mcasegments a LEFT JOIN apps.mastercampaignsmcasegments b" +
    "  on a.mcasegmentid = b.mcasegmentid" +
    "  and mastercampaignid =" + cmpaignId + "";

  var SQLQuery = "SELECT a.mastercampaignid,a.mastercampaignname,a.campaignmanager,a.campaigndescription," +
    " a.startdate,a.enddate,a.mcampaigndigitalid, a.status, a.createdby " +
    " FROM apps.mastercampaigns a where a.mastercampaignid =" + cmpaignId + "";
    console.log(SQLQuery);
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
      redshift.query(SQLQuery, callback);
    },

  ], function (err, results) {
    if (err) res.render('../views/error/custormerror', {
      message: err
    });
    
    results[4].rows[0].startdate = moment(results[4].rows[0].startdate).format('YYYY-MM-DD');
    results[4].rows[0].enddate = moment(results[4].rows[0].enddate).format('YYYY-MM-DD');
    console.log(results[4].rows[0].startdate);
    res.render('../views/CST/mastercampaign', {
      businessgroups: results[0].rows,
      mcasegment: results[1].rows,
      businessType: results[2].rows,
      programFamilies: results[3].rows,
      mastercampaign: results[4].rows[0]
    });
  });
};

module.exports.campaignsave = function (data, res, callback) {
  //console.log('print 2 ' +JSON.stringify(data));
  var campaigndata = {
    mastercampaignname: data.mastercampaignname,
    campaignmanager: data.campaignmanager,
    campaigndescription: data.campaigndescription,
    startdate : data.startdate,
    enddate: data.enddate,
    status: data.status
  };
  
  if (data.mastercampaignid == "" || data.mastercampaignid == "/") {
    campaigndata.createdby = data.user;
    campaigndata.createddate = moment().format("YYYY-MM-DD");
    console.log(JSON.stringify(campaigndata));
    mastercampaign.create(campaigndata, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var SQLStatement = "SELECT ISNULL(Max(mastercampaignid),0) as campaignid from apps.mastercampaigns where createdby='" + data.user + "'";
        redshift.query(SQLStatement, function (err, scopeId) {
          if (err) {
            console.log('campaign id error is' + err);
          } else {
            data.mastercampaignid = scopeId.rows[0].campaignid;
            campaignmcasegment(data).then((response) => {
              campaignbusinessgroup(data).then((bgresponse) => {
                campaignbutinesstype(data).then((btresponse) => {
                  campaignprogramfamilites(data).then((pfresponse) => {
                    return callback({
                      messagae: "Saved Successfully",
                      status: true,
                      data: data
                    });
                  }).catch((err) => {
                    throw err;
                  });
                }).catch((err1) => {
                  throw err1;
                });
              }).catch((err2) => {
                throw err2;
              });
            }).catch((err3) => {
              return callback({
                messagae: err3,
                status: false
              });
            });
          }
        });
      }
    });
  } else {
    var SQLUpdate = "update apps.mastercampaigns set mastercampaignname='" + data.mastercampaignname + "'" +
      " , campaigndescription='" + data.campaigndescription + "'" +
      " , status='" + data.status + "'" +
      " , startdate='" + data.startdate + "'" +
      " , enddate='" + data.enddate + "'" +
      " , campaignmanager='" + data.campaignmanager + "'" +
      " , updatedby='" + data.user + "'" +
      " , updateddate='" + moment().format("YYYY-MM-DD") + "'" +
      "   where mastercampaignid =" + data.mastercampaignid;
    redshift.query(SQLUpdate, function (err) {
      if (err) console.log('while updating tactic error throws : ' + err);
      else {
        campaignmcasegment(data, callback);
        return;
      }
    });
  }

};

function campaignmcasegment(data, callback) {
  return new Promise(function (resolve, reject) {
    var mdigitalid = 'M' + utilhelpers.getDID(data.mastercampaignid);
    var sqldid = "update apps.mastercampaigns set mcampaigndigitalid='" + mdigitalid + "' where mastercampaignid=" + data.mastercampaignid;
    console.log(sqldid);
    redshift.query(sqldid, function (err) {
      if (err) console.log('while updating tcampaigndigital id error throws : ' + err);
    });
    var SQLMapping = 'delete from apps.mastercampaignsmcasegments where mastercampaignid=' + data.mastercampaignid;
    redshift.query(SQLMapping, function (err, scopeId) {
      if (err) {
        console.log('SQLMapping error is ' + err);
      } else {
        for (var i = 0; i < data.mcasegment.length; i++) {
          var campaignmcasegmentvalue = {
            mastercampaignid: data.mastercampaignid,
            mcasegmentid: data.mcasegment[i]
          };
          mcasegment.create(campaignmcasegmentvalue, function (err, result) {
            resolve(result);
          });
        }
      }
    });
  });
}

function campaignbusinessgroup(data, callback) {
  return new Promise(function (resolve, reject) {
    var SQLMapping = 'delete from apps.mastercampaignsbusinessgroups where mastercampaignid=' + data.mastercampaignid;
    redshift.query(SQLMapping, function (err, scopeId) {
      if (err) {
        console.log('campaign id error is' + err);
      } else {
        for (var i = 0; i < data.BusinessGroup.length; i++) {
          var campaignvalue = {
            mastercampaignid: data.mastercampaignid,
            businessgroupid: data.BusinessGroup[i]
          };
          businessgroup.create(campaignvalue, function (erro, result) {
            resolve(result);
          });
        }
      }
    });
  });
}

function campaignbutinesstype(data, callback) {
  return new Promise(function (resolve, reject) {
    var SQLMapping = 'delete from apps.mastercampaignsbusinesstype where mastercampaignid=' + data.mastercampaignid;
    redshift.query(SQLMapping, function (err, scopeId) {
      if (err) {
        console.log('campaign id error is' + err);
      } else {
        for (var i = 0; i < data.BusinessType.length; i++) {
          var campaignvalue = {
            mastercampaignid: data.mastercampaignid,
            businesstypeid: data.BusinessType[i]
          };
          businesstype.create(campaignvalue, function (err, result) {
            resolve(result);
          });
        }
      }
    });
  });
}

function campaignprogramfamilites(data, callback) {
  return new Promise(function (resolve, reject) {
    var SQLMapping = 'delete from apps.mastercampaignsprogramfamilies where mastercampaignid=' + data.mastercampaignid;
    redshift.query(SQLMapping, function (err, scopeId) {
      if (err) {
        console.log('campaign id error is' + err);
      } else {
        for (var i = 0; i < data.ProgramFamilies.length; i++) {
          var campaignvalue = {
            mastercampaignid: data.mastercampaignid,
            programfamilyid: data.ProgramFamilies[i]
          };
          programfamilies.create(campaignvalue, function (err, result) {
            resolve(result);
          });
        }
      }
    });
  });
}