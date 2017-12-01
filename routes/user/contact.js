const cwd = process.cwd();
const express = require('express');
const router = express.Router();
const controller = require(cwd+'/controller/user/contact');
const passport = require(cwd+'/config/passport');

router.get('/notice',passport.authenticate('jwt',{session:false}),controller.notice_list);
router.get('/notice/:id',passport.authenticate('jwt',{session:false}),controller.notice_view);
router.get('/qna',controller.qna_list);
router.get('/qna/:id',controller.qna_view);

router.get('/qnawrite',passport.authenticate('jwt',{session:false}),controller.qna_list);
router.get('/question',passport.authenticate('jwt',{session:false}),controller.question_list);
router.get('/question_write',passport.authenticate('jwt',{session:false}),controller.question_write);
router.get('/question/:id',passport.authenticate('jwt',{session:false}),controller.question_view);

// 수정한 부분
// router.get('/noticeview',controller.notice_view);

//공지사항 댓글 추가
router.post('/notice/comment',passport.authenticate('jwt',{session:false}),controller.notice_comment);
router.post('/notice/comment/delete/:id',passport.authenticate('jwt',{session:false}),controller.notice_comment_delete);


module.exports=router;