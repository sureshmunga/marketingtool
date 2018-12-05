var redshift = require('../../redshift.js');
var async = require("async");
var moment = require('moment');
var utilhelpers = require("../utilhelper.js");
var programtable = redshift.import("./models/programme.js");
var programmarket = redshift.import("./models/programmarkets.js");
var programbusinessgroups = redshift.import("./models/programbusinessgroup.js");
var programbusinesslines = redshift.import("./models/programbusinessline.js");
var programtypes = redshift.import("./models/programbusinesstype.js");
var programsindustry = redshift.import("./models/programindustry.js")


module.exports.getprogramall = function (req, res) {
    async.parallel([
        function (callback) {
            var SQLQuery = 'SELECT programid,programname,programdescription,campaignmanager,status,' +
                ' startdate,enddate,programdigitalid,createdby from apps.programs where isactive=1';
            redshift.query(SQLQuery, callback)
        }
    ],
        function (err, results) {
            for (var i = 0; i < results[0].rows.length; i++) {
                // var sd = new Date(results[0].rows[i].startdate);
                // var ed = new Date(results[0].rows[i].enddate);
                // results[0].rows[i].startdate = sd.getMonth() + '-' + sd.getDate() + '-' + sd.getFullYear();
                // results[0].rows[i].enddate = ed.getMonth() + '-' + ed.getDate() + '-' + ed.getFullYear();
                results[0].rows[i].startdate = moment(results[0].rows[i].startdate).format('MM-DD-YYYY');
                results[0].rows[i].enddate = moment(results[0].rows[i].enddate).format('MM-DD-YYYY');
            }
            res.render('../views/cst/programlist', {
                programlist: results[0].rows
            });
        });
};

module.exports.getcampaign = function (req, res) {
    async.parallel([
        function (callback) {
            redshift.query('SELECT a.mastercampaignid,a.mastercampaignname FROM apps."mastercampaigns" a where a.isactive=1', callback)
        }
    ],
        function (err, results) {
            res.render('../views/CST/program', { campaign: results[0].rows });
        });
};

module.exports.oncampaignchange = function (campaignId, callback) {
    async.parallel([
        function (callback) {
            redshift.query('select pf.programfamiliyid, pf.programfamiliyname,false as isselect from apps.programfamilies pf '
                + ' inner join apps.mastercampaignsprogramfamilies cpf on pf.programfamiliyid= cpf.programfamilyid '
                + ' where cpf.mastercampaignid = ' + campaignId, callback)
        },
        function (callback) {
            redshift.query('select mca.mcasegmentid,mca.mcasegmentname,false as isselect from apps."mcasegments" mca'
                + ' inner join apps.mastercampaignsmcasegments prg on mca.mcasegmentid=prg.mcasegmentid where prg.mastercampaignid=' + campaignId, callback)
        },
        function (callback) {
            redshift.query('select mar.marketid,mar.marketname,false as isselect from apps."market" mar where mar.isactive=1', callback)
        },
        function (callback) {
            redshift.query('select bg.businessgroupid,bg.businessgroupname,false as isselect from apps.businessgroups bg '
                + ' inner join apps.mastercampaignsbusinessgroups prgbg on bg.businessgroupid=prgbg.businessgroupid '
                + ' where prgbg.mastercampaignid=' + campaignId, callback)
        },
        function (callback) {
            redshift.query('select bg.businesstypeid,bg.businesstypename,false as isselect from apps.businesstype bg '
                + ' inner join apps.mastercampaignsbusinesstype prgbg on bg.businesstypeid=prgbg.businesstypeid '
                + ' where prgbg.mastercampaignid=' + campaignId, callback)
        }
    ],
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                return callback({
                    programFamily: data[0].rows
                    , MCASegment: data[1].rows
                    , market: data[2].rows
                    , BusinessGroup: data[3].rows
                    , BusinessType: data[4].rows
                });
            }
        });
};

module.exports.onbgchange = function (data, res, callback) {
    async.parallel([
        function (callback) {
            var statement = 'select bg.businesslineid,bg.businesslinename,false as isselect from apps.businesslines bg '
                + ' where bg.isactive=1 and bg.clientid = 1 and bg.businessgroupid in (' + data.BGId + ')';
            console.log(statement);

            redshift.query(statement, callback)
        }
    ],
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                return callback({ BusinessLine: data[0].rows });
            }
        });
};

module.exports.onbtchange = function (data, res, callback) {
    async.parallel([
        function (callback) {
            var statement = 'select bg.industryid,bg.industryname,false as isselect from apps.industry bg '
                + ' where bg.isactive=1 and bg.clientid = 1 and bg.businesstypeid in (' + data.BTId + ')';
            //console.log(statement);

            redshift.query(statement, callback)
        }
    ],
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                return callback({ Industry: data[0].rows });
            }
        });
};

module.exports.onprogramsave = function (data, res, callback) {
    var porgramdata = {
        campaignmanager: data.Campaignmanager,
        programdescription: data.Description,
        programname: data.Name,
        budget: data.Budget,
        spend: data.Spend,
        status: data.status,
        startdate: data.StartDate,
        enddate: data.EndDate,
        programfamilyid: data.ProgramFamily,
        mcasegmentid: data.MCASegmentId,
        businessgroupid: data.BusinessGroupId,
        businesslineid: data.BusinessLineId,
        businesstypeid: data.BusinessTypeId,
        industryid: data.IndustryId,
        mqlgoal: data.MQLGol,
        mqllow: data.MQLLow,
        mqlhigh: data.MQLHigh,
        mqlsource: data.MQLSource,
        salgoal: data.SALGol,
        sallow: data.SALLow,
        salhigh: data.SALHigh,
        salsource: data.SALSource,
        pipelinegoal: data.TPGol,
        pipelinelow: data.TPLow,
        pipelinehigh: data.TPHigh,
        pipelinesource: data.TPSource,
        user: data.user,
        mastercampaignid: data.CampaignId,
        isactive: "1",
        clientid: "1",
        MarketId: data.MarketId,
        BusinessGroup: data.BusinessGroup,
        Businessline: data.Businessline,
        Businesstype: data.Businesstype,
        Industry: data.Industry
    };

    if (data.programid == "" || data.programid == "/") {
        data.programid = "0";
        porgramdata.createdby = data.user;
        porgramdata.createddate = moment().format("YYYY-MM-DD");
    }
    else {
        porgramdata.updatedby = data.user;
        porgramdata.updateddate = moment().format("YYYY-MM-DD");
    }
    //console.log(JSON.stringify(tacticdata));
    if (data.programid == "" || data.programid == "/" || data.programid == "0" || data.programid == undefined) {
        programtable.create(porgramdata, function (err, result) {
            if (err) {
                console.log("error is " + err);
            }
            else {
                var SQLStatement = "SELECT ISNULL(Max(programid),0) as programid from apps.programs where createdby='" + data.user + "'";
                redshift.query(SQLStatement, function (err, scopeId) {
                    if (err) {
                        console.log('program id error is' + err);
                    } else {
                        console.log('program id ' + JSON.stringify(scopeId.rows[0].programid));
                        data.programid = scopeId.rows[0].programid;
                        var programdigitalid = 'P' + utilhelpers.getDID(data.programid);
                        console.log(programdigitalid);
                        var sqldid = "update apps.programs set programdigitalid='" + programdigitalid + "' where programid=" + data.programid;
                        console.log(sqldid);
                        redshift.query(sqldid, function (err) {
                            if (err) console.log('while updating program digital id error throws : ' + err);
                        });
                        updateinsertmarket(data, callback);
                    }
                });
                return;
            }
        });
    }
    else {
        console.log(porgramdata);
        var SQLUpdate = "update apps.programs set programname='" + porgramdata.programname + "'"
            + " , programdescription='" + porgramdata.programdescription + "'"
            + " , campaignmanager='" + porgramdata.campaignmanager + "'"
            + " , budget='" + porgramdata.budget + "'"
            + " , spend='" + porgramdata.spend + "'"
            + " , status='" + porgramdata.status + "'"
            + " , startdate='" + porgramdata.startdate + "'"
            + " , enddate='" + porgramdata.enddate + "'"
            + " , programfamilyid ='" + porgramdata.programfamilyid + "'"
            + " , mcasegmentid ='" + porgramdata.mcasegmentid + "'"
            + " , businessgroupid ='" + porgramdata.businessgroupid + "'"
            + " , businesslineid ='" + porgramdata.businesslineid + "'"
            + " , businesstypeid ='" + porgramdata.businesstypeid + "'"
            + " , industryid ='" + porgramdata.industryid + "'"
            + " , mqlgoal ='" + porgramdata.mqlgoal + "'"
            + " , mqllow ='" + porgramdata.mqllow + "'"
            + " , mqlhigh ='" + porgramdata.mqlhigh + "'"
            + " , mqlsource ='" + porgramdata.mqlsource + "'"
            + " , salgoal ='" + porgramdata.salgoal + "'"
            + " , sallow ='" + porgramdata.sallow + "'"
            + " , salhigh ='" + porgramdata.salhigh + "'"
            + " , salsource ='" + porgramdata.salsource + "'"
            + " , pipelinegoal ='" + porgramdata.pipelinegoal + "'"
            + " , pipelinelow ='" + porgramdata.pipelinelow + "'"
            + " , pipelinehigh ='" + porgramdata.pipelinehigh + "'"
            + " , pipelinesource ='" + porgramdata.pipelinesource + "'"
            + " , mastercampaignid ='" + porgramdata.mastercampaignid + "'"
            + " , updatedby='" + porgramdata.user + "'"
            + " , updateddate='" + moment().format("YYYY-MM-DD") + "'"
            + " where programid =" + data.programid;

        console.log(JSON.stringify(SQLUpdate));
        redshift.query(SQLUpdate, function (err) {
            if (err) console.log('while updating tactic error throws : ' + err);
            else {
                updateinsertmarket(data, callback);
                return;
            }
        });
    }
};

function updateinsertmarket(data, callback) {

    var sqlmarket = 'delete from apps.programsmarket where programid=' + data.programid;
    console.log(sqlmarket);
    redshift.query(sqlmarket, function (err, scopeId) {
        if (err) {
            console.log('program id error is' + err);
        } else {
            var marketArrayId = [];
            marketArrayId = data.MarketId;
            for (var i = 0; i < marketArrayId.length; i++) {
                var programmarketvalue = {
                    programid: data.programid,
                    marketid: marketArrayId[i]
                };
                programmarket.create(programmarketvalue, function (err, marketres) {
                    if (err) {
                        console.log("Insertion Error while inserting in market table " + err);
                    }
                });
            }
            insertsecprogrambg(data, callback);

            //return callback({ messagae: "Saved Successfully", status: true, tacticid: tacticid });
        }
    });
}

function insertsecprogrambg(data, callback) {
    var sqlmarket = 'delete from apps.programssecbusinessgroups where programid=' + data.programid;
    console.log(sqlmarket);
    redshift.query(sqlmarket, function (err, scopeId) {
        if (err) {
            console.log('program id error is' + err);
        } else {
            var ArrayId = [];
            ArrayId = data.BusinessGroup;
            for (var i = 0; i < ArrayId.length; i++) {
                var programvalue = {
                    programid: data.programid,
                    businessgroupid: ArrayId[i]
                };
                programbusinessgroups.create(programvalue, function (err, marketres) {
                    if (err) {
                        console.log("Insertion Error while inserting in bg table " + err);
                    }
                });
            }
            insertsecprogrambl(data, callback);

            //return callback({ messagae: "Saved Successfully", status: true, tacticid: tacticid });
        }
    });
}
function insertsecprogrambl(data, callback) {
    var sqlmarket = 'delete from apps.programssecbusinesslines where programid=' + data.programid;
    console.log(sqlmarket);
    redshift.query(sqlmarket, function (err, scopeId) {
        if (err) {
            console.log('program id error is' + err);
        } else {
            var ArrayId = [];
            ArrayId = data.Businessline;
            for (var i = 0; i < ArrayId.length; i++) {
                var programvalue = {
                    programid: data.programid,
                    businesslineid: ArrayId[i]
                };
                programbusinesslines.create(programvalue, function (err, marketres) {
                    if (err) {
                        console.log("Insertion Error while inserting in bg table " + err);
                    }
                });
            }
            insertsecprogrambt(data, callback);

            //return callback({ messagae: "Saved Successfully", status: true, tacticid: tacticid });
        }
    });
}
function insertsecprogrambt(data, callback) {
    var sqlmarket = 'delete from apps.programssecbusinesstype where programid=' + data.programid;
    console.log(sqlmarket);
    redshift.query(sqlmarket, function (err, scopeId) {
        if (err) {
            console.log('program id error is' + err);
        } else {
            var ArrayId = [];
            ArrayId = data.Businesstype;
            for (var i = 0; i < ArrayId.length; i++) {
                var programvalue = {
                    programid: data.programid,
                    businesstypeid: ArrayId[i]
                };
                programtypes.create(programvalue, function (err, marketres) {
                    if (err) {
                        console.log("Insertion Error while inserting in businesstype table " + err);
                    }
                });
            }
            insertsecprogramind(data, callback);

            //return callback({ messagae: "Saved Successfully", status: true, tacticid: tacticid });
        }
    });
}
function insertsecprogramind(data, callback) {
    var sqlmarket = 'delete from apps.programsindustry where programid=' + data.programid;
    console.log(sqlmarket);
    redshift.query(sqlmarket, function (err, scopeId) {
        if (err) {
            console.log('program id error is' + err);
        } else {
            var ArrayId = [];
            ArrayId = data.Industry;
            for (var i = 0; i < ArrayId.length; i++) {
                var programvalue = {
                    programid: data.programid,
                    industryid: ArrayId[i]
                };
                programsindustry.create(programvalue, function (err, marketres) {
                    if (err) {
                        console.log("Insertion Error while inserting in industry table " + err);
                    }
                });
            }
            return callback({ messagae: "Saved Successfully", status: true, data: data });
        }
    });
}
module.exports.getprogramById = function (programid, res) {
    async.parallel([
        function (callback) {
            redshift.query('SELECT * from apps.programs where programid=' + programid, callback)
        },
        function (callback) {
            var SQLBG = 'SELECT a.mastercampaignid,a.mastercampaignname,'
            + ' (case WHEN a.mastercampaignid = (select top 1 mastercampaignid from apps.programs where programid=' + programid + ') then TRUE ELSE FALSE END) as IsSelect '
            + ' FROM apps.mastercampaigns a';
            //console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select pf.programfamiliyid, pf.programfamiliyname,(case WHEN pf.programfamiliyid = (select programfamilyid from apps.programs'
            + ' where programid=' + programid + ') then TRUE ELSE FALSE END) as isselect from apps.programfamilies pf '
            + ' inner join apps.mastercampaignsprogramfamilies cpf on pf.programfamiliyid= cpf.programfamilyid '
            + ' where cpf.mastercampaignid = (select top 1 mastercampaignid from apps.programs where programid=' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            redshift.query('select mca.mcasegmentid,mca.mcasegmentname,(case WHEN mca.mcasegmentid = (select mcasegmentid from apps.programs'
                + ' where programid=' + programid + ') then TRUE ELSE FALSE END) as IsSelect  from apps."mcasegments" mca'
                + ' inner join apps.mastercampaignsmcasegments prg on mca.mcasegmentid=prg.mcasegmentid where prg.mastercampaignid=(select top 1 mastercampaignid from apps.programs where programid=' + programid + ')', callback)
        },
        function (callback) {
            redshift.query('select mar.marketid,mar.marketname,(case when pmar.marketid is null then false else true end) as isselect '
                + ' from apps.market mar left join apps.programsmarket pmar on mar.marketid = pmar.marketid and pmar.programid=' + programid + ' '
                + ' where mar.isactive=1', callback)
        },
        function (callback) {
            var SQLBG = 'select bg.businessgroupid,bg.businessgroupname, (case WHEN bg.businessgroupid = (select businessgroupid from apps.programs'
            + ' where programid=' + programid + ') then TRUE ELSE FALSE END) as IsSelect from apps.businessgroups bg '
            +' inner join apps.mastercampaignsbusinessgroups mbg on bg.businessgroupid = mbg.businessgroupid '
            +' where mbg.mastercampaignid = (select top 1 mastercampaignid from apps.programs where programid=' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.businessgroupid,bg.businessgroupname, (Case when pbg.businessgroupid is null then false else true end) as IsSelect from apps.businessgroups bg '
            +' inner join apps.mastercampaignsbusinessgroups mbg on bg.businessgroupid = mbg.businessgroupid '
            +' left join apps.programssecbusinessgroups pbg on bg.businessgroupid = pbg.businessgroupid and pbg.programid = ' + programid + ''
            +' where mbg.mastercampaignid = (select top 1 mastercampaignid from apps.programs where programid=' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.businesslineid,bg.businesslinename, (case WHEN bg.businesslineid = (select businesslineid from apps.programs'
            + ' where programid=' + programid + ') then TRUE ELSE FALSE END) as IsSelect from apps.businesslines bg '
            +' where bg.businessgroupid = (select top 1 businessgroupid from apps.programs where programid=' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.businesslineid,bg.businesslinename, '
            +'(Case when pbl.businesslineid is null then false else true end) as IsSelect from apps.businesslines bg '            
            +' inner join apps.programssecbusinessgroups pbg on bg.businessgroupid = pbg.businessgroupid and pbg.programid =' + programid + ''
            +' left join apps.programssecbusinesslines pbl on bg.businesslineid = pbl.businesslineid and pbl.programid = ' + programid + '';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.businesstypeid,bg.businesstypename, (case WHEN bg.businesstypeid = (select businesstypeid from apps.programs '
                +' where programid= ' + programid + ') then TRUE ELSE FALSE END) as IsSelect from apps.businesstype bg '
                +' inner join apps.mastercampaignsbusinesstype mbg on bg.businesstypeid = mbg.businesstypeid '
                +' where mbg.mastercampaignid = (select top 1 mastercampaignid from apps.programs where programid= ' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.businesstypeid,bg.businesstypename, (Case when pbg.businesstypeid is null then false else true end) as IsSelect from apps.businesstype bg '
            +' inner join apps.mastercampaignsbusinesstype mbg on bg.businesstypeid = mbg.businesstypeid '
            +' left join apps.programssecbusinesstype pbg on bg.businesstypeid = pbg.businesstypeid and pbg.programid =' + programid + ' '
            +' where mbg.mastercampaignid = (select top 1 mastercampaignid from apps.programs where programid=' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.industryid,bg.industryname, (case WHEN bg.industryid = (select industryid from apps.programs '
            +' where programid=' + programid + ') then TRUE ELSE FALSE END) as IsSelect from apps.industry bg '
            +' where bg.businesstypeid = (select top 1 businesstypeid from apps.programs where programid=' + programid + ')';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
        function (callback) {
            var SQLBG = 'select bg.industryid,bg.industryname, (Case when pbl.industryid is null then false else true end) as IsSelect '
            +' from apps.industry bg   '          
            +' inner join apps.programssecbusinesstype pbg on bg.businesstypeid = pbg.businesstypeid and pbg.programid =' + programid + ''
            +' left join apps.programsindustry pbl on bg.industryid = pbl.industryid and pbl.programid =' + programid + '';
            // console.log(SQLBG);
            redshift.query(SQLBG, callback)
        },
    ],
        function (err, data) {
            if (err) res.render('../views/error/custormerror', { message: err });
            data[0].rows[0].startdate = moment(data[0].rows[0].startdate).format('YYYY-MM-DD');
            data[0].rows[0].enddate = moment(data[0].rows[0].enddate).format('YYYY-MM-DD');
            // console.log(data[0].rows[0].startdate);
            res.render('../views/CST/program',
                {
                    program: data[0].rows[0]
                    , campaign: data[1].rows
                    , programFamily: data[2].rows
                    , MCASegment: data[3].rows
                    , market: data[4].rows
                    , businessgroups: data[5].rows
                    , secbusinessgroups: data[6].rows
                    , businessline: data[7].rows
                    , secbusinessline: data[8].rows
                    , businesstype: data[9].rows
                    , secbusinesstype: data[10].rows
                    , industry: data[11].rows
                    , secIndustry: data[12].rows
                });
        });
};