const cwd = process.cwd();
const db=require(cwd +'/config/db');
const config = require(cwd+'/config/api_key');
const request = require('request');
exports.tracking_page=(req,res)=>{
  const user_id=req.params.id;
  db.query('select * from tracking where User_ID=?',[user_id],(err,results)=>{
    if(err) console.log(err);
    res.render('user/tracking/tracking',{tracking:results});
  });
};
exports.tracking_insert=(req,res)=>{
  const company= req.body.company;
  const tracking_number = req.body.tracking_number;
  //t_key t_code t_invoice
  const url = "http://info.sweettracker.co.kr/apidoc/api/v1/trackingInfo?t_key="+config.api_key+"&t_code="+company+"&t_invoice="+tracking_number;
  request(url,{json:true},(err,response,body)=>{
    if(err) console.log(err);
    const status = body.lastStateDetail.kind;
    db.query('insert into tracking (User_ID, Tracking_Company, Tracking_Number, Tracking_Status) values (?,?,?,?)',
      [req.user.User_ID,company,tracking_number,status],(err)=>{
        if(err) console.log(err);
        res.redirect('/tracking');
      });
  });
};
