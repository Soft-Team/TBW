var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var formatAMPM = require('../welcome/formatAMPM');
var dateformat = require('../welcome/dateformat');
var messCount = require('../welcome/messCount');
var timeFormat = require('../welcome/timeFormat');

function regularSched(req, res, next){
  /*Regular Schedule of Current User, Match(session)
  *(tblschedule)*/
  db.query("SELECT * FROM tblschedule WHERE intSchedAccNo= ?",[req.session.user], function (err, results, fields) {
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
      req.regularSched = results;
      req.empty = empty;
      return next();
  });
}
function regularDay(req, res, next){
  /*Selected Schedule Day of Current User, Match(session,params)
  *(tblschedule)*/
  db.query("SELECT * FROM tblschedule WHERE intSchedAccNo= ? AND intSchedID= ?",[req.session.user, req.params.schedid], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        var zero = "0";
        var Hstart = results[0].tmSchedStart.charAt(0).concat(results[0].tmSchedStart.charAt(1));
        var Hend = results[0].tmSchedEnd.charAt(0).concat(results[0].tmSchedEnd.charAt(1));
        var Sampm, Eampm;

        if (parseFloat(Hstart) > 11){
            Sampm = 'PM';
        }
        else {
            Sampm = 'AM';
        }
        if (parseFloat(Hstart) > 12){
            Hstart = (parseFloat(Hstart) - 12).toString();
        }
        if (parseFloat(Hstart) == 0){
            Hstart = '12';
            Sampm = 'AM';
        }
        if (Hstart.length == 1){
            Hstart = zero.concat(Hstart);
        }

        if (parseFloat(Hend) > 11){
            Eampm = 'PM';
        }
        else {
            Eampm = 'AM';
        }
        if (parseFloat(Hend) > 12){
            Hend = (parseFloat(Hend) - 12).toString();
        }
        if (parseFloat(Hend) == 0){
            Hend = '12';
            Eampm = 'AM';
        }
        if (Hend.length == 1){
            Hend = zero.concat(Hend);
        }

        results[0].Hstart = Hstart;
        results[0].Hend = Hend;
        results[0].Mstart = results[0].tmSchedStart.charAt(3).concat(results[0].tmSchedStart.charAt(4));
        results[0].Mend = results[0].tmSchedEnd.charAt(3).concat(results[0].tmSchedEnd.charAt(4));
        results[0].Sampm = Sampm;
        results[0].Eampm = Eampm;
      }
      req.regularDay = results;
      return next();
  });
}
function specialSched(req, res, next){
  /*Special Schedule of Current User, Match(session)
  *(tblspecialschedule)*/
  db.query("SELECT * FROM tblspecialsched WHERE intSpecialAccNo= ? AND datSpecialDate >= CURDATE() ORDER BY datSpecialDate ASC",[req.session.user], function (err, results, fields) {
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
      req.specialSched = results;
      req.emptyspecial = empty;
      return next();
  });
}
function specialDay(req, res, next){
  /*Selected Schedule Day of Current User, Match(session,params)
  *(tblschedule)*/
  db.query("SELECT * FROM tblspecialsched WHERE intSpecialAccNo= ? AND intSpecialID= ?",[req.session.user, req.params.schedid], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        var zero = "0";
        var Sampm, Eampm;
        var formatDate = dateformat(results[0].datSpecialDate);

        if(!results[0].tmSpecialStart){
          results[0].unav = 1;
        }
        else{
          var Hstart = results[0].tmSpecialStart.charAt(0).concat(results[0].tmSpecialStart.charAt(1));
          var Hend = results[0].tmSpecialEnd.charAt(0).concat(results[0].tmSpecialEnd.charAt(1));

          results[0].unav = 0;

          if (parseFloat(Hstart) > 11){
              Sampm = 'PM';
          }
          else {
              Sampm = 'AM';
          }
          if (parseFloat(Hstart) > 12){
              Hstart = (parseFloat(Hstart) - 12).toString();
          }
          if (parseFloat(Hstart) == 0){
              Hstart = '12';
              Sampm = 'AM';
          }
          if (Hstart.length == 1){
              Hstart = zero.concat(Hstart);
          }

          if (parseFloat(Hend) > 11){
              Eampm = 'PM';
          }
          else {
              Eampm = 'AM';
          }
          if (parseFloat(Hend) > 12){
              Hend = (parseFloat(Hend) - 12).toString();
          }
          if (parseFloat(Hend) == 0){
              Hend = '12';
              Eampm = 'AM';
          }
          if (Hend.length == 1){
              Hend = zero.concat(Hend);
          }

          results[0].Hstart = Hstart;
          results[0].Hend = Hend;
          results[0].Mstart = results[0].tmSpecialStart.charAt(3).concat(results[0].tmSpecialStart.charAt(4));
          results[0].Mend = results[0].tmSpecialEnd.charAt(3).concat(results[0].tmSpecialEnd.charAt(4));
          results[0].Sampm = Sampm;
          results[0].Eampm = Eampm;
        }

        results[0].month = formatDate.charAt(4).concat(formatDate.charAt(5));
        results[0].day = formatDate.charAt(6).concat(formatDate.charAt(7));
        results[0].year = formatDate.charAt(0) + formatDate.charAt(1) + formatDate.toString().charAt(2) + formatDate.toString().charAt(3);
      }
      req.specialDay = results;
      return next();
  });
}
function specialTaken(req, res, next){
  /*Added date already taken, Match(session,body)
  *(tblspecialsched)*/
  var thisdate = req.body.addYear.toString()+'-'+req.body.addMonth+'-'+req.body.addDay;
  db.query("SELECT * FROM tblspecialsched WHERE intSpecialAccNo= ? AND datSpecialDate= ?",[req.session.user, thisdate], function (err, results, fields) {
      if (err) return res.send(err);
      req.specialTaken = results;
      return next();
  });
}
function todaySpecial(req, res, next){
  /*Match special day to current day, Match(session)
  *(tblspecialsched)*/
  db.query("SELECT * FROM tblspecialsched WHERE intSpecialAccNo= ? AND datSpecialDate= CURDATE()",[req.session.user], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        if(!results[0].tmSpecialStart){
          results[0].unav = 1;
        }
        else{
          results[0].unav = 0;
          results[0].formatstart = formatAMPM(results[0].tmSpecialStart);
          results[0].formatend = formatAMPM(results[0].tmSpecialEnd);
        }
      }
      req.todaySpecial = results;
      return next();
  });
}
function todayRegular(req, res, next){
  /*Match regular day to current day, Match(session)
  *(tblspecialsched)*/
  db.query("SELECT * FROM tblschedule WHERE intSchedAccNo= ? AND strSchedDay= DAYNAME(CURDATE())",[req.session.user], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        results[0].unav = 0;
        results[0].formatstart = formatAMPM(results[0].tmSchedStart);
        results[0].formatend = formatAMPM(results[0].tmSchedEnd);
      }
      req.todayRegular = results;
      return next();
  });
}
function today(req, res, next){
  /*Current Date*/
  db.query("SELECT CURDATE() AS curdate", function (err, results, fields) {
      if (err) return res.send(err);
      results[0].date = results[0].curdate.toDateString("en-US").slice(4, 15);
      req.today = results[0].date;
      return next();
  });
}
function ongoingtrans(req, res, next){
  /*Current Date*/
  db.query("SELECT * FROM tbltransaction INNER JOIN tblchat ON intTransChatID= intChatID INNER JOIN tblservice ON intChatServ= intServID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 1",[req.session.user,req.session.user], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          var date = results[count].dtmTransScheduled;
          var formatDate = dateformat(date);
          var time = timeFormat(date);
          results[count].date = date.toDateString("en-US").slice(4, 15);
          results[count].time = time;
        }
        req.emptytrans = 0;
      }
      else{
        req.emptytrans = 1;
      }
      req.ongoingtrans = results;
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
      var emptyToday = 0;
      if(!(!req.todaySpecial[0])){
        var today = req.todaySpecial;
      }
      else if(!(!req.todayRegular[0])){
        var today = req.todayRegular;
      }
      else{
        var today = "empty";
        emptyToday = 1;
      }
      res.render('scheduler/views/index', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, todayTab: today, emptynow: emptyToday, curdate: req.today, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans});
      break;
  }
}
function editRWHRender(req,res){
  switch (req.valid) {
    case 0:
      res.render('home/views/worker');
      break;
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      var emptyToday = 0;
      if(!(!req.todaySpecial[0])){
        var today = req.todaySpecial;
      }
      else if(!(!req.todayRegular[0])){
        var today = req.todayRegular;
      }
      else{
        var today = "empty";
        emptyToday = 1;
      }
      if (!req.regularDay[0]){
        res.render('scheduler/views/invalid/nosched', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, todayTab: today, emptynow: emptyToday, curdate: req.today, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans});
      }
      else{
        res.render('scheduler/views/editRWH', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, regDayTab: req.regularDay, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, todayTab: today, emptynow: emptyToday, curdate: req.today, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans});
      }
      break;
  }
}
function delRWHRender(req,res){
  switch (req.valid) {
    case 0:
      res.render('home/views/worker');
      break;
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.regularDay[0]){
        res.render('scheduler/views/invalid/nosched', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial})
      }
      else{
        db.query("DELETE FROM tblschedule WHERE intSchedID= ?",[req.params.schedid], (err, results, fields) => {
          if (err) console.log(err);
          res.redirect('/scheduler');
        });
      }
  }
}
function editSWHRender(req,res){
  switch (req.valid) {
    case 0:
      res.render('home/views/worker');
      break;
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      var emptyToday = 0;
      if(!(!req.todaySpecial[0])){
        var today = req.todaySpecial;
      }
      else if(!(!req.todayRegular[0])){
        var today = req.todayRegular;
      }
      else{
        var today = "empty";
        emptyToday = 1;
      }
      if (!req.specialDay[0]){
        res.render('scheduler/views/invalid/nosched', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, todayTab: today, emptynow: emptyToday, curdate: req.today, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans})
      }
      else{
        res.render('scheduler/views/editSWH', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, specDayTab: req.specialDay, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, todayTab: today, emptynow: emptyToday, curdate: req.today, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans});
      }
      break;
  }
}
function delSWHRender(req,res){
  switch (req.valid) {
    case 0:
      res.render('home/views/worker');
      break;
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if (!req.specialDay[0]){
        res.render('scheduler/views/invalid/nosched', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial})
      }
      else{
        db.query("DELETE FROM tblspecialsched WHERE intSpecialID= ?",[req.params.schedid], (err, results, fields) => {
          if (err) console.log(err);
          res.redirect('/scheduler');
        });
      }
  }
}

router.get('/', flog, messCount, regularSched, specialSched, todaySpecial, todayRegular, today, ongoingtrans, render);
router.get('/rwh/:schedid', flog, messCount, regularSched, regularDay, specialSched, todaySpecial, todayRegular, today, ongoingtrans, editRWHRender);
router.get('/rwh/:schedid/remove', flog, messCount, regularSched, regularDay, specialSched, delRWHRender);
router.get('/swh/:schedid', flog, messCount, regularSched, specialDay, specialSched, todaySpecial, todayRegular, today, ongoingtrans, editSWHRender);
router.get('/swh/:schedid/remove', flog, messCount, regularSched, specialDay, specialSched, delSWHRender);

router.post('/rwh', flog, messCount, (req, res) => {
  if (req.body.Sampm == 'AM' && req.body.Shours == '12'){
      req.body.Shours = '00';
  }
  if (req.body.Eampm == 'AM' && req.body.Ehours == '12'){
      req.body.Ehours = '00';
  }
  if (req.body.Sampm == 'PM' && req.body.Shours != '12'){
    req.body.Shours = (parseFloat(req.body.Shours) + 12).toString();
  }
  if (req.body.Eampm == 'PM' && req.body.Ehours != '12'){
    req.body.Ehours = (parseFloat(req.body.Ehours) + 12).toString();
  }
  var start = req.body.Shours.concat(':'+req.body.Sminutes);
  var end = req.body.Ehours.concat(':'+req.body.Eminutes);
  db.query("INSERT INTO tblschedule (intSchedAccNo, strSchedDay, tmSchedStart, tmSchedEnd) VALUES (?,?,?,?)",[req.session.user, req.body.addDay, start, end], (err, results, fields) => {
    if (err) console.log(err);
    res.redirect('/scheduler');
  });
});
router.post('/rwh/:schedid', flog, messCount, (req, res) => {
  if (req.body.ESampm == 'AM' && req.body.EShours == '12'){
      req.body.EShours = '00';
  }
  if (req.body.EEampm == 'AM' && req.body.EEhours == '12'){
      req.body.EEhours = '00';
  }
  if (req.body.ESampm == 'PM' && req.body.EShours != '12'){
      req.body.EShours = (parseFloat(req.body.EShours) + 12).toString();
  }
  if (req.body.EEampm == 'PM' && req.body.EEhours != '12'){
      req.body.EEhours = (parseFloat(req.body.EEhours) + 12).toString();
  }
  var start = req.body.EShours.concat(':'+req.body.ESminutes);
  var end = req.body.EEhours.concat(':'+req.body.EEminutes);
  db.query("UPDATE tblschedule SET tmSchedStart= ?, tmSchedEnd= ? WHERE intSchedID= ?",[start, end, req.params.schedid], (err, results, fields) => {
    if (err) console.log(err);
    res.redirect('/scheduler');
  });
});
router.post('/swh', flog, messCount, regularSched, specialSched, specialTaken, ongoingtrans, (req, res) => {
  if(!(!req.specialTaken[0])){
    res.render('scheduler/views/invalid/taken', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans});
  }
  else{
    var date = req.body.addYear.toString()+'-'+req.body.addMonth+'-'+req.body.addDay;
    if (req.body.status == 'unavailable'){
      var stringquery = "INSERT INTO tblspecialsched (intSpecialAccNo, datSpecialDate) VALUES (?,?)";
      var bodyarray = [req.session.user, date];
    }
    else{
      if (req.body.Sampm == 'AM' && req.body.Shours == '12'){
          req.body.Shours = '00';
      }
      if (req.body.Eampm == 'AM' && req.body.Ehours == '12'){
          req.body.Ehours = '00';
      }
      if (req.body.Sampm == 'PM' && req.body.Shours != '12'){
        req.body.Shours = (parseFloat(req.body.Shours) + 12).toString();
      }
      if (req.body.Eampm == 'PM' && req.body.Ehours != '12'){
        req.body.Ehours = (parseFloat(req.body.Ehours) + 12).toString();
      }
      var start = req.body.Shours.concat(':'+req.body.Sminutes);
      var end = req.body.Ehours.concat(':'+req.body.Eminutes);
      var stringquery = "INSERT INTO tblspecialsched (intSpecialAccNo, datSpecialDate, tmSpecialStart, tmSpecialEnd) VALUES (?,?,?,?)";
      var bodyarray = [req.session.user, date, start, end];
    }
    db.query(stringquery, bodyarray, (err, results, fields) => {
      if (err) res.render('scheduler/views/invalid/nodate', {thisUserTab: req.user, messCount: req.messCount[0].count, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, ongoingtrans: req.ongoingtrans, emptytrans: req.emptytrans});
      else res.redirect('/scheduler');
    });
  }
});
router.post('/swh/:schedid', flog, messCount, (req, res) => {
  var date = req.body.addYear.toString()+'-'+req.body.addMonth+'-'+req.body.addDay;
  if (req.body.status == 'unavailable'){
    var stringquery = "UPDATE tblspecialsched SET datSpecialDate= ?, tmSpecialStart=NULL, tmSpecialEnd=NULL WHERE intSpecialID= ?";
    var bodyarray = [date, req.params.schedid];
  }
  else{
    if (req.body.ESampm == 'AM' && req.body.EShours == '12'){
        req.body.EShours = '00';
    }
    if (req.body.EEampm == 'AM' && req.body.EEhours == '12'){
        req.body.EEhours = '00';
    }
    if (req.body.ESampm == 'PM' && req.body.EShours != '12'){
        req.body.EShours = (parseFloat(req.body.EShours) + 12).toString();
    }
    if (req.body.EEampm == 'PM' && req.body.EEhours != '12'){
        req.body.EEhours = (parseFloat(req.body.EEhours) + 12).toString();
    }
    var start = req.body.EShours.concat(':'+req.body.ESminutes);
    var end = req.body.EEhours.concat(':'+req.body.EEminutes);
    var stringquery = "UPDATE tblspecialsched SET datSpecialDate= ?, tmSpecialStart= ?, tmSpecialEnd= ? WHERE intSpecialID= ?";
    var bodyarray = [date, start, end, req.params.schedid];
  }
  db.query(stringquery, bodyarray, (err, results, fields) => {
    if (err) console.log(err);
    res.redirect('/scheduler');
  });
});

exports.scheduler = router;
