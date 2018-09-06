

module.exports.getDID = function(value, callback){
    var hex = ('00000' + value.toString(32).toUpperCase()).slice(-5);
    return hex;
};