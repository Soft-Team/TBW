var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var timeFormat = require('../welcome/timeFormat');
var messCount = require('../welcome/messCount');

function fchat(req,res,next){
  /*All Chats of Current User, Match(session);
  *(tblservice)*(tblchat)*/
  var stringquery = "SELECT C.*, txtMessage, dtmDateSent FROM(SELECT B.*, MAX(intMessID) as MX FROM(SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag WHERE intServAccNo= ? OR intChatSeeker= ?)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ?)";
  stringquery = stringquery.concat("B INNER JOIN tblmessage ON intChatID= intMessChatID GROUP BY intChatID)C INNER JOIN tblmessage ON intMessID= C.MX ORDER BY dtmDateSent DESC;");
  db.query(stringquery,[req.session.user, req.session.user, req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      if (!(!results[0])){
        for(count=0;count<results.length;count++){
          if (results[count].strName.length > 8){
            results[count].name = results[count].strName.substring(0,8).concat('...');
          }
          else{
            results[count].name = results[count].strName;
          }
          if (results[count].strServName.length > 8){
            results[count].servname = results[count].strServName.substring(0,8).concat('...');
          }
          else{
            results[count].servname = results[count].strServName;
          }
          if (results[count].txtMessage.length > 8){
            results[count].txtMessage = results[count].txtMessage.substring(0,8).concat('...');
          }
          date = results[count].dtmDateSent;
          date = [date.getMonth()+1,date.getDate(),date.getFullYear()].join('/')+' '+timeFormat(date);
          results[count].date = date;
        }
      }
      req.chat= results;
      return next();
    });
}
function fmess(req,res,next){
  /*Messages of Current Chat, Match(params);
  *(tbluser)*(tblchat)*(tblmessage)*(tblservice)*(tblservicetag)*/
  db.query("SELECT A.* , (tbluser.strName)Seeker, (tbluser.intAccNo)SAccNo FROM (SELECT * FROM tblchat INNER JOIN tblmessage ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intAccNo= intServAccNo INNER JOIN tblservicetag ON intServTagID= intServTag)AS A INNER JOIN tbluser ON tbluser.intAccNo= A.intChatSeeker WHERE A.intChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          if(req.session.user == results[count].intAccNo){
            results[count].sendType = 1;
          }
          else if(req.session.user == results[count].SAccNo){
            results[count].sendType = 2;
          }
          else{
            results[count].sendType = 0;
          }
          results[count].formatdate = [results[count].dtmDateSent.getMonth()+1,
               results[count].dtmDateSent.getDate(),
               results[count].dtmDateSent.getFullYear()].join('/')+' '+
               timeFormat(results[count].dtmDateSent);
        }
      }
      req.mess= results;
      return next();
    });
}
function fparams(req,res,next){
  db.query("SELECT * FROM tblchat WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        req.chatparams= results[0].intChatID;
      }
      return next();
    });
}

function render(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.chat[0]){
        res.render('messages/views/nochat', { thisUserTab: req.user, messCount: req.messCount[0].count });
      }
      else{
        res.redirect('/messages/'+req.chat[0].intChatID);
        break;
      }
  }
}
function messRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.chat[0]){
        res.render('messages/views/nochat', { thisUserTab: req.user, messCount: req.messCount[0].count });
      }
      else if(!req.mess[0]){
        res.redirect('/noroute');
      }
      else if(req.mess[0].sendType == 0){
        res.redirect('/restrict');
      }
      else{
        var stringquery = "UPDATE tblmessage SET intMessSSeen= 1 WHERE intMessChatID= ?";
        if(req.mess[0].sendType == 1){
          stringquery = "UPDATE tblmessage SET intMessPSeen= 1 WHERE intMessChatID= ?";
        }
        db.beginTransaction(function(err) {
          if (err) console.log(err);
          db.query(stringquery,[req.params.chatid], function (err,  results, fields) {
              if (err) console.log(err);
              db.query("SELECT COUNT(intMessID) AS count FROM tblmessage INNER JOIN tblchat ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID WHERE (intChatSeeker= '1' AND intSender= 1 AND intMessSSeen= 0) OR (intServAccNo= '1' AND intSender= 2 AND intMessPSeen= 0)",[req.session.user, req.session.user], function (err,  resultsCount, fields) {
                  if (err) console.log(err);
                  db.commit(function(err) {
                      if (err) console.log(err);
                      res.render('messages/views/index', { thisUserTab: req.user, messCount: resultsCount[0].count , messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.chatparams });
                  });
              });
          });
        });
      }
      break;
  }
}

router.get('/', flog, messCount, fchat, render);
router.get('/:chatid', flog, messCount, fmess, fchat, fparams, messRender);

exports.messages = router;
