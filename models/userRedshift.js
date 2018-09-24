
var bcrypt = require('bcryptjs');

var redshift = require('../redshift.js');

var person = redshift.import("./models/login.js");

var businesstype = redshift.import("./models/businesstype.js");

var businessgroup = redshift.import("./models/businessgroup.js");
//console.log(person);

var mcasegments = redshift.import("./models/mcasegment.js");

var programfamilies = redshift.import("./models/programfamilies.js");

var dom = require('dom-util');

//var mcaid = require('../models/viewModels/asterCampaignModel');

var mastercampaign = redshift.import('./models/mastercampaign.js');
var subcampaignTab = redshift.import('./models/programme.js');

var sql = require('sql-bricks-sqlite');



var sql1 = require('sql-bricks-postgres');



//var select = require('sql-bricks').select;

var select = sql.select, $in = sql.in;



var bgroupNamins = require('../models/businessgroupnameinsertion');


console.log('new');

var moment = require('moment');
var utilhelpers = require('../models/utilHelpers');

var date = new Date();

var secbusinessgroup = redshift.import("./models/secondarybusinessgroup.js");
var secbusinesstype = redshift.import("./models/secondarybusinesstype.js");
var programsmarket = redshift.import("./models/markets.js");
var programssecbusinesslines = redshift.import("./models/secbusinessline.js");





//person.create({username: 'Suresh Munga', password: 'mp123',  email: 'suresh@email.com', name: 'Suresh'}, function(err, data){
//   if(err) throw err;
//   else{
//     console.log(data);
//   }
//});





module.exports.createUser = function (newUser, res, callback) {
  console.log('inside create user');
  bcrypt.genSalt(10, function (err, salt) {
    console.log("salt is" + salt);
    if (err) return err;
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) return err
      console.log("hashed password is " + hash);
      newUser.password = hash;
      person.create({
        username: newUser.username, password: newUser.password,
        email: newUser.email, name: newUser.name
      }, function (err, data) {
        if (err) {
          console.log("errors is " + err);
          res.send("<h1>" + err + "<h1>")
          return err;
        }
        else {
          console.log("data is " + data);
        }
      });
    });
  });
}

//console.log('User Created');

//module.exports.getUserByUsername = function(username, callback){
//	var query = {username: username};
//	person.findOne(query, callback);
//}

module.exports.getUserByUsername = function (username, callback) {
  redshift.parameterizedQuery('SELECT username FROM stage."login" WHERE "username" = $1', [username], { raw: true }, function (err, data) {
    if (err) return err;
    userlength = data.length;
    callback(null, userlength);
    //  console.log(data);
    //if(!data.length) {
    //  return done(null, false, req.flash('loginMessage', 'No user found.') );
    // }
  });
  //	User.findOne(query, callback);
  //console.log(query);
  //console.log(username);
}


module.exports.getUserById = function (id, callback) {
  Username.findById(id, callback);
}

module.exports.comparePassword = function (username, candidatePassword, hash, callback) {
  redshift.parameterizedQuery('SELECT * FROM stage."login" WHERE "username" = $1', [username], { raw: true }, function (err, rows) {
    if (err) return err;
    console.log(candidatePassword);
    console.log(rows);
    console.log(rows[0].password);
    hash = rows[0].password;

    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
      if (err) throw err;
      callback(null, isMatch);
    });
    // Store hash in database


  });

  //  console.log(hash);

}



module.exports.getUserByUsername = function (username, callback) {
  redshift.parameterizedQuery('SELECT username FROM stage."login" WHERE "username" = $1', [username], { raw: true }, function (err, data) {
    if (err) return err;
    userlength = data.length;
    callback(null, userlength);
    console.log("ss" + data)
    //  console.log(data);
    //if(!data.length) {
    //  return done(null, false, req.flash('loginMessage', 'No user found.') );
    // }
  });
  //	User.findOne(query, callback);
  //console.log(query);
  //console.log(username);
}


module.exports.getUserById = function (id, callback) {
  Username.findById(id, callback);
}

module.exports.createBusinessType = function (mastercampaignid, businesstypeid, programfamilyid, clientid, callback) {
  console.log('in create business type');
  redshift.parameterizedQuery("INSERT INTO apps.mastercampaignsbusinesstype(mastercampaignid,businesstypeid,clientid) VALUES ('" + mastercampaignid + "','" + businesstypeid + "','" + clientid + "')"), { raw: true }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      /* redshift.parameterizedQuery("INSERT INTO apps.mastercampaignsprogramfamilies(mastercampaignid,programfamilyid,clientid) VALUES ('"+mastercampaignid+"','"+programfamilyid+"','"+clientid+"')"), { raw: true }, function (err, rows) {
        if(err){
          console.log('error in inserting');
        }else{
          console.log('inserted succesfully');
        }
     */
      console.log("inserted succesfully" + data);
    }

  }  //  console.log(hash);

}


module.exports.createBusinessGroup = function (mastercampaignid, businessgroupid, clientid, callback) {
  console.log('in create business group');
  redshift.parameterizedQuery("INSERT INTO apps.mastercampaignsbusinessgroups(mastercampaignid,businessgroupid,clientid) VALUES ('" + mastercampaignid + "','" + businessgroupid + "','" + clientid + "')"), { raw: true }, function (err, rows) {
    if (err) return err;


  }  //  console.log(hash);

}

module.exports.createMcaSegment = function (mastercampaignid, mcasegmentid, clientid, callback) {
  console.log('in create mca segment');
  redshift.parameterizedQuery("INSERT INTO apps.mastercampaignsmcasegments(mastercampaignid,businesstypeid,clientid) VALUES ('" + mastercampaignid + "','" + mcasegmentid + "','" + clientid + "')"), { raw: true }, function (err, rows) {
    if (err) return err;


  }  //  console.log(hash);

}

module.exports.createprogramFamilies = function (mastercampaignid, programfamilyid, clientid, callback) {
  console.log('in create program families');
  redshift.parameterizedQuery("INSERT INTO apps.mastercampaignsprogramfamilies(mastercampaignid,businesstypeid,clientid) VALUES ('" + mastercampaignid + "','" + businesstypeid + "','" + clientid + "')"), { raw: true }, function (err, rows) {
    if (err) return err;


  }  //  console.log(hash);

}


module.exports.createMasterCampaignData = function (newBuss, res, callback) {
  console.log('inside create user' + [newBuss.businessgroupname]);
  const group = newBuss.businessgroupname;
  var username1 = ['Fixed Networks', 'Global Services'];
  var segNames1 = newBuss.mcasegmentname;
  const segName = "" + segNames1 + ""
  console.log('segName' + segName);
  const btypeName = newBuss.businesstypename;
  const bName = "" + btypeName + ""
  console.log('business type name is with' + bName);
  var PFamilyName = newBuss.programfamilyname;
  var PName = "" + PFamilyName + "";
  console.log('program family name is' + PName);
  console.log("sdfsafsafsadf" + newBuss.startdate);
  console.log("sdfsafsafsadf" + newBuss.mcadigitalid);


  //var masterdigitalid = 'M'+ utilhelpers.getDID(tacticid);
  var date = new Date();

  var mastercampaignId;


  var SQLStatement = "SELECT ISNULL(Max(mastercampaignid),0) as mastercampaignid from apps.mastercampaigns where createdby='" + newBuss.createdby + "'";
  redshift.query(SQLStatement, function (err, scopeId) {

    if (err) {
      console.log('tactic id error is' + err);
    } else {
      console.log('tactic id ' + JSON.stringify(scopeId.rows[0].mastercampaignid));
      mastercampaignId = scopeId.rows[0].mastercampaignid;
    }
    var masterdigitalid = 'M' + utilhelpers.getDID(mastercampaignId);
    var namconventionn = newBuss.namingConvention + '-' + masterdigitalid;
    mastercampaign.create({
      mastercampaignname: newBuss.campaignName, campaigndescription: newBuss.Campaigndescriptiongoals,
      campaignmanager: newBuss.Campaignmanager, status: newBuss.status, startdate: newBuss.startdate, enddate: newBuss.enddate,
      namingconvention: namconventionn, mcampaigndigitalid: masterdigitalid, createdby: newBuss.createdby, createddate: date
    }, function (err, data) {
      if (err) {
        console.log("error is" + err);
      } else {
        console.log("campaign manager inserted succesfully" + JSON.stringify(data));
        redshift.query('select max(mastercampaignid)  from apps."mastercampaigns"', function (err, data) {
          if (err) {
            console.log('master campaign id error is' + err);
          } else {
            console.log("master camapign id is " + JSON.stringify(data.rows[0].max));
            mastercampaignId111 = JSON.stringify(data.rows[0].max);

            SaveDraftMcaSegments(newBuss,mastercampaignId111).then(function(mcass){
              saveDraftBusinessGroups(newBuss,mastercampaignId111).then(function(bussgg){
                saveDraftBusinessTypes(newBuss,mastercampaignId111).then(function(bustypess){
                  saveDraftProgramfamilies(newBuss,mastercampaignId111).then(function(pfamilies){
                    console.log('saveddddd draft' + JSON.stringify(pfamilies));

                  })
                })
              })
            })  
            // var busgrpName = "" + newBuss.businessgroupname + "";
            // console.log("Business Group Name is" + busgrpName);
            // if (busgrpName.includes(',')) {
            //   var bssgroupArray = busgrpName.split(',');
            //   var bGroupName;
            //   for (var i = 0; i < bssgroupArray.length; i++) {
            //     bGroupNames = bssgroupArray[i];
            //     bGroupName = bGroupNames;
            //     console.log("Businedd Group Name is" + bGroupName);
            //     bgroupNamins.businessGroupIns(bGroupName, newBuss, mastercampaignId111);
            //   }
            // }
            // else {
            //   bgroupNamins.businessGroupIns(busgrpName, newBuss, mastercampaignId111);
            // }
            // if (bName.includes(',')) {
            //   console.log("inside business if condition");
            //   var bNameArray = bName.split(',');
            //   var bTypeN;
            //   for (var i = 0; i < bNameArray.length; i++) {
            //     bTypeNames = bNameArray[i];
            //     bTypeN = bTypeNames;
            //     console.log("businesstype Name is" + bTypeN);
            //     bgroupNamins.businessTypeIns(bTypeN, newBuss, mastercampaignId111);
            //   }
            // }
            // else {
            //   bgroupNamins.businessTypeIns(bName, newBuss, mastercampaignId111);
            // }
            // if (segName.includes(',')) {
            //   var segNameArray = segName.split(',');
            //   for (var i = 0; i < segNameArray.length; i++) {
            //     segNames = segNameArray[i];
            //     segN = segNames;
            //     bgroupNamins.mcaSegmentInsertion(segN, newBuss, mastercampaignId111)
            //   }
            // } else {
            //   bgroupNamins.mcaSegmentInsertion(segName, newBuss, mastercampaignId111);
            // }
            // if (PName.includes(',')) {
            //   console.log("inside program families if condition");
            //   var PNamearray = PName.split(',');
            //   var PnameF;
            //   for (var i = 0; i < PNamearray.length; i++) {
            //     PfamilyNames = PNamearray[i];
            //     PnameF = PfamilyNames;
            //     console.log("program Name is" + PnameF);
            //     bgroupNamins.programFamilyIns(PnameF, newBuss, mastercampaignId111);
            //   }
            // }
            // else {
            //   bgroupNamins.programFamilyIns(PName, newBuss, mastercampaignId111);
            // }

            /* redshift.parameterizedQuery('SELECT programfamiliyid FROM apps."programfamilies" WHERE "programfamiliyname" = $1', [newBuss.programfamilyname], { raw: true }, function (err, res) {
              if (err) {
  
              } else {
                console.log("programfamiliyname is " + JSON.stringify(res));
                var programfamiliyname = res;
                console.log('programfamiliyname id is' + programfamiliyname[0].programfamiliyid);
                programfamilies.create({
                  mastercampaignid: mastercampaignId, programfamilyid: newBuss.programfamilyid,
                  clientid: newBuss.clientid
                }, function (err, data) {
                  if (err) {
                    console.log("errors business data is " + err);
                    //.send("<h1>" + err + "<h1>")
  
                    return err;
                  }
                  else {
                    console.log("programfamily data is " + JSON.stringify(data));
  
                  }
                });
              }
  
            }); */
          }
        });
      }
    });
  })
}

module.exports.createSubcampaign = function (subcampaign, res, callback) {
  console.log('insideSUbcampaign' + [subcampaign.totalbudget]);
  var programID;
  var SQLStatement = "SELECT ISNULL(Max(programid),0) as programid from apps.programs";
  redshift.query(SQLStatement, function (err, scopeId) {
    if (err) {
      console.log('tactic id error is' + err);
    } else {
      console.log('tactic id ' + JSON.stringify(scopeId.rows[0].programid));
      programID11 = scopeId.rows[0].programid;
    }
    var pdigitalID = 'M' + utilhelpers.getDID(programID11);
    var namconventionn1 = subcampaign.namingConvention + '-' + pdigitalID;
    subcampaignTab.create({
      programname: subcampaign.programname, programdescription: subcampaign.programdescription,
      campaignmanager: subcampaign.campaignmanager, budget: subcampaign.totalbudget, spend: subcampaign.totalspend, status: subcampaign.status, startdate: subcampaign.startdate, enddate: subcampaign.enddate,
      programfamilyid: subcampaign.programfamilyid, mcasegmentid: subcampaign.mcasegmentid, businessgroupid: subcampaign.businessgroupid, businesslineid: subcampaign.businesslineid, businesstypeid: subcampaign.businesstypeid,
      industryid: subcampaign.industryid, mqlgoal: subcampaign.MQLG, mqllow: subcampaign.MQLL, mqlhigh: subcampaign.MQLH, mqlsource: subcampaign.MQLBM, salgoal: subcampaign.SALG, sallow: subcampaign.SALL, salhigh: subcampaign.SALH,
      salsource: subcampaign.SALB, pipelinegoal: subcampaign.TPLG, pipelinelow: subcampaign.TPLL, pipelinehigh: subcampaign.TPLH, pipelinesource: subcampaign.TPLB, namingconvention: namconventionn1, programdigitalid: pdigitalID,
      mastercampaignid: subcampaign.mastercampaignid, clientid: subcampaign.clientid, createdby: subcampaign.createdby, createddate: date
    }, function (err, data) {
      if (err) {
        console.log("error is inside subcampaign" + err);
      } else {
        console.log("programme inserted succesfully" + JSON.stringify(data));
        redshift.query('select max(programid)  from apps."programs"', function (err, data) {
          if (err) {
            console.log('programme id error is' + err);
          } else {
            console.log("program id is " + JSON.stringify(data.rows[0].max));
            programID = JSON.stringify(data.rows[0].max);

            var secbusgrpName = "" + subcampaign.secbusinesgroup + "";
            console.log("Sec Business Group Name is" + secbusgrpName);
            bgroupNamins.SecbusinessGroupIns(subcampaign.secbusinesgroup, subcampaign, programID);
            bgroupNamins.secbusinessTypeIns(subcampaign.businesstypeid, subcampaign, programID);
            //bgroupNamins.marketIns(MarketTypeN, subcampaign, programID);
            var prMarket = "" + subcampaign.marketname + "";
            console.log("program market Name is" + prMarket);
            if (prMarket.includes(',')) {
              console.log("inside program market if condition");
              var PmarketArray = prMarket.split(',');
              var MarketTypeN;
              for (var i = 0; i < PmarketArray.length; i++) {
                MarketTypeNames = PmarketArray[i];
                MarketTypeN = MarketTypeNames;
                console.log("MarketType Name is" + MarketTypeN);
                bgroupNamins.marketIns(MarketTypeN, subcampaign, programID);
              }
            }
            else {
              bgroupNamins.marketIns(prMarket, subcampaign, programID);
            }

            var secBusinessLines = "" + subcampaign.secbusinessline + "";
            console.log("secBusinessLines are" + secBusinessLines);
            bgroupNamins.programssecbusinesslines(subcampaign.secbusinessline, subcampaign, programID);
            // if (secBusinessLines.includes(',')) {
            //   console.log("inside secBusinessLines if condition");
            //   var secBusinessArray = secBusinessLines.split(',');
            //   var SecBUsinessLine;
            //   for (var i = 0; i < secBusinessArray.length; i++) {
            //     SecBUsiinessLineNames = secBusinessArray[i];
            //     SecBUsinessLine = SecBUsiinessLineNames;
            //     console.log("SecBUsinessLine Name is" + SecBUsinessLine);
            //     bgroupNamins.programssecbusinesslines(SecBUsinessLine, subcampaign, programID);
            //   }
            // }
            // else {
            //   bgroupNamins.programssecbusinesslines(secBusinessLines, subcampaign, programID);
            // }

          }
        });
      }
    });
  })
}


module.exports.updateMasterCampaignData = function (data, res, callback) {
  return new Promise(function (resolve, reject) {



    var SQLStatement = "SELECT ISNULL(Max(mastercampaignid),0) as mastercampaignid from apps.mastercampaigns where createdby='" + data.createdby + "'";
    redshift.query(SQLStatement, function (err, scopeId) {
      if (err) {
        console.log('tactic id error is' + err);
      } else {
        console.log('tactic id ' + JSON.stringify(scopeId.rows[0].mastercampaignid));
        mastercampaignId = scopeId.rows[0].mastercampaignid;
      }
      var masterdigitalid = 'M' + utilhelpers.getDID(data.CampaignId);
      var namconventionn = data.namingconvention + '-' + masterdigitalid;

      var sqlUpdate = "update apps.mastercampaigns set mastercampaignname='" + data.CampaignName + "'"
        + " , campaigndescription='" + data.CampaignDescription + "'"
        + " , campaignmanager='" + data.CampaignManager + "'"
        + " , startdate='" + data.StartDate + "'"
        + " , enddate='" + data.EndDate + "'"
        + " , status='" + data.Status + "'"
        + " , isactive = '1'"
        + " , updatedby='" + data.user + "'"
        + " , updateddate='" + moment().format("YYYY-MM-DD") + "'"
        + " , namingconvention='" + namconventionn + "'"
        + " , mcampaigndigitalid='" + masterdigitalid + "'"
        + " where mastercampaignid =" + data.CampaignId;

      console.log(JSON.stringify(sqlUpdate));
      redshift.query(sqlUpdate, function (err) {
        if (err) console.log('while updating tactic error throws : ' + err);
        else {
          updateMcaSegments(data.CampaignId, data).then(function (segmentdata) {
            updateProgramfamilies(data.CampaignId, data).then(function (programdata) {
              updateBusinessTypes(data.CampaignId, data).then(function (busiessdata) {
                updateBusinessGroups(data.CampaignId, data).then(function (businessgroupdata) {

                  console.log('busiessgroup data is ' + businessgroupdata);
                  resolve(businessgroupdata)
                  //return;
                });
              })
            })
          });
          // return;
        }
      });
    })
  })
}



function updateMcaSegments(campaignID, data) {
  return new Promise(function (resolve, reject) {
    var sqlsegments = 'delete from apps.mastercampaignsmcasegments where mastercampaignid=' + campaignID;
    console.log(sqlsegments);
    redshift.query(sqlsegments, function (err, scopeId) {
      if (err) {
        console.log('tactic id error is' + err);
      } else {
        var mcaSegmentId = [];
        mcaSegmentId = data.mcaSegmentId;
        for (var i = 0; i < mcaSegmentId.length; i++) {
          var mcaSegmentValue = {
            mastercampaignid: campaignID,
            mcasegmentid: mcaSegmentId[i],
            clientid: '1',
            updatedby: data.user,
            updateddate: date
          };
          mcasegments.create(mcaSegmentValue, function (err, res) {
            if (err) {
              console.log("Insertion Error while inserting in mca segments table " + err);
            } else {
              console.log("MCA segments inserted successfully " + res);
              resolve(res);

            }
          });
        }

        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  });
}

function updateProgramfamilies(campaignID, data) {
  return new Promise(function (resolve, reject) {


    var sqlprogramfamilies = 'delete from apps.mastercampaignsprogramfamilies where mastercampaignid=' + campaignID;
    console.log(sqlprogramfamilies);
    redshift.query(sqlprogramfamilies, function (err, scopeId) {
      if (err) {
        console.log('sqlprogramfamilies id error is' + err);
      } else {
        var programfamilyId = [];
        programfamilyId = data.programFamiliesID;
        for (var i = 0; i < programfamilyId.length; i++) {
          var programFamilyValue = {
            mastercampaignid: campaignID,
            programfamilyid: programfamilyId[i],
            clientid: '1',
            updatedby: data.user,
            updateddate: date
          };
          programfamilies.create(programFamilyValue, function (err, programResp) {
            if (err) {
              console.log("Insertion Error while inserting in program family table " + err);
            } else {
              console.log("program families inserted successfully " + programResp);
              resolve(programResp);

            }
          });
        }

        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  })
}


function updateBusinessTypes(campaignID, data) {
  return new Promise(function (resolve, reject) {


    var sqlbusinesstypes = 'delete from apps.mastercampaignsbusinesstype where mastercampaignid=' + campaignID;
    console.log(sqlbusinesstypes);
    redshift.query(sqlbusinesstypes, function (err, scopeId) {
      if (err) {
        console.log('sqlbusinesstypes id error is' + err);
      } else {
        var businessTypeId = [];
        businessTypeId = data.businessTypeId;
        for (var i = 0; i < businessTypeId.length; i++) {
          var businesstypeValue = {
            mastercampaignid: campaignID,
            businesstypeid: businessTypeId[i],
            clientid: '1',
            updatedby: data.user,
            updateddate: date
          };
          businesstype.create(businesstypeValue, function (err, res) {
            if (err) {
              console.log("Insertion Error while inserting in business type table " + err);
            } else {
              console.log("business type succesfully " + res);
              resolve(res)

            }
          });
        }

        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  });
}


function updateBusinessGroups(campaignID, data) {
  return new Promise(function (resolve, reject) {


    var sqlbusinessGroups = 'delete from apps.mastercampaignsbusinessgroups where mastercampaignid=' + campaignID;
    console.log(sqlbusinessGroups);
    redshift.query(sqlbusinessGroups, function (err, scopeId) {
      if (err) {
        console.log('sqlbusinessGroups id error is' + err);
      } else {
        var businessGroupIds = [];
        businessGroupIds = data.businessGroupID;
        for (var i = 0; i < businessGroupIds.length; i++) {
          var businessGroupValue = {
            mastercampaignid: campaignID,
            businessgroupid: businessGroupIds[i],
            clientid: '1',
            updatedby: data.user,
            updateddate: date
          };
          businessgroup.create(businessGroupValue, function (err, res) {
            if (err) {
              console.log("Insertion Error while inserting in Business group " + err);
            } else {
              console.log("Business group inserted succesfuly " + res);
              resolve({ "messagae": "Saved Successfully", status: true, campaignid: campaignID });

            }
          });
        }

        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  })
}


module.exports.UpdateSubcampaign = function (subcampaign, res, callback) {
  return new Promise(function (resolve, reject) {


    console.log('inside update SUbcampaign' + JSON.stringify(subcampaign));
    var programID;
    var SQLStatement = "SELECT ISNULL(Max(programid),0) as programid from apps.programs";
    redshift.query(SQLStatement, function (err, scopeId) {
      if (err) {
        console.log('Program id upated error is' + err);
      } else {
        console.log('ProgramId IS ' + JSON.stringify(scopeId.rows[0].programid));
        programID11 = scopeId.rows[0].programid;
      }
      var pdigitalID = 'M' + utilhelpers.getDID(programID11);
      var namconventionn1 = subcampaign.namingConvention + '-' + pdigitalID;

      var sqlUpdate = "update apps.programs set programname='" + subcampaign.programname + "'"
        + " , programdescription='" + subcampaign.programdescription + "'"
        + " , campaignmanager='" + subcampaign.campaignmanager + "'"
        + " , startdate='" + subcampaign.startdate + "'"
        + " , enddate='" + subcampaign.enddate + "'"
        + " , status='" + subcampaign.status + "'"
        + " , isactive = '1'"
        + " , updatedby='" + subcampaign.updatedby + "'"
        + " , updateddate='" + moment().format("YYYY-MM-DD") + "'"
        + " , namingconvention='" + namconventionn1 + "'"
        + " , programdigitalid='" + pdigitalID + "'"
        + " , budget='" + subcampaign.totalbudget + "'"
        + " , spend='" + subcampaign.totalspend + "'"
        + " , programfamilyid='" + subcampaign.programfamilyid + "'"
        + " , mcasegmentid='" + subcampaign.mcasegmentid + "'"
        + " , businessgroupid='" + subcampaign.businessgroupid + "'"
        + " , businesslineid='" + subcampaign.businesslineid + "'"
        + " , businesstypeid='" + subcampaign.businesstypeid + "'"
        + " , industryid='" + subcampaign.industryid + "'"
        + " , mqlgoal='" + subcampaign.MQLG + "'"
        + " , mqllow='" + subcampaign.MQLL + "'"
        + " , mqlhigh='" + subcampaign.MQLH + "'"
        + " , mqlsource='" + subcampaign.MQLBM + "'"
        + " , salgoal='" + subcampaign.SALG + "'"
        + " , sallow='" + subcampaign.SALL + "'"
        + " , salhigh='" + subcampaign.SALH + "'"
        + " , salsource='" + subcampaign.SALB + "'"
        + " , pipelinegoal='" + subcampaign.TPLG + "'"
        + " , pipelinelow='" + subcampaign.TPLL + "'"
        + " , pipelinehigh='" + subcampaign.TPLH + "'"
        + " , pipelinesource='" + subcampaign.TPLB + "'"
        + " , mastercampaignid='" + subcampaign.mastercampaignid + "'"
        + " where programid =" + subcampaign.programId;
      redshift.query(sqlUpdate, function (err) {
        if (err) console.log('while updating subcampaign error throws : ' + err);
        else {
          console.log('updated subcampaign succesfully');
          updateSubBusinessGroups(subcampaign.programId, subcampaign).then(function (secBusinessGroupData) {
            updateSecBusinessBusinessLines(subcampaign.programId, subcampaign).then(function (secbusinessLinedata) {
              updateSecBusinessBusinessType(subcampaign.programId, subcampaign).then(function (secbusinessTypeData) {
                updateMarkets(subcampaign.programId, subcampaign).then(function (marketData) {
                  resolve({ "messagae": "Saved Successfully" });
                  res.render('../views/CST/programsavedraft');
                  console.log('updated sucessfully');
                })

              })

            })
          });
          // updateMcaSegments(data.CampaignId, data).then(function (segmentdata) {
          //   updateProgramfamilies(data.CampaignId, data).then(function (programdata) {
          //     updateBusinessTypes(data.CampaignId, data).then(function (busiessdata) {
          //       updateBusinessGroups(data.CampaignId, data).then(function (businessgroupdata) {

          //         console.log('busiessgroup data is ' + businessgroupdata);
          //         resolve(businessgroupdata)
          //         //return;
          //       });
          //     })
          //   })
          // });
          // return;
        }
      });

    })
  })
}


function updateSubBusinessGroups(programId, subcampaign) {
  return new Promise(function (resolve, reject) {


    var sqlbusinessGroups = 'delete from apps.programssecbusinessgroups where programid=' + programId;
    console.log(sqlbusinessGroups);
    redshift.query(sqlbusinessGroups, function (err, scopeId) {
      if (err) {
        console.log('sqlbusinessGroups id error is' + err);
      } else {
        var bGroupIns = subcampaign.secbusinesgroup;
        console.log("data is " + JSON.stringify(bGroupIns));
        for (i = 0; i < bGroupIns.length; i++) {
          var bGroupID = bGroupIns[i];
          console.log("bid is" + bGroupID);
          secbusinessgroup.create({
            programid: programId, businessgroupid: bGroupID,
            clientid: subcampaign.clientid, updatedby: subcampaign.updatedby, updateddate: date
          }, function (err, data) {
            if (err) {
              console.log("errors business group data is " + err);
              // data.send("<h1>" + err + "<h1>")
              return err;
            } else {
              console.log("updated sec business group succesfully" + programId);
              resolve(data);
            }
          });
        }
        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  })
}

function updateSecBusinessBusinessLines(programId, subcampaign) {
  return new Promise(function (resolve, reject) {


    var sqlbusinessLines = 'delete from apps.programssecbusinesslines where programid=' + programId;
    console.log(sqlbusinessLines);
    redshift.query(sqlbusinessLines, function (err, scopeId) {
      if (err) {
        console.log('sqlbusinessLines id error is' + err);
      } else {
        var bLine = subcampaign.secbusinessline;
        console.log("sec business line data is " + JSON.stringify(bLine));
        for (i = 0; i < bLine.length; i++) {
          var bLineId = bLine[i];
          console.log("Business Line ID is" + bLineId);
          programssecbusinesslines.create({
            programid: programId, businesslineid: bLineId,
            clientid: subcampaign.clientid, updatedby: subcampaign.updatedby, updateddate: date
          }, function (err, data) {
            if (err) {
              console.log("errors business type data is " + err);
              //data.send("<h1>" + err + "<h1>")
              return err;
            } else {
              console.log("updated sec business line succesfully" + bLineId);
              resolve(data);
            }
          });
        }
        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  })
}

function updateSecBusinessBusinessType(programId, subcampaign) {
  return new Promise(function (resolve, reject) {


    var sqlbusinessType = 'delete from apps.programssecbusinesstype where programid=' + programId;
    console.log(sqlbusinessType);
    redshift.query(sqlbusinessType, function (err, scopeId) {
      if (err) {
        console.log('sqlbusinessType id error is' + err);
      } else {
        var bTypeIns = subcampaign.secbusinesstype;
        console.log("sec business type data is " + JSON.stringify(bTypeIns));
        for (i = 0; i < bTypeIns.length; i++) {
          var bTypeID = bTypeIns[i];
          console.log("Business type ID is" + bTypeID);
          secbusinesstype.create({
            programid: programId, businesstypeid: bTypeID,
            clientid: subcampaign.clientid, updatedby: subcampaign.updatedby, updateddate: date
          }, function (err, data) {
            if (err) {
              console.log("errors business type data is " + err);
              //data.send("<h1>" + err + "<h1>")
              return err;
            } else {
              console.log("updated sec business type succesfully" + bTypeID);
              resolve(data);
            }
          });
        }
        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  })
}

function updateMarkets(programId, subcampaign) {
  return new Promise(function (resolve, reject) {


    var sqlProgramMarkets = 'delete from apps.programsmarket where programid=' + programId;
    console.log(sqlProgramMarkets);
    redshift.query(sqlProgramMarkets, function (err, scopeId) {
      if (err) {
        console.log('sqlProgramMarkets id error is' + err);
      } else {
        var MarketINS = subcampaign.marketname;
        //console.log("market data is " + JSON.stringify(MarketINS));
        for (i = 0; i < MarketINS.length; i++) {
          var MarketID = MarketINS[i];
          console.log("market ID is" + MarketID);
          programsmarket.create({
            programid: programId, marketid: MarketID,
            clientid: subcampaign.clientid, createdby: subcampaign.updatedby, createddate: date
          }, function (err, data) {
            if (err) {
              console.log("errors market insertion data is " + err);
              //data.send("<h1>" + err + "<h1>")
              return err;
            } else {
              console.log("updated market succesfully" + MarketID);
              resolve(data);
            }
          });
        }
        //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
      }
    });
  })
}





module.exports.createMasterCampaignSaveDraft = function (newBuss, res, callback) {
  console.log('inside create user' + [newBuss.businessgroupname]);
  const group = newBuss.businessgroupname;
  var username1 = ['Fixed Networks', 'Global Services'];
  var segNames1 = newBuss.mcasegmentname;
  const segName = "" + segNames1 + ""
  console.log('segName' + segName);
  const btypeName = newBuss.businesstypename;
  const bName = "" + btypeName + ""
  console.log('business type name is with' + bName);
  var PFamilyName = newBuss.programfamilyname;
  var PName = "" + PFamilyName + "";
  console.log('program family name is' + PName);
  console.log("sdfsafsafsadf" + newBuss.startdate);
  console.log("sdfsafsafsadf" + newBuss.mcadigitalid);

  //var masterdigitalid = 'M'+ utilhelpers.getDID(tacticid);
  var date = new Date();

  var mastercampaignId;


  var SQLStatement = "SELECT ISNULL(Max(mastercampaignid),0) as mastercampaignid from apps.mastercampaigns where createdby='" + newBuss.user + "'";
  redshift.query(SQLStatement, function (err, scopeId) {

    if (err) {
      console.log('tactic id error is' + err);
    } else {
      console.log('tactic id ' + JSON.stringify(scopeId.rows[0].mastercampaignid));
      mastercampaignId = scopeId.rows[0].mastercampaignid;
    }
    var masterdigitalid = 'M' + utilhelpers.getDID(mastercampaignId);
    var namconventionn = newBuss.namingconvention + '-' + masterdigitalid;
    mastercampaign.create({
      mastercampaignname: newBuss.CampaignName, campaigndescription: newBuss.CampaignDescription,
      campaignmanager: newBuss.CampaignManager, status: newBuss.Status, startdate: newBuss.StartDate, enddate: newBuss.EndDate,
      namingconvention: namconventionn, mcampaigndigitalid: masterdigitalid, createdby: newBuss.user, createddate: date
    }, function (err, data) {
      if (err) {
        console.log("error is" + err);
      } else {
        console.log("campaign manager inserted succesfully" + JSON.stringify(data));
        redshift.query('select max(mastercampaignid)  from apps."mastercampaigns"', function (err, data) {
          if (err) {
            console.log('master campaign id error is' + err);
          } else {
            console.log("master camapign id is " + JSON.stringify(data.rows[0].max));
            mastercampaignId111 = JSON.stringify(data.rows[0].max);


            // var busgrpName = "" + newBuss.businessgroupname + "";
            // bgroupNamins.businessGroupIns(bGroupName, newBuss, mastercampaignId111);
            // console.log("Business Group Name is" + busgrpName);
            // bgroupNamins.businessTypeIns(bTypeN, newBuss, mastercampaignId111);
            // bgroupNamins.mcaSegmentInsertion(segN, newBuss, mastercampaignId111)
            // bgroupNamins.programFamilyIns(PnameF, newBuss, mastercampaignId111);

            SaveDraftMcaSegments(newBuss,mastercampaignId111).then(function(mcass){
              saveDraftBusinessGroups(newBuss,mastercampaignId111).then(function(bussgg){
                saveDraftBusinessTypes(newBuss,mastercampaignId111).then(function(bustypess){
                  saveDraftProgramfamilies(newBuss,mastercampaignId111).then(function(pfamilies){
                    console.log('saveddddd draft' + JSON.stringify(pfamilies));

                  })
                })
              })
            })
            // if (busgrpName.includes(',')) {
            //   var bssgroupArray = busgrpName.split(',');
            //   var bGroupName;
            //   for (var i = 0; i < bssgroupArray.length; i++) {
            //     bGroupNames = bssgroupArray[i];
            //     bGroupName = bGroupNames;
            //     console.log("Businedd Group Name is" + bGroupName);
            //     bgroupNamins.businessGroupIns(bGroupName, newBuss, mastercampaignId111);
            //   }
            // }
            // else {
            //   bgroupNamins.businessGroupIns(busgrpName, newBuss, mastercampaignId111);
            // }
            // if (bName.includes(',')) {
            //   console.log("inside business if condition");
            //   var bNameArray = bName.split(',');
            //   var bTypeN;
            //   for (var i = 0; i < bNameArray.length; i++) {
            //     bTypeNames = bNameArray[i];
            //     bTypeN = bTypeNames;
            //     console.log("businesstype Name is" + bTypeN);
            //     bgroupNamins.businessTypeIns(bTypeN, newBuss, mastercampaignId111);
            //   }
            // }
            // else {
            //   bgroupNamins.businessTypeIns(bName, newBuss, mastercampaignId111);
            // }
            // if (segName.includes(',')) {
            //   var segNameArray = segName.split(',');
            //   for (var i = 0; i < segNameArray.length; i++) {
            //     segNames = segNameArray[i];
            //     segN = segNames;
            //     bgroupNamins.mcaSegmentInsertion(segN, newBuss, mastercampaignId111)
            //   }
            // } else {
            //   bgroupNamins.mcaSegmentInsertion(segName, newBuss, mastercampaignId111);
            // }
            // if (PName.includes(',')) {
            //   console.log("inside program families if condition");
            //   var PNamearray = PName.split(',');
            //   var PnameF;
            //   for (var i = 0; i < PNamearray.length; i++) {
            //     PfamilyNames = PNamearray[i];
            //     PnameF = PfamilyNames;
            //     console.log("program Name is" + PnameF);
            //     bgroupNamins.programFamilyIns(PnameF, newBuss, mastercampaignId111);
            //   }
            // }
            // else {
            //   bgroupNamins.programFamilyIns(PName, newBuss, mastercampaignId111);
            // }

            /* redshift.parameterizedQuery('SELECT programfamiliyid FROM apps."programfamilies" WHERE "programfamiliyname" = $1', [newBuss.programfamilyname], { raw: true }, function (err, res) {
              if (err) {
  
              } else {
                console.log("programfamiliyname is " + JSON.stringify(res));
                var programfamiliyname = res;
                console.log('programfamiliyname id is' + programfamiliyname[0].programfamiliyid);
                programfamilies.create({
                  mastercampaignid: mastercampaignId, programfamilyid: newBuss.programfamilyid,
                  clientid: newBuss.clientid
                }, function (err, data) {
                  if (err) {
                    console.log("errors business data is " + err);
                    //.send("<h1>" + err + "<h1>")
  
                    return err;
                  }
                  else {
                    console.log("programfamily data is " + JSON.stringify(data));
  
                  }
                });
              }
  
            }); */
          }
        });
      }
    });
  })
}

function SaveDraftMcaSegments(mcasegmentsid, campaignID) {
  return new Promise(function (resolve, reject) {
    console.log('sfsfsfsfsf'+mcasegmentsid.mcaSegmentId)
    var mcaSegmentId = [];
        mcaSegmentId = mcasegmentsid.mcaSegmentId;
        for (var i = 0; i < mcaSegmentId.length; i++) {
          var mcaSegmentValue = {
            mastercampaignid: campaignID,
            mcasegmentid: mcaSegmentId[i],
            clientid: '1',
            createdby: mcasegmentsid.user,
            createddate: date
          };
          mcasegments.create(mcaSegmentValue, function (err, res) {
            if (err) {
              console.log("Insertion Error while inserting in save draft mca segments table " + err);
            } else {
              console.log("MCA segments save draft inserted successfully " + res);
              resolve(res);

            }
          });
        }

    // var sqlsegments = 'delete from apps.mastercampaignsmcasegments where mastercampaignid=' + campaignID;
    // console.log(sqlsegments);
    // redshift.query(sqlsegments, function (err, scopeId) {
    //   if (err) {
    //     console.log('tactic id error is' + err);
    //   } else {
    //     var mcaSegmentId = [];
    //     mcaSegmentId = data.mcaSegmentId;
    //     for (var i = 0; i < mcaSegmentId.length; i++) {
    //       var mcaSegmentValue = {
    //         mastercampaignid: campaignID,
    //         mcasegmentid: mcaSegmentId[i],
    //         clientid: '1',
    //         updatedby: data.user,
    //         updateddate: date
    //       };
    //       mcasegments.create(mcaSegmentValue, function (err, res) {
    //         if (err) {
    //           console.log("Insertion Error while inserting in mca segments table " + err);
    //         } else {
    //           console.log("MCA segments inserted successfully " + res);
    //           resolve(res);

    //         }
    //       });
    //     }

    //     //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
    //   }
    // });
  });
}

function saveDraftProgramfamilies(programfamiliesid, campaignID) {
 // var PFamilyName = newBuss.programfamilyname;
  return new Promise(function (resolve, reject) {
    var programfamilyId = [];
    programfamilyId = programfamiliesid.programFamiliesID;
    for (var i = 0; i < programfamilyId.length; i++) {
      var programFamilyValue = {
        mastercampaignid: campaignID,
        programfamilyid: programfamilyId[i],
        clientid: '1',
        createdby: programfamiliesid.user,
        createddate: date
      };
      programfamilies.create(programFamilyValue, function (err, programResp) {
        if (err) {
          console.log("Insertion Error while inserting in save draft program family table " + err);
        } else {
          console.log(" save draft program families inserted successfully " + programResp);
          resolve(programResp);

        }
      });
    }


    // var sqlprogramfamilies = 'delete from apps.mastercampaignsprogramfamilies where mastercampaignid=' + campaignID;
    // console.log(sqlprogramfamilies);
    // redshift.query(sqlprogramfamilies, function (err, scopeId) {
    //   if (err) {
    //     console.log('sqlprogramfamilies id error is' + err);
    //   } else {
    //     var programfamilyId = [];
    //     programfamilyId = data.programFamiliesID;
    //     for (var i = 0; i < programfamilyId.length; i++) {
    //       var programFamilyValue = {
    //         mastercampaignid: campaignID,
    //         programfamilyid: programfamilyId[i],
    //         clientid: '1',
    //         updatedby: data.user,
    //         updateddate: date
    //       };
    //       programfamilies.create(programFamilyValue, function (err, programResp) {
    //         if (err) {
    //           console.log("Insertion Error while inserting in program family table " + err);
    //         } else {
    //           console.log("program families inserted successfully " + programResp);
    //           resolve(programResp);

    //         }
    //       });
    //     }

    //     //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
    //   }
    // });
  })
}


function saveDraftBusinessTypes(businesstypeID, campaignID) {
  //const btypeName = newBuss.businesstypename;
  return new Promise(function (resolve, reject) {
    var businessTypeId = [];
        businessTypeId = businesstypeID.businessTypeId;
        for (var i = 0; i < businessTypeId.length; i++) {
          var businesstypeValue = {
            mastercampaignid: campaignID,
            businesstypeid: businessTypeId[i],
            clientid: '1',
            createdby: businesstypeID.user,
            createddate: date
          };
          businesstype.create(businesstypeValue, function (err, res) {
            if (err) {
              console.log("Insertion Error while inserting in save draft business type table " + err);
            } else {
              console.log("save draft business type succesfully " + res);
              resolve(res)

            }
          });
        }


    // var sqlbusinesstypes = 'delete from apps.mastercampaignsbusinesstype where mastercampaignid=' + campaignID;
    // console.log(sqlbusinesstypes);
    // redshift.query(sqlbusinesstypes, function (err, scopeId) {
    //   if (err) {
    //     console.log('sqlbusinesstypes id error is' + err);
    //   } else {
    //     var businessTypeId = [];
    //     businessTypeId = data.businessTypeId;
    //     for (var i = 0; i < businessTypeId.length; i++) {
    //       var businesstypeValue = {
    //         mastercampaignid: campaignID,
    //         businesstypeid: businessTypeId[i],
    //         clientid: '1',
    //         updatedby: data.user,
    //         updateddate: date
    //       };
    //       businesstype.create(businesstypeValue, function (err, res) {
    //         if (err) {
    //           console.log("Insertion Error while inserting in business type table " + err);
    //         } else {
    //           console.log("business type succesfully " + res);
    //           resolve(res)

    //         }
    //       });
    //     }

    //     //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
    //   }
    // });
  });
}


function saveDraftBusinessGroups(businessGroupID, campaignID) {
  return new Promise(function (resolve, reject) {
    //var group = newBuss.businessgroupname;
    var businessGroupIds = [];
        businessGroupIds = businessGroupID.businessGroupID;
        for (var i = 0; i < businessGroupIds.length; i++) {
          var businessGroupValue = {
            mastercampaignid: campaignID,
            businessgroupid: businessGroupIds[i],
            clientid: '1',
            updatedby: businessGroupID.user,
            updateddate: date
          };
          businessgroup.create(businessGroupValue, function (err, res) {
            if (err) {
              console.log("Insertion Error while inserting in save draft Business group " + err);
            } else {
              console.log("save draft Business group inserted succesfuly " + res);
              resolve({ "messagae": "Saved Successfully", status: true, campaignid: campaignID });

            }
          });
        }
    // var sqlbusinessGroups = 'delete from apps.mastercampaignsbusinessgroups where mastercampaignid=' + campaignID;
    // console.log(sqlbusinessGroups);
    // redshift.query(sqlbusinessGroups, function (err, scopeId) {
    //   if (err) {
    //     console.log('sqlbusinessGroups id error is' + err);
    //   } else {
    //     var businessGroupIds = [];
    //     businessGroupIds = data.businessGroupID;
    //     for (var i = 0; i < businessGroupIds.length; i++) {
    //       var businessGroupValue = {
    //         mastercampaignid: campaignID,
    //         businessgroupid: businessGroupIds[i],
    //         clientid: '1',
    //         updatedby: data.user,
    //         updateddate: date
    //       };
    //       businessgroup.create(businessGroupValue, function (err, res) {
    //         if (err) {
    //           console.log("Insertion Error while inserting in Business group " + err);
    //         } else {
    //           console.log("Business group inserted succesfuly " + res);
    //           resolve({ "messagae": "Saved Successfully", status: true, campaignid: campaignID });

    //         }
    //       });
    //     }

    //     //return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
    //   }
    // });
  })
}
