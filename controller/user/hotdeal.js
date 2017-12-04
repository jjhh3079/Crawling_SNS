const cwd = process.cwd();
const db=require(cwd +'/config/db');

exports.hotdeal_list=(req,res)=>{
  db.query('select * from hotdeal',(err,results)=>{
    if(err) console.log(err);
    console.log(results);
    res.render('user/hotdeal/hotdeal',{hotdeal:results});
  })
};
exports.hotdeal_view=(req,res)=>{
  const hotdeal_id=req.params.id;
  let hotdeal,hotdeal_comment,user_mail;
  db.query('select * from hotdeal where Hotdeal_ID=?',[hotdeal_id],(err,results)=>{
    if(err) console.log(err);
    hotdeal=results;
    db.query('select * from comment,user where comment.User_ID=user.User_ID and Board_Name=1 and Board_ID=?',[hotdeal_id],(err,results)=>{
      if(err) console.log(err);
      hotdeal_comment=results;
      //밑에 쿼리문은 사용자의 Email을 넘겨줘서 사용자 자신의 댓글에 삭제버튼 여부를 구현한 것(수일)
          db.query('select User_Email from user where User_ID = ?',[req.user.User_ID],(err,results)=>{
          if(err) console.log(err);
          user_mail = results;
          res.render('user/hotdeal/hotdeal_click',{hotdeal:hotdeal,hotdeal_comment:hotdeal_comment,user_mail:user_mail});
      });
    });

  })
};
exports.hotdeal_up=(req,res)=>{
  const hotdeal_id=req.params.id;
  const hotdeal=1;
  //boardname은 정수로한다
  //event 0 hotdeal 1 free 2
  db.query('select count(*) as count from updown where User_ID=? and Board_Name=? and Board_ID=?',
    [req.user.User_ID,hotdeal,hotdeal_id],(err,result)=>{
      if(err) console.log(err);
      if(result[0].count > 0){
        res.redirect('/hotdeal');
      }else{
        db.query('update hotdeal set Hotdeal_Score=Hotdeal_Score+1 where Hotdeal_ID=?',[hotdeal_id],(err,result)=>{
          if(err) console.log(err);
          res.redirect('/hotdeal');
        });
      }
    });
};
exports.hotdeal_down=(req,res)=>{
  const hotdeal_id=req.params.id;
  const hotdeal=1;
  //boardname은 정수로한다
  //hotdeal 0 hotdeal 1 free 2
  db.query('select count(*) as count from updown where User_ID=? and Board_Name=? and Board_ID=?',
    [req.user.User_ID,hotdeal,hotdeal_id],(err,result)=>{
      if(err) console.log(err);
      if(result[0].count>0){
        res.redirect('/hotdeal');
      }else{
        db.query('update hotdeal set Hotdeal_Score=Hotdeal_Score-1 where Hotdeal_ID=?',[hotdeal_id],(err,result)=>{
          if(err) console.log(err);
          res.redirect('/hotdeal');
        });
      }
    });
};
exports.hotdeal_grade=(req,res)=>{
  const hotdeal_id = req.params.id;
  const user_id=req.user.User_ID;
  const hotdeal = 1;
  const {grade_score,grade_content} = req.body;
  db.query('insert into grade (User_ID,Borad_Name,Board_ID,Grade_Score,Grade_Content) values(?,?,?,?,?)',
    [user_id,hotdeal,hotdeal_id,grade_score,grade_content],(err)=>{
      if(err) console.log(err);
      res.redirect('/hotdeal/'+hotdeal_id);
    });
};

exports.hotdeal_grade_form=(req,res)=>{
  const hotdeal_id = req.params.id;
  const user_id=req.user.User_ID;
  db.query('select * from hotdeal where Hotdeal_ID=?',[hotdeal_id],(err,results)=>{
    if(err) console.log(err);
      res.render('user/hotdeal/hotdeal_grade_form',{hotdeal:results});
  })
};

// 댓글입력
exports.hotdeal_comment=(req,res)=>{
  const hotdeal_id =req.body.hotdeal_id;
  const comment = req.body.comment;
  const hotdeal =1;
  db.query('insert into comment (User_ID,Board_Name,Board_ID,Comment_Content) values (?,?,?,?)',
    [req.user.User_ID,hotdeal,hotdeal_id,comment],(err)=>{
      if(err) console.log(err);
      res.redirect('/hotdeal/'+hotdeal_id);
    })
};

exports.hotdeal_comment_delete=(req,res)=>{
  const hotdeal_id = req.params.id;
  const comment_id = req.body.comment_id;
  const user_id=req.user.User_ID;
  console.log(comment_id);
  db.query('delete from comment where User_ID=? and Comment_ID=?',
    [user_id,comment_id],(err)=>{
      if(err) console.log(err);
      res.redirect('/hotdeal/'+hotdeal_id)
    });
};