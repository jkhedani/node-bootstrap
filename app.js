var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var swig = require('swig');
var methodOverride = require('method-override');
var app = express();

// config
var config = require('./config.json')[process.env.NODE_ENV || 'development'];
// If database is needed, uncomment and configure.
//require('./config/database');
require('./config/passport')(passport);

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
// Use swig caching in production only
app.set('view cache', false);
swig.setDefaults({
  cache: config.swig.cache
});

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/dist/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Enable use of delete method in post
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

// If login cookie is needed, uncheck.
// var connection = mongoose.createConnection('mongodb://localhost:27017/econ_model');
// app.use(session({
//   secret: 'econmodelforthewin',
//   store: new MongoStore({
//     mongooseConnection: connection
//   }),
//   // cookie: {
//   //   maxAge: 3600000
//   // }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// Routes
var routes = require('./routes/index.js'); // load our routes and pass in our app and fully configured passport
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
