const cwd=process.cwd();
const express = require('express');
const router = express.Router();
const passport = require(cwd+'/config/passport');

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
  res.render('admin/overview');
});

module.exports = router;