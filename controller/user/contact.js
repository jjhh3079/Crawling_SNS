const cwd = process.cwd();
const db=require(cwd +'/config/db');

exports.notice_list=(req,res)=>{
  db.query('select Notice_ID,Notice_Title,Notice_Date from notice',(err,results)=>{
    if(err) console.log(err);
    res.render('user/contact/notice',{notice:results});
  })
};

// exports.notice_view=(req,res)=>{
//   const notice_id=req.params.id;
//   db.query('select * from notice where Notice_ID=?',[notice_id],(err,results)=>{
//     if(err) console.log(err);
//     res.render('user/contact/noticeview',{notice:results});
//   })
// };

exports.notice_view=(req,res)=>{
    const notice_id=req.params.id;
    console.log(req.user.User_ID);
    let notice,notice_comment,user_mail;
    db.query('select * from notice where Notice_ID=?',[notice_id],(err,results)=>{
        if(err) console.log(err);
        notice=results;
        db.query('select * from comment,user where comment.User_ID=user.User_ID and Board_Name=2 and Board_ID=?',[notice_id],(err,results)=>{
            if(err) console.log(err);
            notice_comment=results;
            //밑에 쿼리문은 사용자의 Email을 넘겨줘서 사용자 자신의 댓글에 삭제버튼 여부를 구현한 것(수일)
            db.query('select User_Email from user where User_ID = ?',[req.user.User_ID],(err,results)=>{
                if(err) console.log(err);
                user_mail = results;
                res.render('user/contact/noticeview',{notice:notice,notice_comment:notice_comment,user_mail:user_mail});
            });
        });
    });
};

//공지사항 부분 댓글 관련 추가 board_name=2
exports.notice_comment=(req,res)=>{
    const notice_id= req.body.notice_id;
    const comment = req.body.comment;
    db.query('insert into comment (User_ID,Board_Name,Board_ID,Comment_Content) values (?,?,?,?)',
        [req.user.User_ID,2,notice_id,comment],(err)=>{
        if(err) console.log(err);
    res.redirect('/contact/notice/'+notice_id);
})
};
exports.notice_comment_delete=(req,res)=>{
    const notice_id = req.params.id;
    const comment_id = req.body.comment_id;
    const user_id=req.user.User_ID;
    db.query('delete from comment where User_ID=? and Comment_ID=?',
        [user_id,comment_id],(err)=>{
        if(err) console.log(err);
    res.redirect('/contact/notice/'+notice_id);
});
};


exports.qna_list=(req,res)=>{
  db.query('select * from qna',(err,results)=>{
    res.render('user/contact/qna',{qna:results});
  })
};
exports.qna_view=(req,res)=>{
  const qna_id=req.params.id;
  db.query('select * from qna where Qna_ID=?',[qna_id],(err,results)=>{
    if(err) console.log(err);
    res.render('user/contact/qnaview',{qna:results});
  })
};
// TODO : answer 처리
exports.question_list=(req,res)=>{
  console.log(req.user);
  db.query('select Question_ID,Question_Title,Question_Date,Question_ID_Answer from question where User_ID=?',[req.user.User_ID],(err,results)=>{
    res.render('user/contact/question',{question:results});
  })
};
exports.question_view=(req,res)=>{
  const question_id=req.params.id;
  const user_id = req.user.User_ID;
  db.query('select * from question where Question_ID=? and User_ID=?',[question_id,user_id],(err,results)=>{
    if(err) console.log(err);
    const question = results;
    db.query('select * from question where Question_ID_Answer = ?',[question_id],(err,results)=>{
        if(err) console.log(err);
        const answer = results;
        console.log(answer);
        res.render('user/contact/questionview',{question:question,answer:answer});
    });
  })
};
exports.question_write=(req,res)=>{
    const {question_id,user_id}=req.body;
    db.query('select * from question where Question_ID=? and User_ID=?',[question_id,user_id],(err,results)=>{
        if(err) console.log(err);
        res.render('user/contact/questionwrite');
    })
};

exports.question_insert=(req,res)=>{
    const {question_title,question_content}=req.body;
    const user_id = req.user.User_ID;
    db.query('insert into question(User_ID,Question_Title,Question_Content) values (?,?,?)',[user_id,question_title,question_content],(err,results)=>{
        if(err) console.log(err);
    res.redirect('/contact/question');
});
};

// 수정할 부분
// exports.notice_view=(req,res)=>{
//     console.log('connect!');
//     db.query('select * from notice(Notice_Title,Notice_Content) values (?,?)',[res.body.notice_title,res.body.notice_content],()=>{
//       console.log('notice nth table inserted');
//       console.log('');
//     });
// };