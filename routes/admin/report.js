const cwd=process.cwd();
const express = require('express');
const router = express.Router();
const controller=require(cwd+'/controller/admin/report');
const passport = require(cwd+'/config/passport');

router.get('/',passport.authenticate('jwt',{session:false}),controller.report_list);
router.post('/view/:id',passport.authenticate('jwt',{session:false}),controller.report_view);
module.exports = router;