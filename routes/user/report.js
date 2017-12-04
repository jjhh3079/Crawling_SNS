const cwd=process.cwd();
const express = require('express');
const router = express.Router();
const controller=require(cwd+'/controller/user/report');
const passport = require(cwd+'/config/passport');

router.get('/:id',passport.authenticate('jwt',{session:false}),controller.report);
router.post('/',passport.authenticate('jwt',{session:false}),controller.report_insert);
module.exports = router;