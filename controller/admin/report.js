const cwd = process.cwd();
const db=require(cwd+'/config/db');

exports.report_list=(req,res)=>{
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    db.query('select user.User_Name, report.* from user,comment,report where user.User_ID=comment.User_ID and comment.Comment_ID=report.Comment_ID;', (err, results) => {
      if (err) console.log(err);
      res.render('admin/report/report', {report: results});
    })
  }
};
exports.report_view=(req,res)=>{
  const report_id=req.params.id;
  db.query('select user.User_Name, report.* from user,comment,report where user.User_ID=comment.User_ID and comment.Comment_ID=report.Comment_ID and report.Report_ID=?',[report_id],(err,results)=>{
    if(err) console.log(err);
    res.render('admin/report/report_view',{report:results});
  })
};