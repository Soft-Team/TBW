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
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID LEFT JOIN (SELECT * FROM tblrating WHERE intRatedAccNo != ?)X ON intRateTransID= intTransID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 1)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ?";
  db.query(stringquery,[req.session.user,req.session.user,req.session.user,req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          var date = results[count].dtmTransScheduled;
          var formatDate = dateformat(date);
          results[count].time = timeFormat(date);
          results[count].date = date.toDateString("en-US").slice(4, 15);

          results[count].rate = 1;
          if(!results[count].intRateID){
            results[count].rate = 0;
          }
        }
      }
      req.ongoing= results;
      return next();
    });
}
function ongoingParams(req,res,next){
  /*Selected Ongoing Transactions of Current User, Match(session, params);
  *(tblchat)*(tbluser)*(tblservice)*(tblservicetag)*(tbltransaction)*(tblmessage)*/
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 1)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ? AND intTransID= ?";
  db.query(stringquery,[req.session.user,req.session.user,req.session.user,req.params.transid], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          var date = results[count].dtmTransScheduled;
          var formatDate = dateformat(date);
          results[count].time = timeFormat(date);
          results[count].date = date.toDateString("en-US").slice(4, 15);
        }
      }
      req.ongoingParams= results;
      return next();
    });
}
function finished(req,res,next){
  /*Finished Transactions of Current User, Match(session);
  *(tblchat)*(tbluser)*(tblservice)*(tblservicetag)*(tbltransaction)*(tblmessage)*/
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID LEFT JOIN (SELECT * FROM tblrating WHERE intRatedAccNo != ?)X ON intRateTransID= intTransID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 2)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ?";
  db.query(stringquery,[req.session.user,req.session.user,req.session.user,req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          var date = results[count].dtmTransScheduled;
          var formatDate = dateformat(date);
          results[count].time = timeFormat(date);
          results[count].date = date.toDateString("en-US").slice(4, 15);

          var dateEnd = results[count].dtmTransEnded;
          var formatDateEnd = dateformat(dateEnd);
          results[count].timeEnd = timeFormat(dateEnd);
          results[count].dateEnd = dateEnd.toDateString("en-US").slice(4, 15);

          results[count].rate = 1;
          if(!results[count].intRateID){
            results[count].rate = 0;
          }
        }
      }
      console.log(results);
      req.finished= results;
      return next();
    });
}
function finishedParams(req,res,next){
  /*Selected Ongoing Transactions of Current User, Match(session, params);
  *(tblchat)*(tbluser)*(tblservice)*(tblservicetag)*(tbltransaction)*(tblmessage)*/
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 2)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ? AND intTransID= ?";
  db.query(stringquery,[req.session.user,req.session.user,req.session.user,req.params.transid], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          var date = results[count].dtmTransScheduled;
          var formatDate = dateformat(date);
          results[count].time = timeFormat(date);
          results[count].date = date.toDateString("en-US").slice(4, 15);
        }
      }
      req.finishedParams= results;
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
      res.render('transactions/views/ongoing', {thisUserTab: req.user, messCount: req.messCount[0].count, ongoingtab: req.ongoing });
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
      res.render('transactions/views/finished', {thisUserTab: req.user, messCount: req.messCount[0].count, finishedtab: req.finished });
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
function finRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/fin', {thisUserTab: req.user, messCount: req.messCount[0].count, ongoingtab: req.ongoing, ongoingParams: req.ongoingParams });
      break;
  }
}
function raterevRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/raterev', {thisUserTab: req.user, messCount: req.messCount[0].count, finishedtab: req.finished, finishedParams: req.finishedParams });
      break;
  }
}

router.get('/ongoing', flog, messCount, ongoing, ongoingRender);
router.get('/finished', flog, messCount, finished, finishedRender);
router.get('/log', flog, messCount, logRender);
router.get('/ongoing/finish/:transid', flog, messCount, ongoing, ongoingParams, finRender);
router.get('/ratereview/:transid', flog, messCount, finished, finishedParams, raterevRender);

router.post('/ongoing/finish/:transid', flog, ongoingParams,  (req, res) => {
  if(!req.ongoingParams[0]){
    res.redirect('/transactions/ongoing');
  }
  else{
    if(req.ongoingParams[0].intServAccNo != req.session.user){
      res.redirect('/transactions/ongoing');
    }
    else{
      db.beginTransaction(function(err) {
          if (err) console.log(err);
          db.query("UPDATE tbltransaction SET intTransStatus= 2, dtmTransEnded= NOW() WHERE intTransID= ?",[req.params.transid], (err, results, fields) => {
              if (err) console.log(err);
              db.query("INSERT INTO tblrating (intRatedAccNo, intRateTransID, intRating, datRateDate, txtRateReview) VALUES (?,?,?,CURDATE(),?)", [req.ongoingParams[0].intChatSeeker, req.ongoingParams[0].intTransID, req.body.rating, req.body.review], function (err,  results, fields) {
                  if (err) console.log(err);
                  db.commit(function(err) {
                      if (err) console.log(err);
                      res.redirect('/transactions/finished');
                  });
              });
          });
      });
    }
  }
});
router.post('/ratereview/:transid', flog, finishedParams,  (req, res) => {
  console.log(req.body);
  if(!req.finishedParams[0]){
    res.redirect('/transactions/finished');
  }
  else{
    if(req.finishedParams[0].intChatSeeker != req.session.user){
      res.redirect('/transactions/finished');
    }
    else{
      db.query("INSERT INTO tblrating (intRatedAccNo, intRateTransID, intRating, datRateDate, txtRateReview) VALUES (?,?,?,CURDATE(),?)", [req.finishedParams[0].intServAccNo, req.finishedParams[0].intTransID, req.body.rating, req.body.review], function (err,  results, fields) {
          if (err) console.log(err);
          res.redirect('/transactions/finished');
      });
    }
  }
});

exports.transactions = router;
