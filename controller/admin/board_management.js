const cwd = process.cwd();
const db=require(cwd+'/config/db');

exports.event_list=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select Event_ID,Event_Title,Event_Date,Event_Score from event', (err, results) => {
      if (err) console.log(err);
      res.render('admin/board/event', {event: results});
    })
  }
};
exports.event_view=(req,res)=>{
  const event_id=req.params.id;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select * from event where Event_ID=?',[event_id] ,(err, results) => {
      if (err) console.log(err);
      res.render('admin/board/event_view', {event: results});
    })
  }
};

exports.event_insert_form=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/board/event_insert_form');
  }
};
exports.event_insert=(req,res)=>{
  const {event_Title,event_Link,event_Content}=req.body;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('insert into event (Event_Title,Event_Link,Event_Content) values (?,?,?)',
      [event_Title,event_Link,event_Content], (err) => {
        if (err) console.log(err);
        res.redirect('/admin/board/event');       //수정
      })
  }
};
exports.event_delete=(req,res)=>{
  const event_id=req.params.id;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('delete from event where Event_ID=?', [event_id], (err) => {
      if (err) console.log(err);
      res.redirect('/admin/board/event');
    })
  }
};
exports.event_view=(req,res)=>{
  const event_id=req.params.id;
  let event,event_comment;
  db.query('select * from event where Event_ID=?',[event_id],(err,results)=>{
    if(err) console.log(err);
    event=results;
    db.query('select * from comment,user where comment.User_ID=user.User_ID and Board_Name=0 and Board_ID=?',[event_id],(err,results)=>{
      if(err) console.log(err);
      event_comment=results;
      res.render('admin/board/event_click',{event:event,event_comment:event_comment});
    });

  })
};

exports.hotdeal_list=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select * from hotdeal', (err, results) => {
      if (err) console.log(err);
      res.render('admin/board/hotdeal', {hotdeal: results});
    })
  }
};
// exports.hotdeal_view=(req,res)=>{
//   const hotdeal_id=req.params.id;
//   if(req.user.User_isAdmin===0){
//     return res.render('main',{message:"관리자만 접속할 수 있습니다."})
//   }else {
//     db.query('select * from hotdeal where Hotdeal_ID=?',[hotdeal_id], (err, results) => {
//       if (err) console.log(err);
//       res.render('admin/board/hotdeal_view', {hotdeal: results});         //수정
//     })
//   }
// };

exports.hotdeal_insert_form=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/board/hotdeal_insert_form');
  }
};

exports.hotdeal_view=(req,res)=>{
  const hotdeal_id=req.params.id;
  let hotdeal,hotdeal_comment;
  db.query('select * from hotdeal where Hotdeal_ID=?',[hotdeal_id],(err,results)=>{
    if(err) console.log(err);
    hotdeal=results;
    db.query('select * from comment,user where comment.User_ID=user.User_ID and Board_Name=1 and Board_ID=?',[hotdeal_id],(err,results)=>{
      if(err) console.log(err);
      hotdeal_comment=results;
      res.render('admin/board/hotdeal_click',{hotdeal:hotdeal,hotdeal_comment:hotdeal_comment});
    });

  })
};

exports.hotdeal_insert=(req,res)=>{
  const {hotdeal_Title,hotdeal_Link,hotdeal_Content}=req.body;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('insert into hotdeal (Hotdeal_Title,Hotdeal_Link,Hotdeal_Content) values (?,?,?)',
      [hotdeal_Title,hotdeal_Link,hotdeal_Content], (err) => {
        if (err) console.log(err);
        res.redirect('/admin/board/hotdeal');           //수정
      })
  }
};
exports.hotdeal_delete=(req,res)=>{
  const hotdeal_id=req.body.id;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('delete from hotdeal where Hotdeal_ID=?', [hotdeal_id], (err) => {
      if (err) console.log(err);
      res.redirect('/admin/board/hotdeal');         //수정
    })
  }
};

// 댓글입력
exports.hotdeal_comment=(req,res)=>{
  const hotdeal_id =req.body.hotdeal_id;
  const comment = req.body.comment;
  const hotdeal =1;
  db.query('insert into comment (User_ID,Board_Name,Board_ID,Comment_Content) values (?,?,?,?)',
    [req.user.User_ID,hotdeal,hotdeal_id,comment],(err)=>{
      if(err) console.log(err);
      res.redirect('/admin/board/hotdeal/'+hotdeal_id);
    })
};

exports.hotdeal_comment_delete=(req,res)=>{
  const hotdeal_id = req.params.id;
  const comment_id = req.body.comment_id;
  console.log(comment_id);
  db.query('delete from comment where Comment_ID=?',
    [comment_id],(err)=>{
      if(err) console.log(err);
      res.redirect('/admin/board/hotdeal/'+hotdeal_id)
    });
};
exports.event_comment=(req,res)=>{
  const event_id =req.body.event_id;
  const comment = req.body.comment;
  const event =0;
  c
  db.query('insert into comment (User_ID,Board_Name,Board_ID,Comment_Content) values (?,?,?,?)',
    [req.user.User_ID,event,event_id,comment],(err)=>{
      if(err) console.log(err);
      res.redirect('/admin/board/event/'+event_id);
    })
};
exports.event_comment_delete=(req,res)=>{
  const event_id = req.params.id;
  const comment_id = req.body.comment_id;
  console.log(comment_id);
  db.query('delete from comment where Comment_ID=?',
    [comment_id],(err)=>{
      if(err) console.log(err);
      res.redirect('/admin/board/event/'+event_id)
    });
};

exports.grade_list=(req,res)=>{
    if(req.user.User_isAdmin===0){
        return res.render('main',{message:"관리자만 접속할 수 있습니다."})
    }else {
        db.query('select A.user_Name, B.* from user as A, grade as B where A.User_ID=B.User_ID;', (err, results) => {
            if (err) console.log(err);
            res.render('admin/board/grade', {grade: results});
        })
    }
};


// exports.event_update=(req,res)=>{
//   const event_id=req.params.id;
//   const {Title,Link,Content}=req.body;
//   if(req.user.User_isAdmin===0){
//     return res.render('main',{message:"관리자만 접속할 수 있습니다."})
//   }else {
//     db.query('update event set Event_Title=? , Event_Link=?, Event_Content=? where Event_ID=?',
//       [Title, Link, Content, event_id], (err) => {
//         if (err) console.log(err);
//         res.redirect('admin/board/event');
//       })
//   }
// };

// exports.hotdeal_update=(req,res)=>{
//   const hotdeal_id=req.params.id;
//   const {Title,Link,Content}=req.body;
//   if(req.user.User_isAdmin===0){
//     return res.render('main',{message:"관리자만 접속할 수 있습니다."})
//   }else {
//     db.query('update event set Hotdeal_Title=? , Hotdeal_Link=?, Hotdeal_Content=? where Hotdeal_ID=?',
//       [Title, Link, Content, hotdeal_id], (err) => {
//         if (err) console.log(err);
//         res.redirect('admin/hotdeal/hotdeal');           //수정
//       })
//   }
// };

