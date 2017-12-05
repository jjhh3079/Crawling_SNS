const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport =require('passport');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
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
const report=require('./routes/user/report');

const admin_account=require('./routes/admin/account_management');
const admin_auth=require('./routes/admin/auth');
const admin_board= require('./routes/admin/board_management');
const admin_contact=require('./routes/admin/contact');
const admin_main=require('./routes/admin/main');
const admin_setting=require('./routes/admin/settings');
const admin_report=require('./routes/admin/report');

app.use('/admin/account',admin_account);
app.use('/admin/board',admin_board);
app.use('/admin/contact',admin_contact);
app.use('/admin',admin_main);
app.use('/admin',admin_auth);
app.use('/admin/settings',admin_setting);
app.use('/admin/account/report',admin_report);

app.use('/',auth);
app.use('/main',main);
app.use('/contact',contact);
app.use('/event',event);
app.use('/hotdeal',hotdeal);
app.use('/tracking',tracking);
app.use('/report',report);

const schedule=require('node-schedule');
const eleven=require('./controller/crawling/event_eleven');
const ppomppu=require('./controller/crawling/hotdeal_ppomppu');
const coolenjoy=require('./controller/crawling/hotdeal_coolenjoy');
const tmon=require('./controller/crawling/event_tmon');

let rule = new schedule.RecurrenceRule();
rule.minute = 30;
const s_eleven=  schedule.scheduleJob(rule,eleven.crawling_event_eleven);
const s_tmon=  schedule.scheduleJob(rule,tmon.crawling_event_tmon);
const s_ppomppu=  schedule.scheduleJob(rule,ppomppu.crawling_hotdeal_ppomppu);
const s_coolenjoy=  schedule.scheduleJob(rule,coolenjoy.crawling_hotdeal_coolenjoy);

app.post('/admin/reschedule',(req,res)=>{
  let new_rule = new schedule.RecurrenceRule();
  new_rule.minute=req.body.minute;
  if(s_eleven.nextInvocation()){
    s_eleven.cancel();
    schedule.scheduleJob(new_rule,eleven.crawling_event_eleven);
  }
  if(s_tmon.nextInvocation()){
    s_tmon.cancel();
    schedule.scheduleJob(new_rule,tmon.crawling_event_tmon);
  }
  if(s_ppomppu.nextInvocation()){
    s_ppomppu.cancel();
    schedule.scheduleJob(new_rule,ppomppu.crawling_hotdeal_ppomppu);
  }
  if(s_coolenjoy.nextInvocation()){
    s_coolenjoy.cancel();
    schedule.scheduleJob(new_rule,coolenjoy.crawling_hotdeal_coolenjoy);
  }
  res.redirect('/admin');
});
app.get('/admin/cancel/:id',(req,res)=>{
  const id=req.params.id;
  switch (id){
    case 0:
      if(s_eleven.nextInvocation())
        s_eleven.cancel();
      break;
    case 1:
      if(s_tmon.nextInvocation())
        s_tmon.cancel();
      break;
    case 2:
      if(s_ppomppu.nextInvocation())
        s_ppomppu.cancel();
      break;
    case 3:
      if(s_coolenjoy.nextInvocation())
        s_coolenjoy.cancel();
      break;
  }
  res.redirect('/admin');
});
app.get('/admin/resume/:id',(req,res)=>{
  const id=req.params.id;
  switch (id){
    case 0:
      if(!s_eleven.nextInvocation())
        s_eleven.reschedule();
      break;
    case 1:
      if(!s_tmon.nextInvocation())
        s_tmon.reschedule();
      break;
    case 2:
      if(!s_ppomppu.nextInvocation())
        s_ppomppu.reschedule();
      break;
    case 3:
      if(!s_coolenjoy.nextInvocation())
        s_coolenjoy.reschedule();
      break;
  }
  res.redirect('/admin');
});

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
