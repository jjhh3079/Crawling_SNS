const cwd = process.cwd();
const express = require('express');
const router = express.Router();
const passport = require(cwd+'/config/passport');
const controller = require(cwd+'/controller/admin/auth');

//admin/new_pw
router.get('/new_pw',(req,res)=>{
  res.redirect('/new_pw');
});
router.post('/new_pw',passport.authenticate('jwt',{session:false}),controller.new_pw);

module.exports = router;