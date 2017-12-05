exports.email_verify = (email,token) =>{
  return {
    from: 'jjhh3079@gmail.com',
    to : email,
    subject: "Crawling SNS 이메일을 인증해주세요",
    text : "링크를 클릭하여 인증해주세요 : " + "http://192.9.44.53:65005/email_verify?token=" + token
  };
};
exports.find_pw = (email,token) =>{
  return {
    from: 'jjhh3079@gmail.com',
    to : email,
    subject: "Crawling SNS 이메일을 인증해주세요",
    text : "비밀번호를 다시 설정하려면 링크를 클릭하세요 : " + "http://192.9.44.53:65005/new_pw?token=" + token
  };
};
exports.eleven=(email)=>{
  return {
    from: 'jjhh3079@gmail.com',
    to : email,
    subject: "11번가에서 새로운 이벤트가 생겼어요!",
    text : "빨리 이벤트를 확인해보세요! http://192.9.44.53:65005"
  }
};
exports.tmon=(email)=>{
  return {
    from: 'jjhh3079@gmail.com',
    to : email,
    subject: "티몬에서 새로운 이벤트가 생겼어요!",
    text : "빨리 이벤트를 확인해보세요! http://192.9.44.53:65005"
  }
};
exports.ppomppu=(email)=>{
  return {
    from: 'jjhh3079@gmail.com',
    to : email,
    subject: "뽐뿌에서 새로운 핫딜이 생겼어요!",
    text : "빨리 핫딜을 확인해보세요! http://192.9.44.53:65005"
  }
};
exports.coolenjoy=(email)=>{
  return {
    from: 'jjhh3079@gmail.com',
    to : email,
    subject: "쿨엔조이에서 새로운 핫딜이 생겼어요!",
    text : "빨리 핫딜을 확인해보세요! http://192.9.44.53:65005"
  }
};