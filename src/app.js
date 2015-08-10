'use strict';

// Loading dependencies
var express = require('express');
var path = require('path');

// Initializing express application
var app = express();

// Loading Config
var config = require('./lib/config');
//console.log('Configuration', config().views);

// Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Logger
var logger = require('morgan');
app.use(logger('dev'));

// Cookies / Session
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// Layout setup
var exphbs = require('express-handlebars');

// Sass setup
var sass = require('node-sass');
//var nib = require('nib');

// Handlebars setup
app.engine(config().views.engine, exphbs({
    extname: config().views.extension,
    defaultLayout: config().views.layout,
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', config().views.engine);
app.use(express.static(path.join(__dirname, 'public')));

// Routes
var home = require('./routes/home');
var users = require('./routes/users');

app.use('/', home);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// try conection as400

var Database = require('jt400');
var database = new Database();

var config = {
  libpath: __dirname + '/config/lib/jt400.jar',
  drivername: 'com.ibm.as400.access.AS400JDBCDriver',
  url: 'jdbc:as400://mcbo.seguroscatatumbo.com/productest;user=webusr;password=webusr'
};

database.initialize(config);

// SELECT statements must be run with execute()
database.execute('SELECT cedrif FROM productest.lcpf20 where zoncob=0101');

database.on('execute', function(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(results);
  }
});

//INSERT and UPDATE statements must be run with executeUpdate()
/*database.executeUpdate('INSERT INTO foo (bar) VALUES ("bar")');

database.on('executeUpdate', function(error, rowCount) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(rowCount);
  }
});
*/
// end try conection





// Export application or start the server
if (!!module.parent) {
  module.exports = app;
} else {
  app.listen(config().serverPort);
}
