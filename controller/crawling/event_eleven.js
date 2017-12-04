const cwd=process.cwd();
const request = require('request');
const cheerio = require('cheerio');
const iconv  = require('iconv-lite');
const db=require(cwd+'/config/db');
const nodemailer=require(cwd+'/config/email');
const email_template=require(cwd+'/config/email_template');
exports.crawling_event_eleven=()=>{
  console.log("11번가");
  request({
    method: "GET",
    uri: "http://www.11st.co.kr/browsing/NewPlusZonePlace.tmall?method=getEventPage",
    encoding: null
  }, (error, response, html) => {
    if (error) console.log(error);
    const str = new Buffer(html);
    const page = iconv.decode(str, 'EUC-KR').toString();
    const $ = cheerio.load(page);
    let event=[];
    const li = $("div.ingevt > div > ul").children('li').toArray();
    for(let i=0;i<li.length;i++){
      let temp={};
      temp.event_id=li[i].children[0].attribs.href.substr(95);
      temp.event_link=li[i].children[0].attribs.href;
      temp.event_content=li[i].children[0].children[1].attribs.src;
      event.push(temp);
    }
    db.query('select max(Event_Original_ID) as filter from event',(err,results)=>{
      const lastid=results[0].filter;

      let alarm=0;
      for(let i=0;i<event.length;i++){
        if(event[i].event_id>lastid){
          alarm=1;
        }
      }
      for(let i=0; i<event.length;i++){
        if(event[i].event_id>lastid){
          let title;
          request({
            method: "GET", 
            uri: event[i].event_link,
            encoding: null
          }, (error, response, html) => {
            if(error) console.log(error);
            const _str = new Buffer(html);
            const page2 = iconv.decode(_str, 'EUC-KR').toString();
            const $ = cheerio.load(page2);
            title=$('meta[property="og:title"]').attr("content");
            db.query('insert into event (Event_Category,Event_Title,Event_Link,Event_Content,Event_Original_ID) values (?,?,?,?,?)',
              ["11번가",title,event[i].event_link,event[i].event_content,event[i].event_id],(err)=>{
                if(err) console.log(err);
              });
          });
        }
      }

      if(alarm===1){
        db.query('select User_ID,User_Email,Alarm_Eleven from user',(err,results)=>{
          if(err) console.log(err);
          for(let i=0; i<results.length;i++){
            if(results[i].Alarm_Eleven ===1){
              nodemailer.sendMail(email_template.eleven(results[i].User_Email))
            }
          }
        })
      }
    })
});
};
