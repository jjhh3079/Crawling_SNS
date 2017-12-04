const cwd=process.cwd();
const request = require('request');
const cheerio = require('cheerio');
const iconv  = require('iconv-lite');
const db=require(cwd+'/config/db');

const nodemailer=require(cwd+'/config/email');
const email_template=require(cwd+'/config/email_template');

exports.crawling_hotdeal_ppomppu=()=>{
  console.log("뽐뿌");
  request({
    method: "GET",
    uri: "http://www.ppomppu.co.kr/hot.php?id=ppomppu4",
    encoding: null
  }, (error, response, html) => {
    if (!error) {
      const strContents = new Buffer(html);
      const page = iconv.decode(strContents, 'EUC-KR').toString();
      const $ = cheerio.load(page);
      let link_list =[];
      let hotdeal = [];
      for(let i=4; i<24;i++){
        let temp={};
        let _hotdeal={};
        let link=$('body > div.wrapper > div.contents > div.container > div:nth-child(3) > div.board_box > table.board_table > tbody > tr:nth-child('+i+') > td:nth-child(4) > a').attr("href");
        let id = link.substring(32);
        let recommend = $('body > div > div.contents > div.container > div:nth-child(3) > div.board_box > table.board_table > tbody > tr:nth-child('+i+') > td:nth-child(6)').text();
        temp.link="http://www.ppomppu.co.kr"+link;
        temp.link_id=id;
        _hotdeal.Hotdeal_Original_ID=id;
        _hotdeal.Hotdeal_Recommend=recommend;
        link_list.push(temp);
        hotdeal.push(_hotdeal);
      }
      db.query('select max(Hotdeal_Original_ID) as filter from hotdeal where Hotdeal_Category="뽐뿌"',(err,results)=>{
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
          db.query('select User_ID,User_Email,Alarm_Ppomppu,Alarm_Ppomppu_Recommend from user',(err,results)=>{
            for(let i=0; i<results.length;i++){
              if(results[i].Alarm_Ppomppu ===1 && results[i].Alarm_Ppomppu_Recommnd<=max_recommend){
                nodemailer.sendMail(email_template.ppomppu(results[i].User_Email));
              }
            }
          })
        }

        for(let i=0; i<20;i++){
          if(link_list[i].link_id>last_id){
            request({
              method: "GET",
              uri: link_list[i].link,
              encoding: null
            },(err,response,html)=>{
              if(!err){
                let str = new Buffer(html);
                let page2=iconv.decode(str, 'EUC-KR').toString();
                let $ = cheerio.load(page2);
                let link=$('body > div.wrapper > div.contents > div.container > div > table:nth-child(9) > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(5) > div > a').text();
                let title=$('meta[property="og:title"]').attr("content");
                let content=$('meta[property="og:description"]').attr("content");
                hotdeal[i].Hotdeal_Title=title;
                hotdeal[i].Hotdeal_Link=link;
                hotdeal[i].Hotdeal_Content=content;
                db.query('INSERT INTO hotdeal (Hotdeal_Category,Hotdeal_Original_ID,Hotdeal_Recommend,Hotdeal_Title,Hotdeal_Link,Hotdeal_Content) VALUES ("뽐뿌",?,?,?,?,?)',
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