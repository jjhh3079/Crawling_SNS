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
  const request_form = {
    t_key:config.api_key,
    t_code: company,
    t_invoice: tracking_number
  };
  request.post(
    {
      url:"http://info.sweettracker.co.kr/apidoc/api/v1/trackingInfo",
      from:request_form
    },(err,httpResponse,body)=>{
    if(err) console.log(err);
    console.log(httpResponse);
    console.log(body);
  });

};
