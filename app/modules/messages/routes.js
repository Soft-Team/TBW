var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function chat(req,res,next){
  db.query("SELECT * FROM tblchat INNER JOIN tblmessage ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intAccNo= intServAccNo INNER JOIN tblservicetag ON intServTagID= intServTag WHERE intAccNo= 1", (err, results, fields) => {
      if (err) console.log(err);
      req.chat= results;
      return next();
    });
}

function render(req,res){
  res.render('messages/views/index', { chattab: req.chat });
}

router.get('/:chatid', chat, render);

exports.messages = router;
