const cwd=process.cwd();
const passport = require(cwd+'/config/passport');

const express = require('express');
const router = express.Router();
const controller = require(cwd+'/controller/admin/board_management');

// admin/board/~~

router.get('/event',passport.authenticate('jwt',{session:false}),controller.event_list);
router.get('/hotdeal',passport.authenticate('jwt',{session:false}),controller.hotdeal_list);
router.get('/grade',passport.authenticate('jwt',{session:false}),controller.grade_list);


router.get('/event/insert',passport.authenticate('jwt',{session:false}),controller.event_insert_form);
router.get('/hotdeal/insert',passport.authenticate('jwt',{session:false}),controller.hotdeal_insert_form);

router.get('/hotdeal/:id',passport.authenticate('jwt',{session:false}),controller.hotdeal_view);
router.get('/event/:id',passport.authenticate('jwt',{session:false}),controller.event_view);

router.post('/event/insert',passport.authenticate('jwt',{session:false}),controller.event_insert);
router.post('/hotdeal/insert',passport.authenticate('jwt',{session:false}),controller.hotdeal_insert);

// router.post('/event/update/:id',passport.authenticate('jwt',{session:false}),controller.event_update);
// router.post('/hotdeal/update/:id',passport.authenticate('jwt',{session:false}),controller.hotdeal_update);

router.post('/event/delete/:id',passport.authenticate('jwt',{session:false}),controller.event_delete);
router.post('/hotdeal/delete/:id',passport.authenticate('jwt',{session:false}),controller.hotdeal_delete);


router.post('/hotdeal/comment',passport.authenticate('jwt',{session:false}),controller.hotdeal_comment);
router.post('/hotdeal/comment/delete/:id',passport.authenticate('jwt',{session:false}),controller.hotdeal_comment_delete);

router.post('/event/comment',passport.authenticate('jwt',{session:false}),controller.event_comment);
router.post('/event/comment/delete/:id',passport.authenticate('jwt',{session:false}),controller.event_comment_delete);

module.exports = router;