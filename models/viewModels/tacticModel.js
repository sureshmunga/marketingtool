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
var utilhelpers = require("../utilhelper.js")

module.exports.gettactic = function (req, res) {
    //console.log('User Login '+ login.username);
    async.parallel([
      function (callback) { 
          redshift.query('SELECT a.mastercampaignid,a.mastercampaignname FROM apps."mastercampaigns" a', callback) 
        }  
    ], 
    function (err, results) {
        //console.log('Campaign Rows');
        // console.log(JSON.stringify(results[0].rows));
        res.render('../views/CST/tactic', { campaign: results[0].rows });
    });
};
module.exports.gettacticbyid = function (tacticid, res) {    
    async.parallel([
        function (callback) { 
            redshift.query('SELECT tac.tacticid,tac.tacticname,tac.tacticdescription,tac.status,tac.createdby,tac.startdate,tac.enddate,tac.tcampaigndigitalid'
            +' ,tac.tactictypeid,tac.vendor,tac.namingconvention,tac.businessgroupid,tac.businesslineid,tac.programid,tac.mcasegmentid'
            +' , tac.programjobid,tac.businesstypeid,tac.industryid,prg.mastercampaignid '
            +' from apps.tactic tac inner join apps.programs prg on tac.programid=prg.programid '
            +' where tacticid='+tacticid, callback) 
        },
        function (callback) { 
            redshift.query('SELECT a.mastercampaignid,a.mastercampaignname,(case WHEN a.mastercampaignid = (select top 1 prg.mastercampaignid from apps.tactic tac inner join apps.programs prg on tac.programid=prg.programid'
                +' where tacticid='+tacticid+') then TRUE ELSE FALSE END) as IsSelect  FROM apps.mastercampaigns a', callback) 
        } ,
        function (callback) { 
            redshift.query('SELECT programid,programname,(case WHEN programid = (select programid from apps.tactic'
            +' where tacticid='+tacticid+') then TRUE ELSE FALSE END) as IsSelect FROM apps.programs'
            +' where mastercampaignid = ( SELECT prg.mastercampaignid FROM apps.programs prg '
            +' inner join apps.tactic tac on prg.programid=tac.programid where tac.tacticid='+tacticid+')', callback) 
        } , 
        function (callback) {
            redshift.query('select tactictypeId,tactictypeName,(case WHEN tactictypeId = (select tactictypeId from apps.tactic'
            +' where tacticid='+tacticid+') then TRUE ELSE FALSE END) as IsSelect from apps.tactictypes',callback)
        },
        function (callback) { 
            redshift.query('select job.ProgramJobId,job.pfamilyjobname,(case WHEN job.ProgramJobId = (select ProgramJobId from apps.tactic'
            +' where tacticid='+tacticid+') then TRUE ELSE FALSE END) as IsSelect from apps."programfamilyjobs" job'
            +' inner join apps."programs" prg on job.programfamilyid=prg.programfamilyid '
            +' where prg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')', callback) 
          },
        function (callback) { 
            redshift.query('select mca.mcasegmentid,mca.mcasegmentname,(case WHEN mca.mcasegmentid = (select mcasegmentid from apps.tactic'
            +' where tacticid='+tacticid+') then TRUE ELSE FALSE END) as IsSelect from apps."mcasegments" mca'
            +' inner join apps."programs" prg on mca.mcasegmentid=prg.mcasegmentid '
            +' where prg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')', callback) 
          },
        function (callback) { 
            redshift.query('select mar.marketid,mar.marketname,(CASE WHEN tm.marketid is null THEN FALSE ELSE TRUE END) AS isselect'
            +' from apps.market mar inner join apps.programsmarket marprg on mar.marketid = marprg.marketid '
            +' left join (select marketid from apps.tacticmarket where tacticid='+tacticid+') as tm on mar.marketid = tm.marketid '
            +' where marprg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')', callback) 
          },
        function (callback) { 
            var SQLBG = 'select TT.businessgroupid, TT.businessgroupname, CASE WHEN TT.businessgroupid = (SELECT tac.businessgroupid FROM apps.tactic tac where tac.tacticid=2) THEN TRUE ELSE FALSE END as isselect '
            +' from (select bg.businessgroupid,bg.businessgroupname from apps.businessgroups bg '
            +' inner join apps.programs prg on bg.businessgroupid = prg.businessgroupid '
            +' where prg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')'
            +' UNION'
            +' select bg.businessgroupid,bg.businessgroupname from apps.businessgroups bg '
            +' inner join apps.programssecbusinessgroups prgbg on bg.businessgroupid=prgbg.businessgroupid '
            +' where prgbg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')) as TT';
            redshift.query(SQLBG, callback) 
          },
        function (callback) { 
            var statement ='select TT.businesslineid, TT.businesslinename, CASE WHEN TT.businesslineid = (SELECT tac.businesslineid FROM apps.tactic tac where tac.tacticid=2) THEN TRUE ELSE FALSE END as isselect '
            +' from (select bg.businesslineid,bg.businesslinename from apps.businesslines bg '
            +' inner join apps.programs prg on bg.businesslineid = prg.businesslineid '
            +' where bg.businessgroupid=(SELECT tac.businessgroupid FROM apps.tactic tac where tac.tacticid='+tacticid+') '
            +' and prg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')'
            +' UNION'
            +' select bg.businesslineid,bg.businesslinename from apps.businesslines bg '
            +' inner join apps.programssecbusinesslines prgbg on bg.businesslineid=prgbg.businesslineid '
            +' where bg.businessgroupid=(SELECT tac.businessgroupid FROM apps.tactic tac where tac.tacticid='+tacticid+')'
            +' and prgbg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')) as TT';
            redshift.query(statement, callback) 
          },
        function (callback) { 
            var SQLBT = 'select TT.businesstypeid, TT.businesstypename, CASE WHEN TT.businesstypeid = (SELECT tac.businesstypeid FROM apps.tactic tac where tac.tacticid=2) THEN TRUE ELSE FALSE END as isselect '
            + ' from (select bg.businesstypeid,bg.businesstypename from apps.businesstype bg '
            +' inner join apps.programs prg on bg.businesstypeid = prg.businesstypeid '
            +' where prg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')'
            +' UNION'
            +' select bg.businesstypeid,bg.businesstypename from apps.businesstype bg '
            +' inner join apps.programssecbusinesstype prgbg on bg.businesstypeid=prgbg.businesstypeid '
            +' where prgbg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')) as TT';
            redshift.query(SQLBT, callback) 
          },
        function (callback) { 
            var statement ='select TT.industryid, TT.industryname, CASE WHEN TT.industryid = (SELECT tac.industryid FROM apps.tactic tac where tac.tacticid=2) THEN TRUE ELSE FALSE END as isselect '
            +' from (select bg.industryid,bg.industryname from apps.industry bg '
            +' inner join apps.programs prg on bg.industryid = prg.industryid '
            +' where bg.businesstypeid=(SELECT tac.businesstypeid FROM apps.tactic tac where tac.tacticid='+tacticid+') '
            +' and prg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')'
            +' UNION'
            +' select bg.industryid,bg.industryname from apps.industry bg '
            +' inner join apps.programsindustry prgbg on bg.industryid=prgbg.industryid '
            +' where bg.businesstypeid=(SELECT tac.businesstypeid FROM apps.tactic tac where tac.tacticid='+tacticid+') '
            +' and prgbg.programid=(SELECT tac.programid FROM apps.tactic tac where tac.tacticid='+tacticid+')) as TT';
            redshift.query(statement, callback) 
          }
          
    ], 
    function (err, data) {
        res.render('../views/CST/tactic', 
        {   tactic : data[0].rows[0]
            , campaign: data[1].rows 
            , program:data[2].rows
            , tactictype:data[3].rows
            , programjob:data[4].rows
            , MCASegment:data[5].rows
            , market:data[6].rows
            , BusinessGroup:data[7].rows
            , BusinessLine:data[8].rows
            , BusinessType : data[9].rows
            , Industry : data[10].rows
        });
    });
};

module.exports.gettacticall = function (req, res) {
    async.parallel([
      function (callback) { 
          redshift.query('SELECT tacticid,tacticname,status,createdby,startdate,enddate,tcampaigndigitalid from apps.tactic', callback) 
        }  
    ], 
    function (err, results) {
        res.render('../views/CST/tacticlist', { tacticlist: results[0].rows });
    });
};

module.exports.programlst = function(campaignId, callback){    
    async.parallel([
        function (callback) { 
            redshift.query('SELECT a.programid,a.programname,false as isselect FROM apps."programs" a where a.mastercampaignid='+campaignId, callback) 
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
            redshift.query('select job.ProgramJobId,job.pfamilyjobname,false as isselect from apps."programfamilyjobs" job'
            +' inner join apps."programs" prg on job.programfamilyid=prg.programfamilyid where prg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select mca.mcasegmentid,mca.mcasegmentname,false as isselect from apps."mcasegments" mca'
            +' inner join apps."programs" prg on mca.mcasegmentid=prg.mcasegmentid where prg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select mar.marketid,mar.marketname,false as isselect from apps."market" mar '
            +' inner join apps."programsmarket" marprg on mar.marketid = marprg.marketid where marprg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.businessgroupid,bg.businessgroupname,false as isselect from apps.businessgroups bg '
            +' inner join apps.programs prg on bg.businessgroupid = prg.businessgroupid where prg.programid='+programId+''
            +' UNION'
            +' select bg.businessgroupid,bg.businessgroupname,false as isselect from apps.businessgroups bg '
            +' inner join apps.programssecbusinessgroups prgbg on bg.businessgroupid=prgbg.businessgroupid '
            +' where prgbg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.businesslineid,bg.businesslinename,false as isselect from apps.businesslines bg '
            +' inner join apps.programs prg on bg.businesslineid = prg.businesslineid where prg.programid='+programId+''
            +' UNION'
            +' select bg.businesslineid,bg.businesslinename,false as isselect from apps.businesslines bg '
            +' inner join apps.programssecbusinesslines prgbg on bg.businesslineid=prgbg.businesslineid '
            +' where prgbg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.businesstypeid,bg.businesstypename,false as isselect from apps.businesstype bg '
            +' inner join apps.programs prg on bg.businesstypeid = prg.businesstypeid where prg.programid='+programId+''
            +' UNION'
            +' select bg.businesstypeid,bg.businesstypename,false as isselect from apps.businesstype bg '
            +' inner join apps.programssecbusinesstype prgbg on bg.businesstypeid=prgbg.businesstypeid '
            +' where prgbg.programid='+programId, callback) 
          },
        function (callback) { 
            redshift.query('select bg.industryid,bg.industryname,false as isselect from apps.industry bg '
            +' inner join apps.programs prg on bg.industryid = prg.industryid where prg.programid='+programId+''
            +' UNION'
            +' select bg.industryid,bg.industryname,false as isselect from apps.industry bg '
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
            var statement ='select bg.industryid,bg.industryname,false as isselect from apps.industry bg '
            +' inner join apps.programs prg on bg.industryid = prg.industryid '
            +' where bg.businesstypeid='+data.BTId+' and prg.programid='+data.ProgramId+''
            +' UNION'
            +' select bg.industryid,bg.industryname,false as isselect from apps.industry bg '
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
            var statement ='select bg.businesslineid,bg.businesslinename,false as isselect from apps.businesslines bg '
            +' inner join apps.programs prg on bg.businesslineid = prg.businesslineid '
            +' where bg.businessgroupid='+data.BGId+' and prg.programid='+data.ProgramId+''
            +' UNION'
            +' select bg.businesslineid,bg.businesslinename,false as isselect from apps.businesslines bg '
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
    
    if(data.tacticid=="" || data.tacticid=="/"){
        data.tacticid = "0";
        tacticdata.createdby=data.user;
        tacticdata.createddate=moment().format("YYYY-MM-DD");
    }
    else{
        tacticdata.updatedby=data.user;
        tacticdata.updateddate=moment().format("YYYY-MM-DD");
    }
    console.log(JSON.stringify(tacticdata));
    if(data.tacticid=="" || data.tacticid == "/" || data.tacticid == "0" || data.tacticid == undefined) 
    {
        tacticviewmodel.create(tacticdata, function (err, result) {
            if (err) {
              console.log("error is " + err);
            } 
            else 
            {
                var SQLStatement = "SELECT ISNULL(Max(tacticid),0) as tacticid from apps.tactic where createdby='"+data.user+"'";
                redshift.query(SQLStatement, function(err, scopeId){
                    if (err) {
                        console.log('tactic id error is' + err);
                    } else {
                        console.log('tactic id ' + JSON.stringify(scopeId.rows[0].tacticid));
                        data.tacticid = scopeId.rows[0].tacticid;
                        updateinsertmarket(data.tacticid,data, callback);
                    }
                }); 
                return;
            }
          });
    }
    else{
        tacticviewmodel.update(tacticdata, function (err, result) {
            if (err) {
              console.log("error is " + err);
            } 
            else 
            {
                updateinsertmarket(data.tacticid,data, callback);
                return;
            }
          });
    }
};

function updateinsertmarket(tacticid,data, callback){
    
    var tdigitalid = 'T'+utilhelpers.getDID(tacticid);
    console.log(tdigitalid);
    var sqldid = "update apps.tactic set tcampaigndigitalid='"+tdigitalid+"' where tacticid="+tacticid;
    console.log(sqldid);
    redshift.query(sqldid,function(err){
        if(err) console.log('while updating tcampaigndigital id error throws : '+ err);
    });
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
            return callback({messagae : "Saved Successfully", status : true, tacticid:tacticid});
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