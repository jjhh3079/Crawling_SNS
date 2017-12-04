const cwd = process.cwd();
const db=require(cwd+'/config/db');

exports.qna_form=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/contact/qna_write');
  }
};

//////위에 수정 부분
exports.notice_list=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select Notice_ID,Notice_Title,Notice_Date from notice', (err, results) => {
      if (err) console.log(err);
      res.render('admin/contact/notice', {notice: results});
    })
  }
};
exports.notice_view=(req,res)=>{
  const notice_id=req.params.id;
  let notice,notice_comment;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select * from notice where Notice_ID=?',[notice_id],(err,results)=>{
      if(err) console.log(err);
      notice=results;
      db.query('select * from comment,user where comment.User_ID=user.User_ID and Board_name=2 and Board_ID=?',[notice_id],(err,results)=>{
      if(err) console.log(err);  
      notice_comment=results;
      res.render('admin/contact/notice_view',{notice:notice,notice_comment:notice_comment});
    });
    })
  }
};
exports.notice_insert=(req,res)=>{
  const {notice_title,notice_content}=req.body;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('insert into notice (Notice_Title,Notice_Content) values (?,?)', [notice_title, notice_content], (err) => {
      if (err) console.log(err);
      res.redirect('/admin/contact/notice');
    })
  }
};
exports.notice_delete=(req,res)=>{
  const notice_id= req.body.id;
  console.log(String(notice_id));
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('delete from notice where Notice_ID=?', [notice_id], (err, result) => {
      if (err) console.log(err);
      res.redirect('/admin/contact/notice');
    })
  }
};

exports.qna_list=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select Qna_ID,Qna_Title,Qna_Content,Qna_Date from qna', (err, results) => {
      if (err) console.log(err);
      res.render('admin/contact/qna', {qna: results});
    })
  }
};
exports.qna_view=(req,res)=>{
    const qna_id=req.params.id;
    if(req.user.User_isAdmin===0){
        return res.render('main',{message:"관리자만 접속할 수 있습니다."})
    }else {
        db.query('select * from qna where Qna_ID=?',[qna_id],(err,results)=>{
            if(err) console.log(err);
            res.render('admin/contact/qna',{qna:results});
        })
    }
};
exports.qna_insert=(req,res)=>{
  const {qna_title,qna_content}=req.body;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('insert into qna (Qna_Title,Qna_Content) values (?,?)', [qna_title, qna_content], (err) => {
      if (err) console.log(err);
      res.redirect('/admin/contact/qna');
    })
  }
};
exports.qna_delete=(req,res)=>{
  const qna_id=req.params.id;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else{
    db.query('delete from qna where Qna_ID=?',[qna_id],(err,result)=>{
      if(err) console.log(err);
      res.redirect('/admin/contact/qna');
    })
  }
};
// select Question_ID from question where Question_ID_ANSWER = (select Qusetion_ID from  question)
exports.question_list=(req,res)=>{      //제가 빡대가리입니다.
  if(req.user.User_isAdmin===0){
     return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else{
    db.query('select * from question',(err,results)=>{   //ID값을 받아오지않고 아이디값을 받아오는 식으로
      if(err) console.log(err);
      res.render('admin/contact/question',{question:results});
    })
  }
};
exports.question_form=(req,res)=>{
  const question_id=req.params.id;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
      db.query('select * from question where Question_ID=?',[question_id],(err,results)=>{
        if(err) console.log(err);
        res.render('admin/contact/question_write',{question:results});
      })
  }
};
exports.question_answer_insert=(req,res)=>{
  const {question_id,question_title,question_content}=req.body;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('insert into question (Question_Title,Question_Content,Question_ID_Answer) values (?,?,?)', [question_title, question_content, question_id], (err,results) => {
      if (err) console.log(err);
      db.query('update question set Question_ID_Answer=? where Question_ID=?',[results.insertId,question_id],(err,result)=>{
      res.redirect('/admin/contact/question');
      })
    })
  }
};
exports.notice_comment=(req,res)=>{
  const notice_id =req.body.notice_id;
  const comment = req.body.comment;
  const notice =2;
  db.query('insert into comment (User_ID,Board_Name,Board_ID,Comment_Content) values (?,?,?,?)',
    [req.user.User_ID,notice,notice_id,comment],(err)=>{
      if(err) console.log(err);
      res.redirect('/admin/contact/notice/'+notice_id);
    })
};
exports.notice_comment_delete=(req,res)=>{
  const notice_id = req.params.id;
  const comment_id = req.body.comment_id;
  const user_id=req.user.User_ID;
  console.log(comment_id);
  db.query('delete from comment where User_ID=? and Comment_ID=?',
    [user_id,comment_id],(err)=>{
      if(err) console.log(err);
      res.redirect('/admin/contact/notice/'+notice_id)
    });
};

// exports.notice_update=(req,res)=>{
//   const notice_id = req.params.id;
//   const {notice_title,notice_content}=req.body;
//   if(req.user.User_isAdmin===0){
//     return res.render('main',{message:"관리자만 접속할 수 있습니다."})
//   }else {
//     db.query('update notice set Notice_Title=?,Notice_Content=? where Notice_ID=?', [notice_title, notice_content, notice_id], (err, result) => {
//       if (err) console.log(err);
//       res.redirect('admin/contact/notice');           //업데이트할것
//     })
//   }
// };

// exports.qna_update=(req,res)=>{
//   const {qna_id,qna_title,qna_content}=req.body;
//   if(req.user.User_isAdmin===0){
//     return res.render('main',{message:"관리자만 접속할 수 있습니다."})
//   }else {
//     db.query('update qna set Qna_Title=?,Qna_Content=? where Qna_ID=?', [qna_title, qna_content, qna_id], (err, result) => {
//       if (err) console.log(err);
//       res.redirect('admin/contact/qna');
//     })
//   }
// };