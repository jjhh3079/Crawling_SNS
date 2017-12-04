const cwd=process.cwd();
const request = require('request');
const cheerio = require('cheerio');
const iconv  = require('iconv-lite');
const db=require(cwd+'/config/db');

const nodemailer=require(cwd+'/config/email');
const email_template=require(cwd+'/config/email_template');

exports.crawling_hotdeal_coolenjoy=()=>{
  request({
    method: "GET",
    uri: "http://www.coolenjoy.net/bbs/jirum",
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  }, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      let link_list =[];
      let hotdeal = [];
      for(let i=4; i<24;i++){
        let temp={};
        let _hotdeal={};
        let link=$('#fboardlist > div > table > tbody > tr:nth-child('+i+') > td.td_subject > a:nth-child(1)').attr("href");
        let id = link.substring(35);
        let recommend = $('#fboardlist > div > table > tbody > tr:nth-child('+i+') > td:nth-child(6) > div.list_good2 > b').text();
        temp.link=link;
        temp.link_id=id;
        _hotdeal.Hotdeal_Original_ID=id;
        _hotdeal.Hotdeal_Recommend=recommend;
        link_list.push(temp);
        hotdeal.push(_hotdeal);
      }
      db.query('select max(Hotdeal_Original_ID) as filter from hotdeal where Hotdeal_Category="쿨엔조이"',(err,results)=>{
        if(err) console.log(err);
        const last_id=results[0].filter;
        let alarm=0;
        let max_recommend=0;
        for(let i=0;i<link_list.length;i++){
          if(link_list[i].link_id>last_id){
            alarm=1;
          }
          if(hotdeal[i].Hotdeal_Recommend>max_recommend){
            max_recommend=hotdeal[i].Hotdeal_Recommend;
          }
        }

        if(alarm===1){
          db.query('select User_ID,User_Email,Alarm_Coolenjoy,Alarm_Coolenjoy_Recommend from user',(err,results)=>{
            for(let i=0; i<results.length;i++){
              if(results[i].Alarm_Coolenjoy ===1 && results[i].Alarm_Coolenjoy_Recommnd<=max_recommend){
                nodemailer.sendMail(email_template.coolenjoy(results[i].User_Email));
              }
            }
          })
        }

        for(let i=0; i<20;i++){
          if(link_list[i].link_id>last_id){
            request({
              method: "GET",
              uri: link_list[i].link,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
              }
            },(err,response,html)=>{
              if(!err){
                let $ = cheerio.load(html);
                let link=$('ul > li > a > strong').text();
                let title=$('#bo_v_title').text();
                let _content=$('#bo_v_con').text();
                let content = _content.substring(0,40);
                hotdeal[i].Hotdeal_Title=title;
                hotdeal[i].Hotdeal_Link=link;
                hotdeal[i].Hotdeal_Content=content;
                db.query('INSERT INTO hotdeal (Hotdeal_Category,Hotdeal_Original_ID,Hotdeal_Recommend,Hotdeal_Title,Hotdeal_Link,Hotdeal_Content) VALUES ("쿨엔조이",?,?,?,?,?)',
                  [hotdeal[i].Hotdeal_Original_ID,hotdeal[i].Hotdeal_Recommend,
                    hotdeal[i].Hotdeal_Title,hotdeal[i].Hotdeal_Link,hotdeal[i].Hotdeal_Content],(err)=>{
                    if(err) console.log(err);
                  })
              }else{
                console.log(err);
              }
            })
          }
        }
      });
    }
  });
};