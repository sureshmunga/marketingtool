var redshift = require('../redshift.js');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select, $in = sql.in;
var async = require("async");
var date = require('date-and-time');

var businessgroup = redshift.import("./models/businessgroup.js");
var mcasegments = redshift.import("./models/mcasegment.js");
var businesstype = redshift.import("./models/businesstype.js");
var mcasegments = redshift.import("./models/mcasegment.js");
var programfamilies = redshift.import("./models/programfamilies.js");
var secbusinessgroup = redshift.import("./models/secondarybusinessgroup.js");
var secbusinesstype = redshift.import("./models/secondarybusinesstype.js");
var programsmarket = redshift.import("./models/markets.js");
var programssecbusinesslines = redshift.import("./models/secbusinessline.js");
var date11 = new Date();

exports.businessGroupIns = function (groupname, newBuss, mastercampaignId) {
    console.log('inside business group Insertion' + groupname + 'master campaign id is ' + mastercampaignId);

    var statement = select('businessgroupid').from('apps.businessgroups').where($in('businessgroupname', groupname)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var bGroupIns = data;
            console.log("data is " + JSON.stringify(bGroupIns));
            for (i = 0; i < bGroupIns.length; i++) {
                var bGroupID = bGroupIns[i].businessgroupid;
                console.log("bid is" + bGroupID);
                businessgroup.create({
                    mastercampaignid: mastercampaignId, businessgroupid: bGroupID,
                    clientid: newBuss.clientid, createdby: newBuss.createdby, createddate: date11
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

exports.businessTypeIns = function (btypeName, newBuss, mastercampaignId) {
    console.log('inside business type Insertion' + btypeName + 'mastercampaingnid is' + mastercampaignId);

    var statement = select('businesstypeid').from('apps.businesstype').where($in('businesstypename', btypeName)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var bTypeIns = data;
            console.log("data is " + JSON.stringify(bTypeIns));
            for (i = 0; i < bTypeIns.length; i++) {
                var bTypeID = bTypeIns[i].businesstypeid;
                console.log("Business type ID is" + bTypeID);
                businesstype.create({
                    mastercampaignid: mastercampaignId, businesstypeid: bTypeID,
                    clientid: newBuss.clientid, createdby: newBuss.createdby, createddate: date11
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

exports.mcaSegmentInsertion = function (segName, newBuss, mastercampaignId) {

    redshift.parameterizedQuery('SELECT mcasegmentid FROM apps."mcasegments" WHERE "mcasegmentname" = $1', [segName], { raw: true }, function (err, data) {
        if (err) {
            console.log("mca segment ID error is " + err);
        } else {
            console.log("mcaid is " + JSON.stringify(data) + 'mastercampaingnid is' + mastercampaignId);
            var segIns = data;
            for (i = 0; i < segIns.length; i++) {
                var segID = segIns[i].mcasegmentid;
                console.log("segment is" + segID);
                mcasegments.create({
                    mastercampaignid: mastercampaignId, mcasegmentid: segID,
                    clientid: newBuss.clientid, createdby: newBuss.createdby, createddate: date11
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


exports.programFamilyIns = function (PfamilyName, newBuss, mastercampaignId) {
    console.log('inside program family name nm  Insertion' + PfamilyName + 'mastercampaingnid is' + mastercampaignId);

    var statement = select('programfamiliyid').from('apps.programfamilies').where($in('programfamiliyname', PfamilyName)).toParams();
    console.log(statement.text);
    redshift.query(statement, { raw: true }, function (err, data) {
        if (err) console.log("error is" + err);
        else {
            var PfIns = data;
            console.log("data is " + JSON.stringify(PfIns));
            for (i = 0; i < PfIns.length; i++) {
                var PFamilyID = PfIns[i].programfamiliyid;
                console.log("Program family ID is" + PFamilyID);
                programfamilies.create({
                    mastercampaignid: mastercampaignId, programfamilyid: PFamilyID,
                    clientid: newBuss.clientid, createdby: newBuss.createdby, createddate: date11
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


exports.names1 = function (id, callback) {
    console.log('inside');
    var programId = id

    async.parallel([
        function (callback) { redshift.query(select('apps.mastercampaignsprogramfamilies.mastercampaignid', 'apps.programfamilies.programfamiliyname', 'apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', id)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams(), callback) },
        function (callback) {
            redshift.query('select mm.startdate,mm.enddate from apps.mastercampaigns mm '
                + 'where mm.mastercampaignid=' + programId + '', callback)
        },
        function (callback) { redshift.query(select('apps.mastercampaignsmcasegments.mastercampaignid', 'apps.mcasegments.mcasegmentname', 'apps.mcasegments.mcasegmentid').from('apps.mastercampaignsmcasegments').where($in('apps.mastercampaignsmcasegments.mastercampaignid', id)).innerJoin('apps.mcasegments').on('apps.mastercampaignsmcasegments.mcasegmentid', 'apps.mcasegments.mcasegmentid').toParams(), callback) },
        function (callback) { redshift.query(select('apps.mastercampaignsbusinessgroups.mastercampaignid', 'apps.businessgroups.businessgroupid', 'apps.businessgroups.businessgroupname').from('apps.mastercampaignsbusinessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', id)).innerJoin('apps.businessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams(), callback) },
        function (callback) { redshift.query(select('apps.mastercampaignsbusinesstype.mastercampaignid', 'apps.businesstype.businesstypeid', 'apps.businesstype.businesstypename').from('apps.mastercampaignsbusinesstype').where($in('apps.mastercampaignsbusinesstype.mastercampaignid', id)).innerJoin('apps.businesstype').on('apps.mastercampaignsbusinesstype.businesstypeid', 'apps.businesstype.businesstypeid').toParams(), callback) },
    ], function (err, results) {
        console.log(results[1].rows);
        var startdate = results[1].rows[0].startdate;
        var formatStartDate = date.format(startdate, 'YYYY-MM-DD');
        console.log('formatted date ', formatStartDate);
        var endDate = results[1].rows[0].enddate;
        var Formattedenddate = date.format(endDate, 'YYYY-MM-DD');
        console.log('formatted date ', Formattedenddate);
        console.log(results[2].rows);
        if (err) {
            console.log(err);
        } else {
            return callback({
                programjob: results[0].rows
                , startdate: formatStartDate,
                enddate: Formattedenddate,
                mcasegment: results[2].rows,
                businessgroup: results[3].rows,
                bustype: results[4].rows
                // , market:data[2].rows
                // , BusinessGroup:data[3].rows
                // , BusinessLine:data[4].rows
                // , BusinessType : data[5].rows
                // , Industry : data[6].rows
            });
        }
        // console.log('mcasegments  result is' +results[1].rows);
        // console.log('Business groups  result is' +results[2].rows);
        // console.log('Business lines are' + JSON.stringify(results[3].rows));
        // console.log('Business types are' + JSON.stringify(results[4].rows));
        // console.log('lead industries are' + JSON.stringify(results[5].rows));
        // console.log('marketnames are' + JSON.stringify(results[6].rows));
        // console.log('sec business groups are' + JSON.stringify(results[7].rows));
        // console.log('sec business lines are' + JSON.stringify(results[8].rows));
        // console.log('sec business types are' + JSON.stringify(results[9].rows));
        // console.log('program families are ' + JSON.stringify(results[10].rows));
        // res.render('../views/CST/editProgram', { programTab: results[0].rows ,startDate:formatStartDate, endDate:Formattedenddate, mcaseg:results[1].rows,leadbusiness: results[2].rows,leadbusinesslin:results[3].rows,leadbusinessty:results[4].rows,industryLead:results[5].rows ,
        //                                          markettab: results[6].rows,secbusinessgro: results[7].rows,secbusinessLin:results[8].rows,secbusinesstyp:results[9].rows,pfamily:results[10].rows ,campaign:results[11].rows  });

    });
    //console.log('inside names' + groupname + 'master campaign id is ' + mastercampaignId);
    //select('*').from('person').innerJoin('address').on('person.addr_id', 'address.id');
    //SELECT a.mastercampaignid,a.programfamilyid,c.programfamiliyname  FROM apps.mastercampaignsprogramfamilies a, apps.programfamilies c WHERE a.mastercampaignid=114 and a.programfamilyid=c.programfamiliyid
    //var statement = select('apps.mastercampaignsprogramfamilies.mastercampaignid','apps.programfamilies.programfamiliyname','apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', groupname)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams();
    //where($in('businessgroupname', groupname)).toParams();
    // console.log(statement.text);
    // redshift.query(statement, { raw: true }, function (err, data) { 
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log(JSON.stringify(data));
    //         return callback(data);
    //     }


    // });
    /*  redshift.query(statement, { raw: true }, function (err, data) { 
         if (err) console.log("error is" + err);
         else {
             var bGroupIns = data;
             console.log("data is " + JSON.stringify(bGroupIns));
             for (i = 0; i < bGroupIns.length; i++) {
                 var bGroupID = bGroupIns[i].businessgroupid;
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

exports.SecbusinessGroupIns = function (groupname, subcampaign, programID) {
    console.log('inside sec business group Insertion' + groupname + 'master campaign id is ' + programID);


    var bGroupIns = groupname;
    console.log("data is " + JSON.stringify(bGroupIns));
    for (i = 0; i < bGroupIns.length; i++) {
        var bGroupID = bGroupIns[i];
        console.log("bid is" + bGroupID);
        secbusinessgroup.create({
            programid: programID, businessgroupid: bGroupID,
            clientid: subcampaign.clientid, createdby: subcampaign.createdby, createddate: date11
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


exports.secbusinessTypeIns = function (btypeName, subcampaign, programID) {
    console.log('inside business type Insertion' + btypeName + 'programID is' + programID);

    // var statement = select('businesstypeid').from('apps.businesstype').where($in('businesstypename', btypeName)).toParams();
    // console.log(statement.text);


    var bTypeIns = btypeName;
    console.log("sec business type data is " + JSON.stringify(bTypeIns));
    for (i = 0; i < bTypeIns.length; i++) {
        var bTypeID = bTypeIns[i];
        console.log("Business type ID is" + bTypeID);
        secbusinesstype.create({
            programid: programID, businesstypeid: bTypeID,
            clientid: subcampaign.clientid, createdby: subcampaign.createdby, createddate: date11
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


exports.marketIns = function (marketName, subcampaign, programID) {
    console.log('inside market Insertion' + marketName + 'programID is' + programID);

    var MarketINS = marketName;
    //console.log("market data is " + JSON.stringify(MarketINS));
    for (i = 0; i < MarketINS.length; i++) {
        var MarketID = MarketINS[i];
        console.log("market ID is" + MarketID);
        programsmarket.create({
            programid: programID, marketid: MarketID,
            clientid: subcampaign.clientid, createdby: subcampaign.createdby, createddate: date11
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

exports.programssecbusinesslines = function (businessline, subcampaign, programID) {
    console.log('inside businessline' + businessline + 'programID is' + programID);

    //var statement = select('businesslineid').from('apps.businesslines').where($in('businesslinename', businessline)).toParams();
    //console.log(statement.text);
    var businessLineIns = businessline;
    console.log("sec business line is " + JSON.stringify(businessLineIns));
    for (i = 0; i < businessLineIns.length; i++) {
        var BusinessLineId = businessLineIns[i];
        console.log("BusinessLineId is" + BusinessLineId);
        programssecbusinesslines.create({
            programid: programID, businesslineid: BusinessLineId,
            clientid: subcampaign.clientid, createdby: subcampaign.createdby, createddate: date11
        }, function (err, dataa) {
            if (err) {
                console.log("errors BusinessLineId data is " + err);
                //data.send("<h1>" + err + "<h1>")
                return err;
            } else {
                console.log("inserted BusinessLineId succesfully" + BusinessLineId + dataa);
            }
        });
    }
}


exports.businesslines = function (id, callback) {
    console.log('inside business line id ' + id);
    var businesslineID = id

    async.parallel([
        //function (callback) { redshift.query(select('apps.mastercampaignsprogramfamilies.mastercampaignid','apps.programfamilies.programfamiliyname','apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', id)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams(), callback) },
        function (callback) {
            redshift.query('select d.businesslineid,d.businesslinename from apps.businesslines d '
                + 'where d.businessgroupid in(' + businesslineID + ')', callback)
        },
        // function (callback) { redshift.query('select d.businesslineid,d.businesslinename from apps.businesslines d '
        // +'where d.businessgroupid in (1,2), callback) },
        //function (callback) { redshift.query(select('apps.mastercampaignsmcasegments.mastercampaignid','apps.mcasegments.mcasegmentname','apps.mcasegments.mcasegmentid').from('apps.mastercampaignsmcasegments').where($in('apps.mastercampaignsmcasegments.mastercampaignid', id)).innerJoin('apps.mcasegments').on('apps.mastercampaignsmcasegments.mcasegmentid', 'apps.mcasegments.mcasegmentid').toParams(), callback) },
        //function (callback) { redshift.query(select('apps.mastercampaignsbusinessgroups.mastercampaignid','apps.businessgroups.businessgroupid','apps.businessgroups.businessgroupname').from('apps.mastercampaignsbusinessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', id)).innerJoin('apps.businessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams(), callback) },
        //function (callback) { redshift.query(select('apps.mastercampaignsbusinesstype.mastercampaignid','apps.businesstype.businesstypeid','apps.businesstype.businesstypename').from('apps.mastercampaignsbusinesstype').where($in('apps.mastercampaignsbusinesstype.mastercampaignid', id)).innerJoin('apps.businesstype').on('apps.mastercampaignsbusinesstype.businesstypeid', 'apps.businesstype.businesstypeid').toParams(), callback) },
    ], function (err, results) {
        console.log(JSON.stringify(results[0].rows));
        if (err) {
            console.log(err);
        } else {
            return callback({
                leadBu: results[0].rows

                // , market:data[2].rows
                // , BusinessGroup:data[3].rows
                // , BusinessLine:data[4].rows
                // , BusinessType : data[5].rows
                // , Industry : data[6].rows
            });
        }
        // console.log('mcasegments  result is' +results[1].rows);
        // console.log('Business groups  result is' +results[2].rows);
        // console.log('Business lines are' + JSON.stringify(results[3].rows));
        // console.log('Business types are' + JSON.stringify(results[4].rows));
        // console.log('lead industries are' + JSON.stringify(results[5].rows));
        // console.log('marketnames are' + JSON.stringify(results[6].rows));
        // console.log('sec business groups are' + JSON.stringify(results[7].rows));
        // console.log('sec business lines are' + JSON.stringify(results[8].rows));
        // console.log('sec business types are' + JSON.stringify(results[9].rows));
        // console.log('program families are ' + JSON.stringify(results[10].rows));
        // res.render('../views/CST/editProgram', { programTab: results[0].rows ,startDate:formatStartDate, endDate:Formattedenddate, mcaseg:results[1].rows,leadbusiness: results[2].rows,leadbusinesslin:results[3].rows,leadbusinessty:results[4].rows,industryLead:results[5].rows ,
        //                                          markettab: results[6].rows,secbusinessgro: results[7].rows,secbusinessLin:results[8].rows,secbusinesstyp:results[9].rows,pfamily:results[10].rows ,campaign:results[11].rows  });

    });
    //console.log('inside names' + groupname + 'master campaign id is ' + mastercampaignId);
    //select('*').from('person').innerJoin('address').on('person.addr_id', 'address.id');
    //SELECT a.mastercampaignid,a.programfamilyid,c.programfamiliyname  FROM apps.mastercampaignsprogramfamilies a, apps.programfamilies c WHERE a.mastercampaignid=114 and a.programfamilyid=c.programfamiliyid
    //var statement = select('apps.mastercampaignsprogramfamilies.mastercampaignid','apps.programfamilies.programfamiliyname','apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', groupname)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams();
    //where($in('businessgroupname', groupname)).toParams();
    // console.log(statement.text);
    // redshift.query(statement, { raw: true }, function (err, data) { 
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log(JSON.stringify(data));
    //         return callback(data);
    //     }


    // });
    /*  redshift.query(statement, { raw: true }, function (err, data) { 
         if (err) console.log("error is" + err);
         else {
             var bGroupIns = data;
             console.log("data is " + JSON.stringify(bGroupIns));
             for (i = 0; i < bGroupIns.length; i++) {
                 var bGroupID = bGroupIns[i].businessgroupid;
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

exports.industry = function (id, callback) {
    console.log('inside id ' + id);
    var businesstypeId = id

    async.parallel([
        //function (callback) { redshift.query(select('apps.mastercampaignsprogramfamilies.mastercampaignid','apps.programfamilies.programfamiliyname','apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', id)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams(), callback) },
        function (callback) {
            redshift.query('select d.industryid,d.industryname from  apps.industry d '
                + 'where d.businesstypeid=' + businesstypeId + '', callback)
        },
        //function (callback) { redshift.query(select('apps.mastercampaignsmcasegments.mastercampaignid','apps.mcasegments.mcasegmentname','apps.mcasegments.mcasegmentid').from('apps.mastercampaignsmcasegments').where($in('apps.mastercampaignsmcasegments.mastercampaignid', id)).innerJoin('apps.mcasegments').on('apps.mastercampaignsmcasegments.mcasegmentid', 'apps.mcasegments.mcasegmentid').toParams(), callback) },
        //function (callback) { redshift.query(select('apps.mastercampaignsbusinessgroups.mastercampaignid','apps.businessgroups.businessgroupid','apps.businessgroups.businessgroupname').from('apps.mastercampaignsbusinessgroups').where($in('apps.mastercampaignsbusinessgroups.mastercampaignid', id)).innerJoin('apps.businessgroups').on('apps.mastercampaignsbusinessgroups.businessgroupid', 'apps.businessgroups.businessgroupid').toParams(), callback) },
        //function (callback) { redshift.query(select('apps.mastercampaignsbusinesstype.mastercampaignid','apps.businesstype.businesstypeid','apps.businesstype.businesstypename').from('apps.mastercampaignsbusinesstype').where($in('apps.mastercampaignsbusinesstype.mastercampaignid', id)).innerJoin('apps.businesstype').on('apps.mastercampaignsbusinesstype.businesstypeid', 'apps.businesstype.businesstypeid').toParams(), callback) },
    ], function (err, results) {
        console.log(JSON.stringify(results[0].rows));
        if (err) {
            console.log(err);
        } else {
            return callback({
                leadind: results[0].rows

                // , market:data[2].rows
                // , BusinessGroup:data[3].rows
                // , BusinessLine:data[4].rows
                // , BusinessType : data[5].rows
                // , Industry : data[6].rows
            });
        }
        // console.log('mcasegments  result is' +results[1].rows);
        // console.log('Business groups  result is' +results[2].rows);
        // console.log('Business lines are' + JSON.stringify(results[3].rows));
        // console.log('Business types are' + JSON.stringify(results[4].rows));
        // console.log('lead industries are' + JSON.stringify(results[5].rows));
        // console.log('marketnames are' + JSON.stringify(results[6].rows));
        // console.log('sec business groups are' + JSON.stringify(results[7].rows));
        // console.log('sec business lines are' + JSON.stringify(results[8].rows));
        // console.log('sec business types are' + JSON.stringify(results[9].rows));
        // console.log('program families are ' + JSON.stringify(results[10].rows));
        // res.render('../views/CST/editProgram', { programTab: results[0].rows ,startDate:formatStartDate, endDate:Formattedenddate, mcaseg:results[1].rows,leadbusiness: results[2].rows,leadbusinesslin:results[3].rows,leadbusinessty:results[4].rows,industryLead:results[5].rows ,
        //                                          markettab: results[6].rows,secbusinessgro: results[7].rows,secbusinessLin:results[8].rows,secbusinesstyp:results[9].rows,pfamily:results[10].rows ,campaign:results[11].rows  });

    });
    //console.log('inside names' + groupname + 'master campaign id is ' + mastercampaignId);
    //select('*').from('person').innerJoin('address').on('person.addr_id', 'address.id');
    //SELECT a.mastercampaignid,a.programfamilyid,c.programfamiliyname  FROM apps.mastercampaignsprogramfamilies a, apps.programfamilies c WHERE a.mastercampaignid=114 and a.programfamilyid=c.programfamiliyid
    //var statement = select('apps.mastercampaignsprogramfamilies.mastercampaignid','apps.programfamilies.programfamiliyname','apps.programfamilies.programfamiliyid').from('apps.mastercampaignsprogramfamilies').where($in('apps.mastercampaignsprogramfamilies.mastercampaignid', groupname)).innerJoin('apps.programfamilies').on('apps.mastercampaignsprogramfamilies.programfamilyid', 'apps.programfamilies.programfamiliyid').toParams();
    //where($in('businessgroupname', groupname)).toParams();
    // console.log(statement.text);
    // redshift.query(statement, { raw: true }, function (err, data) { 
    //     if(err){
    //         console.log(err);
    //     }else{
    //         console.log(JSON.stringify(data));
    //         return callback(data);
    //     }


    // });
    /*  redshift.query(statement, { raw: true }, function (err, data) { 
         if (err) console.log("error is" + err);
         else {
             var bGroupIns = data;
             console.log("data is " + JSON.stringify(bGroupIns));
             for (i = 0; i < bGroupIns.length; i++) {
                 var bGroupID = bGroupIns[i].businessgroupid;
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


