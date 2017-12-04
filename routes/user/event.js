const cwd = process.cwd();
const express = require('express');
const router = express.Router();
const controller = require(cwd+'/controller/user/event');
const passport = require(cwd+'/config/passport');

//event

router.get('/',passport.authenticate('jwt',{session:false}),controller.event_list);
router.get('/:id',passport.authenticate('jwt',{session:false}),controller.event_view);

router.get('/up/:id',passport.authenticate('jwt',{session:false}),controller.event_up);
router.get('/down/:id',passport.authenticate('jwt',{session:false}),controller.event_down);

router.get('/')
router.get('/:id/grade',passport.authenticate('jwt',{session:false}),controller.event_grade_view);
router.post('/grade/:id',passport.authenticate('jwt',{session:false}),controller.event_grade);

router.post('/comment',passport.authenticate('jwt',{session:false}),controller.event_comment);
router.post('/comment/delete/:id',passport.authenticate('jwt',{session:false}),controller.event_comment_delete);

module.exports=router;