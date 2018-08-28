var Redshift = require('node-redshift');

//var person = require('../models/user.js');



var client = {
  user: 'admin',
  database: 'aae',
  password: 'sM04162018#mp',
  port: '5439',
  host: 'mpaae.cr14an0cfdzd.us-east-1.redshift.amazonaws.com'
};

// The values passed in to the options object will be the difference between a connection pool and raw connection
var redshiftClient = new Redshift(client, {raw: true});

module.exports = redshiftClient;

//var person = redshiftClient.import("./models/user.js");
//redshiftClient.models = {};
//redshiftClient.models.user = person;

//module.exports = redshift;
