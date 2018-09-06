module.exports.getDID = function(value, callback){
    var x = ('00000' + value.toString(32).toUpperCase()).slice(-5);
    var hex = x.toString().slice(-5);
    console.log(hex);
    return hex;
};

module.exports.getFormat = function(value, callback){
    var x = ('00000' + value).slice(-5);
    var hex = x.toString().slice(-5);
    console.log(hex);
    return hex;
};