var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var que = require('./models/userRedshift');
var redshiftClient = require('./redshift.js');
var redshift = require('./redshift.js');



//mongoose.connect('mongodb://localhost/loginapp');
//var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var cst = require('./routes/masterCampaignRoute');
var tactic= require('./routes/tacticRoute');
// Init App
var app = express();

/* app.get('/sss',function(req,res){
	var pp = que.getUserByUsernamezzz();
	pp.then(function(data){
		res.send('<>'+data+'<>');
	});
}); */
// View Engine
app.set('views', path.join(__dirname, 'views'));
//app.engine('handlebars', exphbs({ defaultLayout: 'layoutOrig' }));
app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({
  //extname: 'handlebars', 
  defaultLayout: 'layoutOrig', 
  layoutsDir: __dirname + '/views/layouts',
  partialsDir  : [
      //  path to your partials
      __dirname + '/views/partials',
  ]
}));


var hbs = exphbs.create({
  helpers: {
      foo: function () { return 'FOO!'; },
      bar: function () { return 'BAR!'; },
      if_eq: function(a, opts){ 
        if(a==true)
          return opts.fn(this);
        else
          return opts.inverse(this);
      },
      compare: function (lvalue, operator, rvalue, options) {

          var operators, result;
      
          if (arguments.length < 3) {
              throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
          }
      
          if (options === undefined) {
              options = rvalue;
              rvalue = operator;
              operator = "===";
          }
      
          operators = {
              '==': function (l, r) { return l == r; },
              '===': function (l, r) { return l === r; },
              '!=': function (l, r) { return l != r; },
              '!==': function (l, r) { return l !== r; },
              '<': function (l, r) { return l < r; },
              '>': function (l, r) { return l > r; },
              '<=': function (l, r) { return l <= r; },
              '>=': function (l, r) { return l >= r; },
              'typeof': function (l, r) { return typeof l == r; }
          };
      
          if (!operators[operator]) {
              throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
          }
      
          result = operators[operator](lvalue, rvalue);
      
          if (result) {
              return options.fn(this);
          } else {
              return options.inverse(this);
          }
      
      }
  }
});


// hbs.registerHelper('if_eq', function(a, b, opts) {
//   if(a == b)
//       return opts.fn(this);
//   else
//       return opts.inverse(this);
// });

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();

});



app.use('/', routes);
app.use('/users', users);
app.use('/cst', cst);

app.use('/tactic', tactic);
// Set Port
app.set('port', (process.env.PORT || 4000));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});
