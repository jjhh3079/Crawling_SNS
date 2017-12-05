const cwd = process.cwd();
const express = require('express');
const router = express.Router();
const passport = require(cwd+'/config/passport');
const controller = require(cwd+'/controller/user/auth');
const jwt = require('jsonwebtoken');
const config=require(cwd+'/config/secret');
// const isAuthenticated = function (req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/login');
// };

//메인 화면 겸 로그인 페이지
router.get('/',(req,res)=>{
  res.render('main');
});
router.get('/signin',(req,res)=>{
  res.render('signin');
});
router.get('/logout',(req,res)=>{
  res.clearCookie("jwt");
  res.redirect('/');
});
router.get('/find_pw',(req,res)=>{
  res.render('find_pw');
});
//새 비밀번호 찾기페이지
router.get('/new_pw',controller.new_pw_page);
router.post('/new_pw',controller.new_pw);

router.get('/email_verify',controller.email_verify);

router.post('/signin',controller.signin);
router.post('/login',controller.login);
router.post('/find_pw',controller.find_pw);

router.get('/settings',passport.authenticate('jwt',{session:false}),controller.settings_view);
router.post('/setting/event',passport.authenticate('jwt',{session:false}),controller.setting_event_view);
router.post('/setting/hotdeal',passport.authenticate('jwt',{session:false}),controller.setting_hotdeal_view);
router.post('/setting/alarm',passport.authenticate('jwt',{session:false}),controller.setting_alarm);


module.exports = router;