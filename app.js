const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport =require('passport');

const app = express();
// view engine setup

app.set('view engine', 'ejs');
// log & express setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

const main = require('./routes/user/main');
const auth = require('./routes/user/auth');
const contact = require('./routes/user/contact');
const hotdeal = require('./routes/user/hotdeal');
const event = require('./routes/user/event');
const tracking =require('./routes/user/tracking');

const admin_account=require('./routes/admin/account_management');
const admin_auth=require('./routes/admin/auth');
const admin_board= require('./routes/admin/board_management');
const admin_contact=require('./routes/admin/contact');
const admin_main=require('./routes/admin/main');

app.use('/admin/account',admin_account);
app.use('/admin/board',admin_board);
app.use('/admin/contact',admin_contact);
app.use('/admin',admin_main);
app.use('/admin',admin_auth);

app.use('/',auth);
app.use('/main',main);
app.use('/contact',contact);
app.use('/event',event);
app.use('/hotdeal',hotdeal);
app.use('/tracking',tracking);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
