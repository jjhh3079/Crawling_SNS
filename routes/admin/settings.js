const cwd=process.cwd();
const express = require('express');
const router = express.Router();
const controller=require(cwd+'/controller/admin/report');
const passport = require(cwd+'/config/passport');


router.get('/admin_settings',passport.authenticate('jwt',{session:false}),controller.admin_settings);

module.exports = router;