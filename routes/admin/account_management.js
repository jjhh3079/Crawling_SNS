const cwd = process.cwd();
const express = require('express');
const router = express.Router();
const passport = require(cwd+'/config/passport');
const controller = require(cwd+'/controller/admin/account_management');
//account
router.get('/list',passport.authenticate('jwt',{session:false}),controller.account_list);
router.get('/comment/:id',passport.authenticate('jwt',{session:false}),controller.account_comment_list);
router.get('/report/:id',passport.authenticate('jwt',{session:false}),controller.account_comment_list);
router.post('/ban/:id',passport.authenticate('jwt',{session:false}),controller.account_ban);
router.post('/unban/:id',passport.authenticate('jwt',{session:false}),controller.account_unban);
//experiment
// router.get('/account/update/email/:id',);

module.exports = router;