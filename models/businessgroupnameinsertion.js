var redshift = require('../redshift.js');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select, $in = sql.in;

 var businessgroup = redshift.import("./models/businessgroup.js");
var mcasegments = redshift.import("./models/mcasegment.js");
var businesstype = redshift.import("./models/businesstype.js");
var mcasegments = redshift.import("./models/mcasegment.js");
var programfamilies = redshift.import("./models/programfamilies.js");
var secbusinessgroup = redshift.import("./models/secondarybusinessgroup.js");
var secbusinesstype = redshift.import("./models/secondarybusinesstype.js");
var programsmarket = redshift.import("./models/markets.js");
var programssecbusinesslines = redshift.import("./models/secbusinessline.js");

exports.businessGroupIns = function (groupname,newBuss,mastercampaignId) {
    console.log('inside business group Insertion' + groupname + 'master campaign id is ' + mastercampaignId);

    var statement = select('businessgroupid').from('apps.businessgroups').where($in('businessgroupname', groupname)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) { 
        if (err) console.log("error is" + err);
        else {
            var bGroupIns = data;
            console.log("data is " + JSON.stringify(bGroupIns));
            for (i = 0; i < bGroupIns.length; i++) {
                const bGroupID = bGroupIns[i].businessgroupid;
                console.log("bid is" + bGroupID);
                businessgroup.create({
                    mastercampaignid: mastercampaignId, businessgroupid: bGroupID,
                    clientid: newBuss.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors business data is " + err);
                       // data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted business group succesfully" + bGroupID);
                    }
                });
            }
        }
    });
}

exports.businessTypeIns = function (btypeName,newBuss,mastercampaignId) {
    console.log('inside business type Insertion' + btypeName + 'mastercampaingnid is' + mastercampaignId);

    var statement = select('businesstypeid').from('apps.businesstype').where($in('businesstypename', btypeName)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var bTypeIns = data;
            console.log("data is " + JSON.stringify(bTypeIns));
            for (i = 0; i < bTypeIns.length; i++) {
                const bTypeID = bTypeIns[i].businesstypeid;
                console.log("Business type ID is" + bTypeID);
                businesstype.create({
                    mastercampaignid: mastercampaignId, businesstypeid: bTypeID,
                    clientid: newBuss.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors business type data is " + err);
                        //data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted business type succesfully" + bTypeID);
                    }
                });
            }
        }
    });
}

exports.mcaSegmentInsertion = function(segName,newBuss,mastercampaignId){

    redshift.parameterizedQuery('SELECT mcasegmentid FROM apps."mcasegments" WHERE "mcasegmentname" = $1', [segName], { raw: true }, function (err, data) {
        if (err) {
          console.log("mca segment ID error is " + err);
        } else {
          console.log("mcaid is " + JSON.stringify(data) + 'mastercampaingnid is' + mastercampaignId);
          var segIns = data;
          for (i = 0; i < segIns.length; i++) {
            const segID = segIns[i].mcasegmentid;
            console.log("segment is" + segID);
            mcasegments.create({
              mastercampaignid: mastercampaignId, mcasegmentid: segID,
              clientid: newBuss.clientid
            }, function (err, data) {
              if (err) {
                console.log("errors segments data is " + err);
                //data.send("<h1>" + err + "<h1>")
                return err;
              }
              else {
                console.log("mca segment inseted data is " + data);
                console.log("inserted successfully segment ID" + segID);
              }
            });
          }
        }
      });
}


exports.programFamilyIns = function (PfamilyName,newBuss,mastercampaignId) {
    console.log('inside program family name nm  Insertion' + PfamilyName + 'mastercampaingnid is' + mastercampaignId);

    var statement = select('programfamiliyid').from('apps.programfamilies').where($in('programfamiliyname', PfamilyName)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var PfIns = data;
            console.log("data is " + JSON.stringify(PfIns));
            for (i = 0; i < PfIns.length; i++) {
                const PFamilyID = PfIns[i].programfamiliyid;
                console.log("Program family ID is" + PFamilyID);
                programfamilies.create({
                    mastercampaignid: mastercampaignId, programfamilyid: PFamilyID,
                    clientid: newBuss.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors programfamily  is " + err);
                        //data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted program familyname succesfully" + PFamilyID);
                    }
                });
            }
        }
    });
} 


exports.names1 = function (id,callback) {
    console.log('inside');
    var groupname=id
    //console.log('inside names' + groupname + 'master campaign id is ' + mastercampaignId);
    //select('*').from('person').innerJoin('address').on('person.addr_id', 'address.id');
    //SELECT a.mastercampaignid,a.programfamilyid,c.programfamiliyname  FROM apps.mastercampaignsprogramfamilies a, apps.programfamilies c WHERE a.mastercampaignid=114 and a.programfamilyid=c.programfamiliyid
    var statement = select('apps.mastercampaignsprogramfamilies.mastercampaignid','apps.programfamilies.programfamiliyname','apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', groupname)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams();
    //where($in('businessgroupname', groupname)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) { 
        if(err){
            console.log(err);
        }else{
            console.log(JSON.stringify(data));
            return callback(data);
        }


    });
   /*  redshift.query(statement, { raw: true }, function (err, data) { 
        if (err) console.log("error is" + err);
        else {
            var bGroupIns = data;
            console.log("data is " + JSON.stringify(bGroupIns));
            for (i = 0; i < bGroupIns.length; i++) {
                const bGroupID = bGroupIns[i].businessgroupid;
                console.log("bid is" + bGroupID);
                businessgroup.create({
                    mastercampaignid: mastercampaignId, businessgroupid: bGroupID,
                    clientid: newBuss.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors business data is " + err);
                       // data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted business group succesfully" + bGroupID);
                    }
                });
            }
        }
    }); */
}

exports.SecbusinessGroupIns = function (groupname,subcampaign,programID) {
    console.log('inside sec business group Insertion' + groupname + 'master campaign id is ' + programID);

    var statement = select('businessgroupid').from('apps.businessgroups').where($in('businessgroupname', groupname)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) { 
        if (err) console.log("error is" + err);
        else {
            var bGroupIns = data;
            console.log("data is " + JSON.stringify(bGroupIns));
            for (i = 0; i < bGroupIns.length; i++) {
                const bGroupID = bGroupIns[i].businessgroupid;
                console.log("bid is" + bGroupID);
                secbusinessgroup.create({
                    programid: programID, businessgroupid: bGroupID,
                    clientid: subcampaign.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors business group data is " + err);
                       // data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted sec business group succesfully" + programID);
                    }
                });
            }
        }
    });
}

exports.secbusinessTypeIns = function (btypeName,subcampaign,programID) {
    console.log('inside business type Insertion' + btypeName + 'programID is' + programID);

    var statement = select('businesstypeid').from('apps.businesstype').where($in('businesstypename', btypeName)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var bTypeIns = data;
            console.log("sec business type data is " + JSON.stringify(bTypeIns));
            for (i = 0; i < bTypeIns.length; i++) {
                const bTypeID = bTypeIns[i].businesstypeid;
                console.log("Business type ID is" + bTypeID);
                secbusinesstype.create({
                    programid: programID, businesstypeid: bTypeID,
                    clientid: subcampaign.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors business type data is " + err);
                        //data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted sec business type succesfully" + bTypeID);
                    }
                });
            }
        }
    });
}

exports.marketIns = function (marketName,subcampaign,programID) {
    console.log('inside market Insertion' + marketName + 'programID is' + programID);

    var statement = select('marketid').from('apps.market').where($in('marketname', marketName)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var MarketINS = data;
            console.log("market data is " + JSON.stringify(MarketINS));
            for (i = 0; i < MarketINS.length; i++) {
                const MarketID = MarketINS[i].marketid;
                console.log("market ID is" + MarketID);
                programsmarket.create({
                    programid: programID, marketid: MarketID,
                    clientid: subcampaign.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors market insertion data is " + err);
                        //data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted market succesfully" + MarketID);
                    }
                });
            }
        }
    });
}

exports.programssecbusinesslines = function (businessline,subcampaign,programID) {
    console.log('inside businessline' + businessline + 'programID is' + programID);

    var statement = select('businesslineid').from('apps.businesslines').where($in('businesslinename', businessline)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var businessLineIns = data;
            console.log("sec business line is " + JSON.stringify(businessLineIns));
            for (i = 0; i < businessLineIns.length; i++) {
                const BusinessLineId = businessLineIns[i].businesslineid;
                console.log("BusinessLineId is" + BusinessLineId);
                programssecbusinesslines.create({
                    programid: programID, businesslineid: BusinessLineId,
                    clientid: subcampaign.clientid
                }, function (err, data) {
                    if (err) {
                        console.log("errors BusinessLineId data is " + err);
                        //data.send("<h1>" + err + "<h1>")
                        return err;
                    } else {
                        console.log("inserted BusinessLineId succesfully" + BusinessLineId);
                    }
                });
            }
        }
    });
}



