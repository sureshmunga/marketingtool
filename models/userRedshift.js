
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

  var mastercampaignId;
  mastercampaign.create({
    mastercampaignname: newBuss.campaignName, campaigndescription: newBuss.Campaigndescriptiongoals,
    campaignmanager: newBuss.Campaignmanager, status: newBuss.status, startdate: newBuss.startdate, enddate: newBuss.enddate,
    namingconvention: newBuss.namingConvention, mcampaigndigitalid: newBuss.mcadigitalid,createdby: newBuss.createdby
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
          mastercampaignId = JSON.stringify(data.rows[0].max);


          var busgrpName = "" + newBuss.businessgroupname + "";
          console.log("Business Group Name is" + busgrpName);
          if (busgrpName.includes(',')) {
            var bssgroupArray = busgrpName.split(',');
            var bGroupName;
            for (var i = 0; i < bssgroupArray.length; i++) {
              bGroupNames = bssgroupArray[i];
              bGroupName = bGroupNames;
              console.log("Businedd Group Name is" + bGroupName);
              bgroupNamins.businessGroupIns(bGroupName, newBuss, mastercampaignId);
            }
          }
          else {
            bgroupNamins.businessGroupIns(busgrpName, newBuss, mastercampaignId);
          }
          if (bName.includes(',')) {
            console.log("inside business if condition");
            var bNameArray = bName.split(',');
            var bTypeN;
            for (var i = 0; i < bNameArray.length; i++) {
              bTypeNames = bNameArray[i];
              bTypeN = bTypeNames;
              console.log("businesstype Name is" + bTypeN);
              bgroupNamins.businessTypeIns(bTypeN, newBuss, mastercampaignId);
            }
          }
          else {
            bgroupNamins.businessTypeIns(bName, newBuss, mastercampaignId);
          }
          if (segName.includes(',')) {
            var segNameArray = segName.split(',');
            for (var i = 0; i < segNameArray.length; i++) {
              segNames = segNameArray[i];
              segN = segNames;
              bgroupNamins.mcaSegmentInsertion(segN, newBuss, mastercampaignId)
            }
          } else {
            bgroupNamins.mcaSegmentInsertion(segName, newBuss, mastercampaignId);
          }
          if (PName.includes(',')) {
            console.log("inside program families if condition");
            var PNamearray = PName.split(',');
            var PnameF;
            for (var i = 0; i < PNamearray.length; i++) {
              PfamilyNames = PNamearray[i];
              PnameF = PfamilyNames;
              console.log("program Name is" + PnameF);
              bgroupNamins.programFamilyIns(PnameF, newBuss, mastercampaignId);
            }
          }
          else {
            bgroupNamins.programFamilyIns(PName, newBuss, mastercampaignId);
          }

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
}

module.exports.createSubcampaign = function (subcampaign, res, callback) {
  console.log('insideSUbcampaign' + [subcampaign.totalbudget]);
  var programID;
  subcampaignTab.create({
    programname: subcampaign.programname, programdescription: subcampaign.programdescription,
    campaignmanager: subcampaign.campaignmanager, budget: subcampaign.totalbudget, spend: subcampaign.totalspend, status: subcampaign.status, startdate: subcampaign.startdate, enddate: subcampaign.enddate,
    programfamilyid: subcampaign.programfamilyid, mcasegmentid: subcampaign.mcasegmentid, businessgroupid: subcampaign.businessgroupid, businesslineid: subcampaign.businesslineid, businesstypeid: subcampaign.businesstypeid,
    industryid: subcampaign.industryid, mqlgoal: subcampaign.MQLG, mqllow: subcampaign.MQLL, mqlhigh: subcampaign.MQLH, mqlsource: subcampaign.MQLBM, salgoal: subcampaign.SALG, sallow: subcampaign.SALL, salhigh: subcampaign.SALH,
    salsource: subcampaign.SALB, pipelinegoal: subcampaign.TPLG, pipelinelow: subcampaign.TPLL, pipelinehigh: subcampaign.TPLH, pipelinesource: subcampaign.TPLB, namingconvention: subcampaign.namingConvention, programdigitalid: subcampaign.programdigitalid,
    mastercampaignid: subcampaign.mastercampaignid, clientid: subcampaign.clientid, createdby:subcampaign.createdby
  }, function (err, data) {
    if (err) {
      console.log("error is" + err);
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
          if (secbusgrpName.includes(',')) {
            var SecbssgroupArray = secbusgrpName.split(',');
            var SecbGroupName;
            for (var i = 0; i < SecbssgroupArray.length; i++) {
              SbGroupNames = SecbssgroupArray[i];
              SecbGroupName = SbGroupNames;
              console.log("Sec Business Group Name is" + SecbGroupName);
              bgroupNamins.SecbusinessGroupIns(SecbGroupName, subcampaign, programID);
            }
          }
          else {
            bgroupNamins.SecbusinessGroupIns(secbusgrpName, subcampaign, programID);
          }
          var secbusTypeName = "" + subcampaign.secbusinesstype + "";
          console.log("Sec Business type Name is" + secbusTypeName);
          if (secbusTypeName.includes(',')) {
            console.log("inside business if condition");
            var SecBtyperray = secbusTypeName.split(',');
            var SecbTypeN;
            for (var i = 0; i < SecBtyperray.length; i++) {
              SecbTypeNames = SecBtyperray[i];
              SecbTypeN = SecbTypeNames;
              console.log("businesstype Name is" + SecbTypeN);
              bgroupNamins.secbusinessTypeIns(SecbTypeN, subcampaign, programID);
            }
          }
          else {
            bgroupNamins.secbusinessTypeIns(secbusTypeName, subcampaign, programID);
          }

          var prMarket = "" + subcampaign.marketname + "";
          console.log("program market Name is" + prMarket);
          if (prMarket.includes(',')) {
            console.log("inside program market if condition");
            var PmarketArray = prMarket.split(',');
            var MarketTypeN;
            for (var i = 0; i < PmarketArray.length; i++) {
              MarketTypeNames = PmarketArray[i];
              MarketTypeN = MarketTypeNames;
              console.log("MarketType Name is" + SecbTypeN);
              bgroupNamins.marketIns(MarketTypeN, subcampaign, programID);
            }
          }
          else {
            bgroupNamins.marketIns(prMarket, subcampaign, programID);
          }

          var secBusinessLines = "" + subcampaign.secbusinessline + "";
          console.log("secBusinessLines are" + secBusinessLines);
          if (secBusinessLines.includes(',')) {
            console.log("inside secBusinessLines if condition");
            var secBusinessArray = secBusinessLines.split(',');
            var SecBUsinessLine;
            for (var i = 0; i < secBusinessArray.length; i++) {
              SecBUsiinessLineNames = secBusinessArray[i];
              SecBUsinessLine = SecBUsiinessLineNames;
              console.log("SecBUsinessLine Name is" + SecBUsinessLine);
              bgroupNamins.programssecbusinesslines(SecBUsinessLine, subcampaign, programID);
            }
          }
          else {
            bgroupNamins.programssecbusinesslines(secBusinessLines, subcampaign, programID);
          }

        }
      });
    }
  });
}