const cwd = process.cwd();
const jwt = require('jsonwebtoken');
const db = require(cwd+'/config/db');
const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();
const config = require(cwd+'/config/secret');

exports.new_pw_page=(req,res)=>{
  const user_email=req.user.User_Email;
  const user_name=req.user.User_Name;
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    res.render('admin/new_pw',{useremail:user_email,username:user_name});
  }
};

exports.new_pw=(req,res)=>{
  const {old_pw,new_pw,new_pw_verify}=req.body;
  // 패스워드 중복검사
  console.log(old_pw,new_pw,new_pw_verify);
  if(req.user.User_isAdmin===0){
    return res.render('main',{message:"관리자만 접속할 수 있습니다."})
  }else {
    if (new_pw !== new_pw_verify) {
      return res.render('main', {message: "패스워드 잘못 입력됨"});
    } else {
      hasher({password: old_pw, salt: req.user.User_Salt}, (err, pass, salt, hash) => {
        if (err) console.log(err);
        if (hash === req.user.User_Hash) {
          hasher({password: new_pw}, (err, pass, salt, hash) => {
            if (err) console.log(err);
            db.query('update user set User_Hash=?,User_Salt=? where User_ID=?', [hash, salt, req.user.User_ID], (err) => {
              if (err) console.log(err);
              return res.render('main', {message: "성공적으로 변경되었습니다. 다시 로그인해주세요"});
            })
          })
        }
      })
    }
  }
};