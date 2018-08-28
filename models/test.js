/* 
var str = "Fixed Networks,Global Services";
if(str.includes(',')){
var str_array = str.split(',');
var sss;
var ppp = "";
for(var i=0; i<str_array.length;i++){
    var s = str_array[i];
    console.log(s);
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
 */


 var sss= require('../models/businessgroupnameinsertion');
 sss.names1();