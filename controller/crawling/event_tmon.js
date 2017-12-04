const cwd=process.cwd();
const request = require('request');
const cheerio = require('cheerio');
const db=require(cwd+'/config/db');
const nodemailer=require(cwd+'/config/email');
const email_template=require(cwd+'/config/email_template');

exports.crawling_event_tmon=()=> {
  request({
    method: "GET",
    uri: "http://www.ticketmonster.co.kr/event/1",
  }, (error, response, html) => {
    if (error) console.log(error);
    const $ = cheerio.load(html);
    let event = [];
    for (let i = 1; i < 5; i++) {
      let temp = {};
      let link = $('#content > div.sub_bg > ul > li:nth-child(' + i + ') > a:nth-child(1)').attr("href");
      let id = link.substring(12, 16);
      temp.link = "http://www.ticketmonster.co.kr" + link;
      temp.id = id;
      temp.title = $('#content > div.sub_bg > ul > li:nth-child(' + i + ') > h2').text().substring(21, 52);
      temp.content = $('#content > div.sub_bg > ul > li:nth-child(' + i + ') > a:nth-child(1) > img').attr("src");
      event.push(temp);
    }
    db.query('select max(Event_Original_ID) as filter from event where Event_Category="티몬"', (err, results) => {
      if (err) console.log(err);
      let lastid=0;
      if(results[0]){
        lastid = results[0].filter;
      }
      let alarm = 0;
      for (let i = 0; i < event.length; i++) {
        if (event[i].id > lastid) {
          alarm = 1;
        }
      }
      for (let i = 0; i < event.length; i++) {
        if (event[i].id > lastid) {
          db.query('insert into event (Event_Category,Event_Title,Event_Link,Event_Content,Event_Original_ID) values (?,?,?,?,?)',
            ["티몬", event[i].title, event[i].link, event[i].content, event[i].id], (err) => {
              if (err) console.log(err);
            });
        }
      }
      if (alarm === 1) {
        db.query('select User_ID,User_Email,Alarm_Tmon from user', (err, results) => {
          for (let i = 0; i < results.length; i++) {
            if (results[i].Alarm_Tmon === 1) {
              nodemailer.sendMail(email_template.tmon(results[i].User_Email))
            }
          }
        })
      }
    })
  });
};