var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function fuser(req,res,next){
  db.query("SELECT * FROM tbluser WHERE intAccNo= ?",[req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      req.user= results;
      return next();
    });
}
function fchat(req,res,next){
  db.query("SELECT * FROM tblservice INNER JOIN tblchat ON intServAccNo= intChatSeeker WHERE intServAccNo= ? OR intChatSeeker= ?",[req.session.user, req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      req.chat= results;
      return next();
    });
}
function fmess(req,res,next){
  db.query("SELECT A.* , (tbluser.strName)Seeker, (tbluser.intAccNo)SAccNo FROM (SELECT * FROM tblchat INNER JOIN tblmessage ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intAccNo= intServAccNo INNER JOIN tblservicetag ON intServTagID= intServTag)AS A INNER JOIN tbluser ON tbluser.intAccNo= A.intChatSeeker WHERE A.intChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
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
      }
      req.mess= results;
      return next();
    });
}

function render(req,res){
  res.render('messages/views/index', {chattab: req.chat});
}
function messRender(req,res){
  if(!req.mess[0]){
    res.redirect('/noroute')
  }
  else if(req.mess[0].sendType == 0){
    res.redirect('/restrict')
  }
  else{
    res.render('messages/views/index', { usertab: req.user , messtab: req.mess, messOne: req.mess[0] });
  }
}

router.get('/', fchat, render);
router.get('/:chatid', fuser, fmess, messRender);

exports.messages = router;
