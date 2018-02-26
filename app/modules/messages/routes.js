var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var timeFormat = require('../welcome/timeFormat');
var messCount = require('../welcome/messCount');
var prepend = require('../welcome/prepend');
var numberFormat = require('../welcome/numberFormat');
var dateformat = require('../welcome/dateformat');

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
  /*Current Chat, Match(params);
  *(tblchat)*/
  db.query("SELECT * FROM tblchat WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      req.fparams= results;
      return next();
    });
}
function ftrans(req,res,next){
  /*Transaction of curent Chat, Match(params);
  *(tblchat)*(tblservice)*(tbltransaction)*/
  db.query("SELECT * FROM tblchat INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbltransaction ON intChatID= intTransChatID WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        req.transstatus = results[0].intTransStatus;

        var zero = "0", Sampm, dm, dd, dy;
        var date = results[0].dtmTransScheduled;
        var formatDate = dateformat(date);
        var time = timeFormat(date);

        results[0].prepTransID = prepend(results[0].intTransID);
        results[0].formatPrice = numberFormat(results[0].fltTransPrice.toFixed(2));

        dm = formatDate.charAt(4).concat(formatDate.charAt(5));
        dd = formatDate.charAt(6).concat(formatDate.charAt(7));
        dy = formatDate.charAt(0) + formatDate.charAt(1) + formatDate.toString().charAt(2) + formatDate.toString().charAt(3);

        results[0].month = dm;
        results[0].day = dd;
        results[0].year = dy;
        results[0].date = date.toDateString("en-US").slice(4, 15);

        results[0].Hstart = time.charAt(0).concat(time.charAt(1));
        results[0].Mstart = time.charAt(3).concat(time.charAt(4));
        results[0].Sampm = time.charAt(6).concat(time.charAt(7));

        console.log('-----VARIABLES-----');
        console.log(time);
        console.log(date);
      }
      else{
        req.transstatus = "none";
      }
      console.log(results);
      req.ftrans= results;
      return next();
    });
}
function ftest(req,res,next){
  /*Transaction of curent Chat, Match(params);
  *(tblchat)*(tblservice)*(tbltransaction)*/
  db.query("SELECT * FROM tblchat INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbltransaction ON intChatID= intTransChatID WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
    if (err) console.log(err);
    if(!(!results[0])){

    }
    /*console.log('-------TEST_RESULTS-------');
    console.log(results);*/
    req.ftest= results;
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

      }
      break;
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
              db.query("SELECT COUNT(intMessID) AS count FROM tblmessage INNER JOIN tblchat ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID WHERE (intChatSeeker= ? AND intSender= 1 AND intMessSSeen= 0) OR (intServAccNo= ? AND intSender= 2 AND intMessPSeen= 0)",[req.session.user, req.session.user], function (err,  results, fields) {
                  if (err) console.log(err);
                  var count = results[0].count
                  db.commit(function(err) {
                      if (err) console.log(err);
                      res.render('messages/views/index', { thisUserTab: req.user, messCount: count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid, transstatus: req.transstatus, transtab: req.ftrans});
                  });
              });
          });
        });
      }
      break;
  }
}

router.get('/', flog, messCount, fchat, render);
router.get('/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, messRender);

router.post('/transet/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, (req, res) => {;
  if(req.transstatus != 'none'){
    res.redirect('/messages/'+req.fparams[0].intChatID);
  }
  else{
    var date = req.body.addYear.toString()+'-'+req.body.addMonth+'-'+req.body.addDay;
    if (req.body.Sampm == 'AM' && req.body.Shours == '12'){
        req.body.Shours = '00';
    }
    if (req.body.Sampm == 'PM' && req.body.Shours != '12'){
      req.body.Shours = (parseFloat(req.body.Shours) + 12).toString();
    }
    var start = req.body.Shours.concat(':'+req.body.Sminutes);
    var dtm = date.concat(' '+start);
    var stringquery1 = "INSERT INTO tbltransaction (intTransChatID, intTransPriceType, fltTransPrice, dtmTransScheduled) VALUES (?,?,?,?)";
    var bodyarray1 = [req.params.chatid, req.body.pricetype, req.body.price, dtm];
    var stringquery2 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 1)";
    var bodyarray2 = [req.params.chatid, "-- I have created an invoice, check it out on the upper right corner!"];
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1, bodyarray1, (err, results, fields) => {
        if (err) res.render('messages/views/invalid/nodate', { thisUserTab: req.user, messCount: req.messCount[0].count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid });
        else
          db.query(stringquery2, bodyarray2, function (err,  resultsCount, fields) {
              if (err) console.log(err);
              db.commit(function(err) {
                  if (err) console.log(err);
                  res.redirect('/messages/'+req.fparams[0].intChatID);
              });
          });
      });
    });
  }
});
router.post('/transet/edit/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, (req, res) => {;
  if(req.transstatus == 'none'){
    res.redirect('/messages/'+req.fparams[0].intChatID);
  }
  else{
    var date = req.body.addYear.toString()+'-'+req.body.addMonth+'-'+req.body.addDay;
    if (req.body.Sampm == 'AM' && req.body.Shours == '12'){
        req.body.Shours = '00';
    }
    if (req.body.Sampm == 'PM' && req.body.Shours != '12'){
      req.body.Shours = (parseFloat(req.body.Shours) + 12).toString();
    }
    var start = req.body.Shours.concat(':'+req.body.Sminutes);
    var dtm = date.concat(' '+start);
    var stringquery1 = "UPDATE tbltransaction SET intTransPriceType= ?, fltTransPrice= ?, dtmTransScheduled= ? WHERE intTransID= ?";
    var bodyarray1 = [req.body.pricetype, req.body.price, dtm, req.ftrans[0].intTransID];
    console.log(bodyarray1);
    var stringquery2 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 1)";
    var bodyarray2 = [req.params.chatid, "-- I have FIXED the invoice, check it out on the upper right corner!"];
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1, bodyarray1, (err, results, fields) => {
        if (err) res.render('messages/views/invalid/nodate', { thisUserTab: req.user, messCount: req.messCount[0].count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid, transtab: req.ftrans });
        else
          db.query(stringquery2, bodyarray2, function (err,  resultsCount, fields) {
              if (err) console.log(err);
              db.commit(function(err) {
                  if (err) console.log(err);
                  res.redirect('/messages/'+req.fparams[0].intChatID);
              });
          });
      });
    });
  }
});

exports.messages = router;
