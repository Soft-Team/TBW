var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var timeFormat = require('../welcome/timeFormat');
var messCount = require('../welcome/messCount');
var prepend = require('../welcome/prepend');
var numberFormat = require('../welcome/numberFormat');
var dateformat = require('../welcome/dateformat');
var formatAMPM = require('../welcome/formatAMPM');
var ellipsis = require('../welcome/ellipsis');

function fchat(req,res,next){
  /*All Chats of Current User, Match(session);
  *(tblservice)*(tblchat)*/
  var stringquery = "SELECT * FROM(SELECT C.*, txtMessage, intMessPSeen, intMessSSeen, dtmDateSent FROM(SELECT B.*, MAX(intMessID) as MX FROM(SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag WHERE intServAccNo= ? OR intChatSeeker= ?)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ?)";
  stringquery = stringquery.concat("B INNER JOIN tblmessage ON intChatID= intMessChatID GROUP BY intChatID)C INNER JOIN tblmessage ON intMessID= C.MX)D INNER JOIN tbluser ON tbluser.intAccNo = D.intAccNo ORDER BY dtmDateSent DESC");
  db.query(stringquery,[req.session.user, req.session.user, req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      if (!(!results[0])){
        for(count=0;count<results.length;count++){
          if (results[count].strName.length > 11){
            results[count].name = ellipsis(results[count].strName,0,9);
            results[count].ellipsis = 1;
          }
          else{
            results[count].name = results[count].strName;
            results[count].ellipsis = 0;
          }
          if (results[count].strServName.length > 8){
            results[count].servname = ellipsis(results[count].strServName,0,6);
            results[count].tagEllipsis = 1;
          }
          else{
            results[count].servname = results[count].strServName;
            results[count].tagEllipsis = 0;
          }
          if (results[count].txtMessage.length > 8){
            results[count].txtMessage = ellipsis(results[count].txtMessage,0,8);
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
  db.query(`SELECT A.* , (tbluser.strName)Seeker, (tbluser.intAccNo)SAccNo, (Provider.strName)Provider FROM (SELECT * FROM tblchat INNER JOIN tblmessage ON intChatID= intMessChatID
    INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intAccNo= intServAccNo
    INNER JOIN tblservicetag ON intServTagID= intServTag)AS A INNER JOIN tbluser ON tbluser.intAccNo= A.intChatSeeker
    INNER JOIN(SELECT * FROM tbluser)Provider ON intServAccNo= Provider.intAccNo
    WHERE A.intChatID= ?`,[req.params.chatid], (err, results, fields) => {
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
  *(tblchat)*(tblservice)*(tbltransaction)*(tbluser)*/
  db.query("SELECT * FROM tblchat INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbltransaction ON intChatID= intTransChatID INNER JOIN tbluser ON intServAccNo= intAccNo WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
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

      }
      else{
        req.transstatus = "none";
      }
      req.ftrans= results;
      return next();
    });
}
function ftodaysched(req,res,next){
  /*Today Sched of Current Chat Provider, Match(params)
  *(tblservicetag)*(tbluser)*(tblschedule)*(tblspecialsched)*(tblchat)*/
  db.query("SELECT *, CURDATE() AS curdate FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tbluser ON intAccNo= intServAccNo LEFT JOIN (SELECT * FROM tblschedule WHERE strSchedDay= DAYNAME(CURDATE()))A ON intAccNo= intSchedAccNo LEFT JOIN(SELECT * FROM tblspecialsched WHERE datSpecialDate= CURDATE())B ON intSpecialAccNo= intAccNo WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
    if (err) console.log(err);
    if(!(!results[0])){
      results[0].date = results[0].curdate.toDateString("en-US").slice(4, 15);
      results[0].unav = 0;
      if(!(!results[0].intSpecialID)){
        if(!results[0].tmSpecialStart){
          results[0].unav = 1;
        }
        else{
        results[0].formatstart = formatAMPM(results[0].tmSpecialStart);
        results[0].formatend = formatAMPM(results[0].tmSpecialEnd);
        }
      }
      else if(!(!results[0].intSchedID)){
        results[0].formatstart = formatAMPM(results[0].tmSchedStart);
        results[0].formatend = formatAMPM(results[0].tmSchedEnd);
      }
      else{
        results[0].unav = 3;
      }
    }
    req.ftodaysched= results;
    return next();
  });
}
function fregularSched(req, res, next){
  /*Regular Schedule of Current Chat Provider, Match(params)
  *(tblschedule)*/
  db.query("SELECT * FROM tblschedule INNER JOIN tblservice ON intSchedAccNo= intServAccNo INNER JOIN tblchat ON intServID= intChatServ WHERE intChatID= ?",[req.params.chatid], function (err, results, fields) {
      if (err) return res.send(err);
      if(!results[0]){
        var empty = 1;
      }
      else{
        var empty = 0;
        for(count=0;count<results.length;count++){
          results[count].formatstart = formatAMPM(results[count].tmSchedStart);
          results[count].formatend = formatAMPM(results[count].tmSchedEnd);
          switch (results[count].strSchedDay){
            case "Sunday":
              for(count1=0;count1<results.length;count1++){
                results[count1].sunday = 1;
              }
              break;
            case "Monday":
              for(count1=0;count1<results.length;count1++){
                results[count1].monday = 1;
              }
              break;
            case "Tuesday":
              for(count1=0;count1<results.length;count1++){
                results[count1].tuesday = 1;
              }
              break;
            case "Wednesday":
              for(count1=0;count1<results.length;count1++){
                results[count1].wednesday = 1;
              }
              break;
            case "Thursday":
              for(count1=0;count1<results.length;count1++){
                results[count1].thursday = 1;
              }
              break;
            case "Friday":
              for(count1=0;count1<results.length;count1++){
                results[count1].friday = 1;
              }
              break;
            case "Saturday":
              for(count1=0;count1<results.length;count1++){
                results[count1].saturday = 1;
              }
              break;
          }
        }
        if (!results[0].sunday){
          for(count=0;count<results.length;count++){
            results[count].sunday = 0;
            results[results.length-1].sunday = 2;
          }
        }
        if (!results[0].monday){
          for(count=0;count<results.length;count++){
            results[count].monday = 0;
            results[results.length-1].monday = 2;
          }
        }
        if (!results[0].tuesday){
          for(count=0;count<results.length;count++){
            results[count].tuesday = 0;
            results[results.length-1].tuesday = 2;
          }
        }
        if (!results[0].wednesday){
          for(count=0;count<results.length;count++){
            results[count].wednesday = 0;
            results[results.length-1].wednesday = 2;
          }
        }
        if (!results[0].thursday){
          for(count=0;count<results.length;count++){
            results[count].thursday = 0;
            results[results.length-1].thursday = 2;
          }
        }
        if (!results[0].friday){
          for(count=0;count<results.length;count++){
            results[count].friday = 0;
            results[results.length-1].friday = 2;
          }
        }
        if (!results[0].saturday){
          for(count=0;count<results.length;count++){
            results[count].saturday = 0;
            results[results.length-1].saturday = 2;
          }
        }
      }
      req.fregularSched = results;
      req.empty = empty;
      return next();
  });
}
function fspecialSched(req, res, next){
  /*Special Schedule of Current Chat Provider, Match(params)
  *(tblspecialschedule)*(tblservice)*/
  db.query("SELECT * FROM tblspecialsched INNER JOIN tblservice ON intSpecialAccNo= intServAccNo INNER JOIN tblchat ON intChatServ= intServID WHERE intChatID= ? AND datSpecialDate >= CURDATE() ORDER BY datSpecialDate ASC",[req.params.chatid], function (err, results, fields) {
      if (err) return res.send(err);
      if(!results[0]){
        var empty = 1;
      }
      else{
        var empty = 0;
        for(count=0;count<results.length;count++){
          if(!results[count].tmSpecialStart){
            results[count].unav = 1;
          }
          else{
            results[count].formatstart = formatAMPM(results[count].tmSpecialStart);
            results[count].formatend = formatAMPM(results[count].tmSpecialEnd);
            results[count].unav = 0;
          }
          results[count].date = results[count].datSpecialDate.toDateString("en-US").slice(4, 15);
        }
      }
      req.fspecialSched = results;
      req.emptyspecial = empty;
      return next();
  });
}
function fprovider(req,res,next){
  /*Service Provider, Match(params);
  *(tblchat)*(tblservice)*/
  db.query("SELECT * FROM tblchat INNER JOIN tblservice ON intChatServ= intServID WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      req.fprovider= results;
      return next();
    });
}
function fmessServ(req,res,next){
  /*Transaction of curent Chat, Match(params);
  *(tblchat)*(tblservice)*(tbltransaction)*/
  db.query("SELECT *, COUNT(intServTagID)CNT FROM tblservicetag INNER JOIN tblservice ON intServTagID= intServTag INNER JOIN tblchat ON intServID= intChatServ WHERE intServAccNo= ? OR intChatSeeker= ? GROUP BY intServTagID ORDER BY CNT DESC",[req.session.user, req.session.user], (err, results, fields) => {
    if (err) console.log(err);
    if(!(!results[0])){

    }
    req.fmessServ= results;
    return next();
  });
}
function fworkers(req,res,next){
  /*Available Workers of Current User, Match(session,params);
  *(tblworker)*/
  db.query("SELECT * FROM tblworker LEFT JOIN tbltransaction ON intWorkerTrans= intTransID LEFT JOIN tblchat ON intTransChatID= intChatID WHERE intWorkBusID= ? AND intWorkerStatus= 1 AND (intChatID= ? OR intChatID IS NULL)",[req.session.user, req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      req.fworkers= results;
      return next();
    });
}
function ftransworkers(req,res,next){
  /*Proposed Workers of Current Transaction, Match(params);
  *(tblworker)*(tbltransaction)*(tblchat)*/
  db.query("SELECT * FROM tblworker INNER JOIN tbltransaction ON intWorkerTrans= intTransID INNER JOIN tblchat ON intChatID= intTransChatID WHERE intTransChatID= ?",[req.params.chatid], (err, results, fields) => {
      if (err) console.log(err);
      req.ftransworkers= results;
      return next();
    });
}
function ftest(req,res,next){
  /*Test Function, Match(params);
  *(tblchat)*/
  db.query("SELECT * FROM tblchat WHERE intChatID= ?",[req.params.chatid], (err, results, fields) => {
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
    case 0:
      res.render('home/views/worker');
      break;
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
    case 0:
      res.render('home/views/worker');
      break;
    case 1:
      if(!req.mess[0]){
        res.redirect('/noroute');
      }
      else{
        res.render('messages/views/admin-view', { thisUserTab: req.user, messtab: req.mess, messOne: req.mess[0]});
      }
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
                      if(!req.ftodaysched[0]){
                        res.redirect('/noroute');
                      }
                      else
                        res.render('messages/views/index', { thisUserTab: req.user, messCount: count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid, transstatus: req.transstatus, transtab: req.ftrans, todayTab: req.ftodaysched, regSchedTab: req.fregularSched, empty: req.empty, specSchedTab: req.fspecialSched, emptyspecial: req.emptyspecial, messServ: req.fmessServ, workers: req.fworkers, transworkers: req.ftransworkers });
                  });
              });
          });
        });
      }
      break;
  }
}

router.get('/', flog, messCount, fchat, render);
router.get('/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, ftodaysched, fregularSched, fspecialSched, fmessServ, fworkers, ftransworkers, messRender);

router.post('/transet/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, ftodaysched, fregularSched, fspecialSched, fworkers, ftransworkers, (req, res) => {
  var body = req.body;
  var elementOne = Object.keys(body)[0];
  var size = Object.keys(body).length;
  var paramsarray= [];

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
    var stringquery3= "SELECT @A:=intTransID FROM tbltransaction WHERE intTransChatID= ?";
    var bodyarray3 = [req.params.chatid];
    var stringquery4= "UPDATE tblworker SET intWorkerTrans= @A WHERE intWorkerID= ?";
    var bodyarray4 = [elementOne];
    for(count=1;count<size-8;count++){
      var element = Object.keys(body)[count];
      for(count1=0;count1<req.fworkers.length;count1++){
        if(element == req.fworkers[count1].intWorkerID){
          stringquery4 = stringquery4.concat(" OR intWorkerID= ?");
          paramsarray.push(element);
        }
      }
    }
    for(count=0;count<paramsarray.length;count++){
      bodyarray4.push(paramsarray[count]);
    }

    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1, bodyarray1, (err, results, fields) => {
        if (err) res.render('messages/views/invalid/nodate', { thisUserTab: req.user, messCount: req.messCount[0].count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid, transstatus: req.transstatus, todayTab: req.ftodaysched, regSchedTab: req.fregularSched, empty: req.empty, specSchedTab: req.fspecialSched, emptyspecial: req.emptyspecial, workers: req.fworkers, transworkers: req.ftransworkers});
        else
          db.query(stringquery2, bodyarray2, function (err,  resultsCount, fields) {
              if (err) console.log(err);
              if(req.valid == 2 || !req.fworkers[0]){
                db.commit(function(err) {
                    if (err) console.log(err);
                    res.redirect('/messages/'+req.fparams[0].intChatID);
                });
              }
              else if(req.valid == 3){
                db.query(stringquery3, bodyarray3, function (err,  resultsCount, fields) {
                    if (err) console.log(err);
                    db.query(stringquery4, bodyarray4, function (err,  resultsCount, fields) {
                        if (err) console.log(err);
                        db.commit(function(err) {
                            if (err) console.log(err);
                            res.redirect('/messages/'+req.fparams[0].intChatID);
                        });
                    });
                });
              }
          });
      });
    });
  }

});
router.post('/transet/edit/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, ftodaysched, fregularSched, fspecialSched, fworkers, ftransworkers, (req, res) => {
  var body = req.body;
  var elementOne = Object.keys(body)[0];
  var size = Object.keys(body).length;
  var paramsarray= [];

  if(req.transstatus == 'none'){
    res.redirect('/messages/'+req.fparams[0].intChatID);
  }
  else if(req.valid == 2){
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
    var stringquery2 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 1)";
    var bodyarray2 = [req.params.chatid, "-- I have FIXED the invoice, check it out on the upper right corner!"];

    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1, bodyarray1, (err, results, fields) => {
        if (err) res.render('messages/views/invalid/nodate', { thisUserTab: req.user, messCount: req.messCount[0].count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid, transstatus: req.transstatus, transtab: req.ftrans, todayTab: req.ftodaysched, regSchedTab: req.fregularSched, empty: req.empty, specSchedTab: req.fspecialSched, emptyspecial: req.emptyspecial, workers: req.fworkers, transworkers: req.ftransworkers});
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
  else if(!req.fworkers[0]){
    res.redirect('/messages/'+req.fparams[0].intChatID);
  }
  else if(req.valid == 3){
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
    var stringquery2 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 1)";
    var bodyarray2 = [req.params.chatid, "-- I have FIXED the invoice, check it out on the upper right corner!"];
    var stringquery3= "SELECT @A:=intTransID FROM tbltransaction WHERE intTransChatID= ?";
    var bodyarray3 = [req.params.chatid];
    var stringquery4= "UPDATE tblworker SET intWorkerTrans= NULL WHERE intWorkerTrans= @A";
    var stringquery5= "UPDATE tblworker SET intWorkerTrans= @A WHERE intWorkerID= ?";
    var bodyarray5 = [elementOne];
    for(count=1;count<size-8;count++){
      var element = Object.keys(body)[count];
      for(count1=0;count1<req.fworkers.length;count1++){
        if(element == req.fworkers[count1].intWorkerID){
          stringquery5 = stringquery5.concat(" OR intWorkerID= ?");
          paramsarray.push(element);
        }
      }
    }
    for(count=0;count<paramsarray.length;count++){
      bodyarray5.push(paramsarray[count]);
    }

    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1, bodyarray1, (err, results, fields) => {
        if (err) res.render('messages/views/invalid/nodate', { thisUserTab: req.user, messCount: req.messCount[0].count, messtab: req.mess, messOne: req.mess[0], chattab: req.chat, params: req.params.chatid, transstatus: req.transstatus, transtab: req.ftrans, todayTab: req.ftodaysched, regSchedTab: req.fregularSched, empty: req.empty, specSchedTab: req.fspecialSched, emptyspecial: req.emptyspecial, workers: req.fworkers, transworkers: req.ftransworkers});
        else
          db.query(stringquery2, bodyarray2, function (err,  resultsCount, fields) {
              if (err) console.log(err);
              db.query(stringquery3, bodyarray3, function (err,  resultsCount, fields) {
                  if (err) console.log(err);
                  db.query(stringquery4, function (err,  resultsCount, fields) {
                      if (err) console.log(err);
                      db.query(stringquery5, bodyarray5, function (err,  resultsCount, fields) {
                          if (err) console.log(err);
                          db.commit(function(err) {
                              if (err) console.log(err);
                              res.redirect('/messages/'+req.fparams[0].intChatID);
                          });
                      });
                  });
              });
          });
      });
    });
  }

});
router.post('/transet/accept/:chatid', flog, messCount, fmess, fchat, fparams, ftrans, ftransworkers, (req, res) => {
  if(req.transstatus == 'none'){
    res.redirect('/messages/'+req.fparams[0].intChatID);
  }
  else{
    var stringquery1 = "UPDATE tbltransaction SET intTransStatus= 1, dtmTransStarted= NOW() WHERE intTransID= ?";
    var bodyarray1 = [req.ftrans[0].intTransID];
    var stringquery2 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessSSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 2)";
    var bodyarray2 = [req.params.chatid, "-- I have ACCEPTED your offer, transaction is now ONGOING !"];

    var stringquery3 = "INSERT INTO tbltransworkers (intTWTransID, intTWWorkerID) VALUES ", bodyarray3 = []
    for(count=0;count<req.ftransworkers.length;count++){
      stringquery3 = stringquery3.concat("(?,?)");
      if(count < req.ftransworkers.length-1){
        stringquery3 = stringquery3.concat(",");
      }
      bodyarray3.push(req.ftrans[0].intTransID);
      bodyarray3.push(req.ftransworkers[count].intWorkerID);
    }

    var stringquery4 = "UPDATE tblworker SET intWorkerStatus= 2 WHERE intWorkerTrans= ?";
    var bodyarray4 = [req.ftrans[0].intTransID];
    var stringquery5 = "SELECT * FROM tblworker WHERE intWorkerStatus!= 2 AND intWorkBusID= ?";
    var bodyarray5 = [req.ftrans[0].intAccNo];

    var stringquery6 = "UPDATE tblservice SET intServStatus= 2 WHERE intServAccNo= ?";
    var bodyarray6 = [req.ftrans[0].intAccNo];
    var stringquery7 = "SELECT * FROM tblchat INNER JOIN tblservice ON intChatServ= intServID LEFT JOIN tbltransaction ON intChatID= intTransChatID WHERE intServAccNo= ? AND intChatStatus= 1 AND intChatID!= ?;";
    var bodyarray7 = [req.ftrans[0].intAccNo, req.params.chatid];

    var stringquery8 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ";
    var bodyarray8 = [];
    var stringquery9 = "UPDATE tblchat SET intChatStatus= 0 WHERE ";//
    var bodyarray9 = [];
    var stringquery10 = "INSERT INTO tblcancellation (intCancelChatID, intCancelAccNo, dtmCancelDate, txtCancelReason) VALUES ";//
    var bodyarray10 = [];
    var stringquery11 = "UPDATE tbltransaction SET intTransStatus= 3 WHERE ";//
    var bodyarray11 = [];

    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1, bodyarray1, function (err,  resultsCount, fields) {
        if (err) console.log(err);
        db.query(stringquery2, bodyarray2, function (err,  results, fields) {
            if (err) console.log(err);
            if(req.ftrans[0].intType == 2 || !req.ftransworkers[0]){
              db.commit(function(err) {
                  if (err) console.log(err);
                  res.redirect('/messages/'+req.fparams[0].intChatID);
              });
            }
            else if(req.ftrans[0].intType == 3){
              db.query(stringquery3, bodyarray3, function (err,  results, fields) {
                  if (err) console.log(err);
                  db.query(stringquery4, bodyarray4, function (err,  results, fields) {
                      if (err) console.log(err);
                      db.query(stringquery5, bodyarray5, function (err,  results, fields) {
                          if (err) console.log(err);
                          if(!results[0]){
                            db.query(stringquery6, bodyarray6, function (err,  results, fields) {
                                if (err) console.log(err);
                                db.query(stringquery7, bodyarray7, function (err,  results, fields) {
                                    if (err) console.log(err);
                                    if(!(!results[0])){
                                      for(count=0;count<results.length;count++){
                                        stringquery8 = stringquery8.concat("( ?, ?, NOW(), 1, 1)");
                                        stringquery9 = stringquery9.concat("intChatID= ?");
                                        stringquery10 = stringquery10.concat("(?,?,NOW(),?)");
                                        if(!(!results[count].intTransID)){
                                          stringquery11 = stringquery11.concat("intTransID= ?");
                                          bodyarray11.push(results[count].intTransID);
                                        }
                                        if(count < results.length-1){
                                          stringquery8 = stringquery8.concat(",");
                                          stringquery9 = stringquery9.concat(" AND ");
                                          stringquery10 = stringquery10.concat(",");
                                          if(!(!results[count].intTransID)){
                                            stringquery11 = stringquery11.concat(" AND ");
                                          }
                                        }
                                        bodyarray8.push(results[count].intChatID);
                                        bodyarray8.push("-- Our Workers are Busy at the moment, please come back once we are available!");
                                        bodyarray9.push(results[count].intChatID);
                                        bodyarray10.push(results[count].intChatID);
                                        bodyarray10.push(req.session.user);
                                        bodyarray10.push("-- Our Workers are Busy at the moment");

                                      }
                                      db.query(stringquery8, bodyarray8, function (err,  results, fields) {
                                          if (err) console.log(err);
                                          db.query(stringquery9, bodyarray9, function (err,  results, fields) {
                                              if (err) console.log(err);
                                              db.query(stringquery10, bodyarray10, function (err,  results, fields) {
                                                  if (err) console.log(err);
                                                  if(!bodyarray11[0]){
                                                    db.commit(function(err) {
                                                        if (err) console.log(err);
                                                        res.redirect('/messages/'+req.fparams[0].intChatID);
                                                    });
                                                  }
                                                  else{
                                                    db.query(stringquery11, bodyarray11, function (err,  results, fields) {
                                                        if (err) console.log(err);
                                                        db.commit(function(err) {
                                                            if (err) console.log(err);
                                                            res.redirect('/messages/'+req.fparams[0].intChatID);
                                                        });
                                                    });
                                                  }
                                              });
                                          });
                                      });
                                    }
                                    else{
                                      db.commit(function(err) {
                                          if (err) console.log(err);
                                          res.redirect('/messages/'+req.fparams[0].intChatID);
                                      });
                                    }
                                });
                            });
                          }
                          else{
                            db.commit(function(err) {
                                if (err) console.log(err);
                                res.redirect('/messages/'+req.fparams[0].intChatID);
                            });
                          }
                      });
                  });
              });
            }
        });
      });
    });
  }
});
router.post('/cancel/:chatid', flog, ftrans, fprovider, ftransworkers, (req, res) => {
  if(req.session.user == req.fprovider[0].intChatSeeker)
    var stringquery1 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessSSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 2)";
  else
    var stringquery1 = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ( ?, ?, NOW(), 1, 1)";
  var bodyarray1 = [req.params.chatid, "-- has CANCELLED this chat and its transaction."];
  var stringquery2 = "UPDATE tblchat SET intChatStatus= 0 WHERE intChatID= ?";//
  var bodyarray2 = [req.params.chatid];
  if(req.fprovider[0].intServStatus != 0)
    var stringquery3 = "UPDATE tblservice SET intServStatus= 1 WHERE intServAccNo= ? AND intServStatus= 2";
  else
    var stringquery3 = "SELECT * FROM tblservice WHERE intServAccNo= ?"; /*Filler Query*/
  var bodyarray3 = [req.fprovider[0].intServAccNo];
  var stringquery4 = "INSERT INTO tblcancellation (intCancelChatID, intCancelAccNo, dtmCancelDate, txtCancelReason) VALUES (?,?,NOW(),?)";//
  var bodyarray4 = [req.params.chatid, req.session.user, req.body.desc];

  if(!(!req.ftrans[0])){
    var stringquery5 = "UPDATE tbltransaction SET intTransStatus= 3 WHERE intTransID= ?";//
    var bodyarray5 = [req.ftrans[0].intTransID];

    var stringquery6 = "UPDATE tblworker SET intWorkerTrans= NULL, intWorkerStatus= 1 WHERE intWorkerTrans= ?";
    var bodyarray6 = [req.ftrans[0].intTransID];
  }

  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query(stringquery1, bodyarray1, function (err,  results, fields) {
        if (err) console.log(err);
        db.query(stringquery2, bodyarray2, (err, results, fields) => {
            if (err) console.log(err);
            db.query(stringquery3, bodyarray3, function (err,  results, fields) {
                if (err) console.log(err);
                db.query(stringquery4, bodyarray4, function (err,  results, fields) {
                    if (err) console.log(err);
                    if(!req.ftrans[0]){
                      db.commit(function(err) {
                          if (err) console.log(err);
                          res.redirect('/messages');
                      });
                    }
                    else{
                      db.query(stringquery5, bodyarray5, function (err,  results, fields) {
                          if (err) console.log(err);
                          if(req.ftrans[0].intType == 2 || !req.ftransworkers[0]){
                            db.commit(function(err) {
                                if (err) console.log(err);
                                res.redirect('/messages');
                            });
                          }
                          else if(req.ftrans[0].intType == 3){
                            db.query(stringquery6, bodyarray6, function (err,  results, fields) {
                                if (err) console.log(err);
                                db.commit(function(err) {
                                    if (err) console.log(err);
                                    res.redirect('/messages');
                                });
                            });
                          }
                      });
                    }
                });
            });
        });
    });
  });

});

exports.messages = router;
