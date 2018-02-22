var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var formatAMPM = require('../welcome/formatAMPM');

function regularSched(req, res, next){
  /*Regular Schedule of Current User, Match(session)
  *(tblservicetag)*/
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
function regDayExist(req, res, next){
  /*Selected Schedule Day of Current User, Match(session,body)
  *(tblschedule)*/
  db.query("SELECT * FROM tblschedule WHERE intSchedAccNo= ? AND strSchedDay= ?",[req.session.user, req.body.addDay], function (err, results, fields) {
      if (err) return res.send(err);
      req.regDayExist = results;
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

function render(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('scheduler/views/index', {thisUserTab: req.user, regSchedTab: req.regularSched, empty: req.empty});
      break;
  }
}
function editRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if (!req.regularDay[0]){
        res.render('scheduler/views/invalid/nosched', {thisUserTab: req.user, regSchedTab: req.regularSched, empty: req.empty})
      }
      else{
        res.render('scheduler/views/edit', {thisUserTab: req.user, regSchedTab: req.regularSched, regDayTab: req.regularDay, empty: req.empty});
      }
      break;
  }
}
function delRender(req,res){
  db.query("DELETE FROM tblschedule WHERE intSchedID= ?",[req.params.schedid], (err, results, fields) => {
    if (err) console.log(err);
    console.log('deleted');
    res.redirect('/scheduler');
  });
}

router.get('/', flog, regularSched, render);
router.get('/:schedid', flog, regularSched, regularDay, editRender);
router.get('/:schedid/remove', flog, delRender);

router.post('/', (req, res) => {
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
router.post('/:schedid', (req, res) => {
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

exports.scheduler = router;