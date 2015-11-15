
/**
 * Module dependencies
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var favicon = require('serve-favicon');
var http = require('http');
var path = require('path');

var routes = require('./routes/index');
var oauthRoute = require('./routes/oauth');

var app = module.exports = express();

/**
 * Configuration
 */

 // view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// all environments
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

 app.use('/', routes);
 app.use('/', oauthRoute);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
