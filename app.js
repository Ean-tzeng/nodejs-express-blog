var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var timestamp = require('mongoose-timestamp');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var session = require('express-session');
var routes = require('./routes/index');
var UserModel = require('./model/User');
var flash = require('connect-flash');
//var users = require('./routes/users');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session( {secret: 'watercool',resave: true,saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
//建立passport-local-strategy
passport.use(new Strategy(
  function(username, password, cb) {
		console.log('成功使用passport-local');
		var userlist = UserModel.find().exec().then(function(user){
			console.log(user);
		})
    UserModel.getUserByUsername(username, function(err, user) {
      if (err) { 
				console.log('error');
				return cb(err); 
			}
      if (!user) {
				console.log('unknow username');
				return cb(null, false, {message: 'unknow username'}); 
			}
      if (user.password != password) {
				console.log('password is wrong')
				return cb(null, false, {message: 'password is wrong'}); 
			}
      return cb(null, user);
    });
  }));
//處理session
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  UserModel.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


//連接資料庫
mongoose.connect('mongodb://zero:zero1234@ds019926.mlab.com:19926/zero-to-blog');
mongoose.connection.on('error',function(err){
  console.log(err);
});

app.use('/', routes);
//app.use('/users', users);

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
