module.exports.getDID = function(value, callback){
    var ids = parseInt(value);
    var x = ('00000' + ids.toString(36).toUpperCase()).slice(-5);
    var hex = x.toString().slice(-5);
    return hex;
};