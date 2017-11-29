const cwd = process.cwd();
const db=require(cwd+'/config/db');

exports.admin_settings=(req,res)=>{
  res.render('admin/settings/settings');
};