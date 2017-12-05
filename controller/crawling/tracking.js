const cwd = process.cwd();
const db=require(cwd+'/config/db');
const config = require(cwd+'/config/api_key');
const request = require('request');

exports.tracking=()=>{
  const url = (company,tracking_number)=>{
    return "http://info.sweettracker.co.kr/api/v1/trackingInfo?t_key="+config.api_key+"&t_code="+company+"&t_invoice="+tracking_number;
  };
  db.query('select * from tracking',(err,results)=>{
    if(err) console.log(err);
    for(let i=0;i<results.length;i++){
      // company tracking_number
      let company=results[i].Tracking_Company;
      let number = results[i].Tracking_Number;
      let id = results[i].Tracking_ID;
      request(url(company,number),{json:true},(err,response,body)=>{
        if(err){
          console.log(err);
        }else{
          let date = body.lastStateDetail.timeString;
          let status=body.lastStateDetail.kind;
          db.query('update tracking set Tracking_Date=? and Tracking_Status=? where Tracking_ID=?',[date,status,id],(err)=>{
            if(err) console.log(err);
          })
        }

      })
    }
  });
};

// const company= req.body.company;
// const tracking_number = req.body.tracking_number;
//
// //t_key t_code t_invoice
// const url = "http://info.sweettracker.co.kr/apidoc/api/v1/trackingInfo?t_key="+config.api_key+"&t_code="+company+"&t_invoice="+tracking_number;
// request(url,{json:true},(err,response,body)=>{
//   if(err) console.log(err);
//   console.log(body.invoiceNo);
//   console.log(body.lastStateDetail.kind);
// })