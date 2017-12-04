const cwd = process.cwd();
const db=require(cwd+'/config/db');

exports.report=(req,res)=>{
  const comment_id=req.params.id;
    res.render('user/report/report_form',{comment_id:comment_id});
};

exports.report_insert=(req,res)=>{
  const {comment_id,report_content}=req.body;
  db.query('insert into report (User_ID,Report_Content,Comment_ID) values (?,?,?)',[req.user.User_ID,report_content,comment_id],(err)=>{
   if(err) console.log(err);
   res.redirect('/main');
  //  res.redirect();
  })
};