const cwd=process.cwd();
const express = require('express');
const router = express.Router();
const controller=require(cwd+'/controller/admin/contact');
const passport = require(cwd+'/config/passport');

// 공지사항
router.get('/notice',passport.authenticate('jwt',{session:false}),controller.notice_list);
// 공지사항 보기
router.get('/notice/:id',passport.authenticate('jwt',{session:false}),controller.notice_list);
// 공지사항 작성 폼
router.get('/notice/insert',passport.authenticate('jwt',{session:false}),(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/contact/notice_form',{url:"insert"})
  }
});
router.get('/notice/update/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/contact/notice_form',{url:"update/"+req.params.id})
  }
});
router.get('/notice/delete/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/contact/notice_form',{url:"delete/"+req.params.id})
  }
});
// 공지사항 작성
router.post('/notice/insert',passport.authenticate('jwt',{session:false}),controller.notice_insert);
router.post('/notice/update/:id',passport.authenticate('jwt',{session:false}),controller.notice_update);

router.post('/notice/delete/:id',passport.authenticate('jwt',{session:false}),controller.notice_delete);

router.get('/question',passport.authenticate('jwt',{session:false}),controller.question_list);
router.get('/question/form/:id',passport.authenticate('jwt',{session:false}),controller.question_form);
router.post('/question/insert',passport.authenticate('jwt',{session:false}),controller.question_answer_insert);

router.get('/qna',passport.authenticate('jwt',{session:false}),controller.qna_list);
router.get('/qna/:id',passport.authenticate('jwt',{session:false}),controller.qna_view);
router.get('/qna/insert',passport.authenticate('jwt',{session:false}),controller.qna_insert);
router.get('/qna/update/:id',passport.authenticate('jwt',{session:false}),controller.qna_update);
router.get('/qna/delete/:id',passport.authenticate('jwt',{session:false}),controller.qna_delete);

router.get('/qna_form',passport.authenticate('jwt',{session:false}),controller.qna_form);

module.exports = router;