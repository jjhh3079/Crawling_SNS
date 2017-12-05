const cwd = process.cwd();
const express = require('express');
const router = express.Router();
const controller = require(cwd+'/controller/user/tracking');
const passport = require(cwd+'/config/passport');

//tracking
router.get('/',passport.authenticate('jwt',{session:false}),controller.tracking_page);
//배송번호 입력
router.post('/insert',passport.authenticate('jwt',{session:false}),controller.tracking_insert);

module.exports=router;