const cwd = process.cwd();
const db=require(cwd +'/config/db');

exports.main=(req,res)=>{
  res.render('user/overview');
};