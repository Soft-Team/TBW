var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');
var timeFormat = require('../welcome/timeFormat');
var dateformat = require('../welcome/dateformat');

function ongoing(req,res,next){
  /*Ongoing Transactions of Current User, Match(session);
  *(tblchat)*(tbluser)*(tblservice)*(tblservicetag)*(tbltransaction)*(tblmessage)*/
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 1)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ?";
  db.query(stringquery,[req.session.user,req.session.user,req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          var date = results[count].dtmTransScheduled;
          var formatDate = dateformat(date);
          results[count].time = timeFormat(date);
          results[count].date = date.toDateString("en-US").slice(4, 15);
        }
      }
      req.ongoing= results;
      return next();
    });
}

function ongoingRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/ongoing', {thisUserTab: req.user, messCount: req.messCount[0].count, ongoingtab: req.ongoing});
      break;
  }
}
function finishedRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/finished', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function logRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/log', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}

router.get('/ongoing', flog, messCount, ongoing, ongoingRender);
router.get('/finished', flog, messCount, finishedRender);
router.get('/log', flog, messCount, logRender);

exports.transactions = router;
