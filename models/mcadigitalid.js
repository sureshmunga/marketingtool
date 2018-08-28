/* 

exports.mcadigitalid = function (req, res) {
    var CustomNumber = 36;
    var Seperator = 10;
    if (databaseCampaignId < 1) return "0";

    var hex = databaseCampaignId;
    var hexStr = string.Empty;

    while (databaseCampaignId > 0) {
        hex = databaseCampaignId % CustomNumber;

        if (hex < Seperator)
            hexStr = hexStr.Insert(0, Convert.ToChar(hex + 48).ToString());
        else
            hexStr = hexStr.Insert(0, Convert.ToChar(hex + 55).ToString());

        databaseCampaignId /= CustomNumber;
    }

    return hexStr;
}
 */
/* 
 var sri = "10";
 console.log(sri.indexOf(0+48).toString());
 console.log(sri.slice(0,1));
 console.log("char"+String.fromCharCode(97 + 10)) */
 

 var biggerBuffer = new Buffer("10");
var smallerBuffer = new Buffer("1");

var startIndex, endIndex;

startIndex = String.prototype.indexOf.call(biggerBuffer, smallerBuffer);
//endIndex = smallerBuffer.length() + startIndex;

console.log(startIndex);
  

exports.sub = function(id,res){
    console.log("id is" + id);
    var str = "'"+id+"'";
if(str.includes(',')){
var str_array = str.split(',');
var sss;
var ppp = "";
for(var i=0; i<str_array.length;i++){
    var s = str_array[i];
    //s.slice(0,s.length);
    sss = "'" + s + "'," 

    ppp = ppp + sss    
    
}
console.log(sss + 'ppp' + ppp);
var final = ppp;
console.log("final is " + final.substring(1, final.length-2));
console.log("sdf"+ppp.substr(0, ppp.length - 1));

return final;
}else{
    str = str;
    console.log(str);
    return str;
}
}


exports.sub1 = function(id,res){
    console.log("id is" + id);
    var str = "'"+id+"'";
if(str.includes(',')){
var str_array = str.split(',');
var sss;
var ppp = "";
for(var i=0; i<str_array.length;i++){
    var s = str_array[i];
    //s.slice(0,s.length);
    sss = "'" + s + "'," 

    ppp = ppp + sss    
    
}
console.log(sss + 'ppp' + ppp);
var final = ppp;
console.log("final is " + final.substring(1, final.length-2));
console.log("sdf"+ppp.substr(0, ppp.length - 1));

return final;
}else{
    str = str;
    console.log(str);
    return str;
}
}

