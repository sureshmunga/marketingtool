var redshift = require('../../redshift.js');
var async = require("async");
var moment = require('moment');
var sql = require('sql-bricks-sqlite');
var sql1 = require('sql-bricks-postgres');
var select = sql.select(), $in = sql.in;
var mcaselect = sql.select();
var businesstypeselect = sql.select();
var tacticviewmodel = redshift.import('./models/tactic.js');
var tacticmarket = redshift.import('./models/tacticmarket.js');
var programFamilySelect = sql.select();

module.exports.list = function (req, res) {
    //console.log('User Login '+ login.username);
    async.parallel([
      function (callback) { 
          redshift.query('SELECT a.mastercampaignid,a.mastercampaignname FROM apps."mastercampaigns" a', callback) 
        }  
    ], 
    function (err, results) {
        // console.log('Campaign Rows');
        // console.log(JSON.stringify(results[0].rows));
        res.render('../views/CST/tactic', { campaign: results[0].rows });
    });
};
module.exports.programlst = function(campaignId, callback){    
    async.parallel([
        function (callback) { 
            redshift.query('SELECT a.programid,a.programname FROM apps."programs" a where a.mastercampaignid='+campaignId, callback) 
          },
        function (callback) {
            redshift.query('select tactictypeId,tactictypeName from apps.tactictypes',callback)
        }
      ], 
      function (err, data) {
            if(err){
                console.log(err);
            } else{
                return callback({program:data[0].rows,tactictype:data[1].rows});
            }
      });
};

module.exports.onprogramchange = function(programId, callback){    
    async.parallel([
        function (callback) { 
            redshift.query('select job.ProgramJobId,job.pfamilyjobname from apps."programfamilyjobs" job'
            +' inner join apps."programs" prg on job.programfamilyid=prg.programfamilyid where prg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select mca.mcasegmentid,mca.mcasegmentname from apps."mcasegments" mca'
            +' inner join apps."programs" prg on mca.mcasegmentid=prg.mcasegmentid where prg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select mar.marketid,mar.marketname from apps."market" mar '
            +' inner join apps."programsmarket" marprg on mar.marketid = marprg.marketid where marprg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.businessgroupid,bg.businessgroupname from apps.businessgroups bg '
            +' inner join apps.programs prg on bg.businessgroupid = prg.businessgroupid where prg.programid='+programId+''
            +' UNION'
            +' select bg.businessgroupid,bg.businessgroupname from apps.businessgroups bg '
            +' inner join apps.programssecbusinessgroups prgbg on bg.businessgroupid=prgbg.businessgroupid '
            +' where prgbg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.businesslineid,bg.businesslinename from apps.businesslines bg '
            +' inner join apps.programs prg on bg.businesslineid = prg.businesslineid where prg.programid='+programId+''
            +' UNION'
            +' select bg.businesslineid,bg.businesslinename from apps.businesslines bg '
            +' inner join apps.programssecbusinesslines prgbg on bg.businesslineid=prgbg.businesslineid '
            +' where prgbg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.businesstypeid,bg.businesstypename from apps.businesstype bg '
            +' inner join apps.programs prg on bg.businesstypeid = prg.businesstypeid where prg.programid='+programId+''
            +' UNION'
            +' select bg.businesstypeid,bg.businesstypename from apps.businesstype bg '
            +' inner join apps.programssecbusinesstype prgbg on bg.businesstypeid=prgbg.businesstypeid '
            +' where prgbg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.industryid,bg.industryname from apps.industry bg '
            +' inner join apps.programs prg on bg.industryid = prg.industryid where prg.programid='+programId+''
            +' UNION'
            +' select bg.industryid,bg.industryname from apps.industry bg '
            +' inner join apps.programsindustry prgbg on bg.industryid=prgbg.industryid '
            +' where prgbg.programid='+programId, callback) 
          }
      ], 
      function (err, data) {
            if(err){
                console.log(err);
            } else{
                return callback({programjob:data[0].rows
                    , MCASegment:data[1].rows
                    , market:data[2].rows
                    , BusinessGroup:data[3].rows
                    , BusinessLine:data[4].rows
                    , BusinessType : data[5].rows
                    , Industry : data[6].rows
                });
            }
      });      
};
module.exports.onbtchange = function(data,res, callback){
    async.parallel([
        function (callback) { 
            var statement ='select bg.industryid,bg.industryname from apps.industry bg '
            +' inner join apps.programs prg on bg.industryid = prg.industryid '
            +' where bg.businesstypeid='+data.BTId+' and prg.programid='+data.ProgramId+''
            +' UNION'
            +' select bg.industryid,bg.industryname from apps.industry bg '
            +' inner join apps.programsindustry prgbg on bg.industryid=prgbg.industryid '
            +' where bg.businesstypeid='+data.BTId+' and prgbg.programid='+data.ProgramId;
            console.log(statement);

            redshift.query(statement, callback) 
          }
      ], 
      function (err, data) {
            if(err){
                console.log(err);
            } else{
                return callback({BusinessLine:data[0].rows});
            }
      });
};
module.exports.onbgchange = function(data,res, callback){
    //console.log(JSON.stringify(data));
    async.parallel([
        function (callback) { 
            var statement ='select bg.businesslineid,bg.businesslinename from apps.businesslines bg '
            +' inner join apps.programs prg on bg.businesslineid = prg.businesslineid '
            +' where bg.businessgroupid='+data.BGId+' and prg.programid='+data.ProgramId+''
            +' UNION'
            +' select bg.businesslineid,bg.businesslinename from apps.businesslines bg '
            +' inner join apps.programssecbusinesslines prgbg on bg.businesslineid=prgbg.businesslineid '
            +' where bg.businessgroupid='+data.BGId+' and prgbg.programid='+data.ProgramId;
            //console.log(statement);

            redshift.query(statement, callback) 
          }
      ], 
      function (err, data) {
            if(err){
                console.log(err);
            } else{
                return callback({BusinessLine:data[0].rows});
            }
      });
};

module.exports.ontacticsave = function(data, res, callback){
    
    //tacticid : data.TacticId
    var tacticdata  = {
          tacticName: data.Name
        , tacticDescription: data.TacticDescription
        , status: data.status
        , startDate: data.StartDate
        , endDate: data.EndDate
        , tacticTypeId: data.TacticTypeId
        , vendor:data.Vendor
        , businessgroupid: data.BusinessGroupId
        , businesslineid : data.BusinessLineId
        , isactive : "1"
        , businesstypeid : data.BusinessTypeId
        , industryid : data.IndustryId
        , programid : data.ProgramId
        , mcasegmentid : data.MCASegmentId
        , programjobid : data.ProgramJobId
        , clientId : data.clientId
    };
    if(data.tacticid==""){
        tacticdata.createdby=data.user;
        tacticdata.createddate=moment().format("YYYY-MM-DD");
    }
    else{
        tacticdata.updatedby=data.user;
        tacticdata.updateddate=moment().format("YYYY-MM-DD");
    }
    console.log('tactic save' + JSON.stringify(data));
    console.log('tactic save on ' + JSON.stringify(tacticdata));
    tacticviewmodel.create(tacticdata, function (err, result) {
        if (err) {
          console.log("error is " + err);
        } 
        else 
        {
            if(data.tacticid=="" || data.tacticid == "0" || data.tacticid == undefined) 
            {
                var SQLStatement = "SELECT ISNULL(Max(tacticid),0) as tacticid from apps.tactic where createdby='"+data.user+"'";
                console.log(SQLStatement);
                redshift.query(SQLStatement, function(err, scopeId){
                    if (err) {
                        console.log('tactic id error is' + err);
                    } else {
                        console.log('tactic id ' + JSON.stringify(scopeId.rows[0].tacticid));
                        data.tacticid = scopeId.rows[0].tacticid;
                        updateinsertmarket(data.tacticid,data, callback);
                    }
                }); 
            }
            else {//(tacticdata.tacticid != "0" && tacticdata.tacticid != "" && tacticdata.tacticid !=undefined){
                updateinsertmarket(data.tacticid,data, callback);
            }

            return;
        }
      });

    
};
function updateinsertmarket(tacticid,data, callback){
    var sqlmarket = 'delete from apps.tacticmarket where tacticid='+tacticid;
    console.log(sqlmarket);
    redshift.query(sqlmarket, function(err, scopeId){
        if (err) {
            console.log('tactic id error is' + err);
        } else {
            var marketArrayId = [];
            marketArrayId = data.MarketId;
            console.log('market id '+JSON.stringify(marketArrayId));
            for (var i = 0; i < marketArrayId.length; i++) 
            {
                var tacticmarketvalue = {
                    tacticid : tacticid,
                    marketid : marketArrayId[i]
                };
                tacticmarket.create(tacticmarketvalue,function(err,marketres){
                    if(err){
                        console.log("Insertion Error while inserting in tactic market table "+ err);
                    }                    
                });
            }
            return callback({messagae : "Saved Successfully", status : true});
        }
    });
}
function gettacticId(loginUser,callback){
    
    async.parallel([
        function (callback) { 
            var SQLStatement = "SELECT ISNULL(Max(tacticid),0) as tacticid from apps.tactic where createdby='"+loginUser+"'";
            console.log(SQLStatement);
            redshift.query(SQLStatement, callback) 
          }
      ], 
      function (err, data) {
            if(err){
                console.log(err);
            } else{
                console.log(JSON.stringify(data));
                return callback({tacticid : data[0].rows[0].tacticid});
            }
      });
}