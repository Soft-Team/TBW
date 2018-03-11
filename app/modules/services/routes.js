var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var prepend = require('../welcome/prepend');
var formatAMPM = require('../welcome/formatAMPM');
var dateformat = require('../welcome/dateformat');
var messCount = require('../welcome/messCount');
var numberFormat = require('../welcome/numberFormat');
var ellipsis = require('../welcome/ellipsis');

function servTags(req, res, next){
  /*All Service Tags
  strServName(tblservicetag)*/
  db.query("SELECT strServName FROM tblservicetag LEFT JOIN tblservice ON intServTagID= intServTag GROUP BY strServName ORDER BY COUNT(intServTagID) DESC", function (err, results, fields) {
      if (err) return res.send(err);
      req.servTags = results;
      return next();
  });
}
function searchServTag(req, res, next){
  /*Selected ServiceTag, Match(params)
  *(tblservicetag)*/
  db.query("SELECT * FROM tblservicetag WHERE strServName= ?",[req.params.servName], (err, results, fields) => {
      if (err) return res.send(err);
      req.searchServTag = results;
      return next();
  });
}
function requestServ(req, res, next){
  /*Selected Service to Request + TodaySched, Match(params)
  *(tblservicetag)*(tbluser)*(tblschedule)*(tblspecialsched)*/
  db.query("SELECT *, CURDATE() AS curdate FROM tblservice INNER JOIN tbluser ON intAccNo= intServAccNo LEFT JOIN (SELECT * FROM tblschedule WHERE strSchedDay= DAYNAME(CURDATE()))A ON intAccNo= intSchedAccNo LEFT JOIN(SELECT * FROM tblspecialsched WHERE datSpecialDate= CURDATE())B ON intSpecialAccNo= intAccNo WHERE intServID= ?",[req.params.servid], (err, results, fields) => {
      if (err) return res.send(err);
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
      req.requestServ = results;
      return next();
  });
}
function regularSched(req, res, next){
  /*Regular Schedule of Selected User, Match(params)
  *(tblschedule)*/
  db.query("SELECT * FROM tblschedule INNER JOIN tblservice ON intSchedAccNo= intServAccNo WHERE intServID= ?",[req.params.servid], function (err, results, fields) {
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
function specialSched(req, res, next){
  /*Special Schedule of Selected User, Match(params)
  *(tblspecialschedule)*/
  db.query("SELECT * FROM tblspecialsched INNER JOIN tblservice ON intSpecialAccNo= intServAccNo WHERE intServID= ? AND datSpecialDate >= CURDATE() ORDER BY datSpecialDate ASC",[req.params.servid], function (err, results, fields) {
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
function servStatus(req, res, next){
  /*All Service Tags, Match(params)
  *(tblservice)*/
  db.query("SELECT * FROM tblservice WHERE intServID= ? AND intServStatus= 1",[req.params.servid], function (err, results, fields) {
      if (err) return res.send(err);
      req.servStatus = results;
      return next();
  });
}
function documents(req,res,next){
  /*Documents of Params Service User, Match(params);
  *(tbldocument)*/
  db.query("SELECT * FROM tbldocument INNER JOIN tbluser ON intDocAccNo= intAccNo INNER JOIN tblservice ON intAccNo= intServAccNo WHERE intServID= ?",[req.params.servid], (err, results, fields) => {
      if (err) console.log(err);
      req.documents= results;
      return next();
    });
}
function unrated(req,res,next){
  /*Unrated Finished Transactions of Current User as Seeker, Match(session);
  *(tblchat)*(tbluser)*(tblservice)*(tblservicetag)*(tbltransaction)*(tblmessage)*/
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID INNER JOIN (SELECT * FROM tblrating WHERE intRatedAccNo != ?)X ON intRateTransID= intTransID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 2)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ? ";
  stringquery = stringquery.concat("LIMIT 1;");
  db.query(stringquery,[req.session.user,req.session.user,req.session.user,req.session.user], (err, results, fields) => {
      if (err) console.log(err);
      if(!(!results[0])){
        req.emptyUnrated= 0;
      }
      else{
        req.emptyUnrated= 1;
      }
      req.unrated= results;
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
      res.render('services/views/index', {thisUserTab: req.user, messCount: req.messCount[0].count, servTags: req.servTags});
      break;
  }
}
function servNameRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('services/views/selected', {thisUserTab: req.user, messCount: req.messCount[0].count, servTags: req.servTags, servName: req.params.servName});
      break;
  }
}
function servRender(req,res){
  var searchparams = [req.params.servName, req.params.city, req.params.brngy, req.params.pricing, req.params.sorting];
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.searchServTag[0]){
        res.render('services/views/notag', {thisUserTab: req.user, messCount: req.messCount[0].count, servName: req.params.servName, servTags: req.servTags });
      }
      else{
        var stringquery="SELECT * FROM tblservice INNER JOIN tblservicetag ON intServTag= intServTagID INNER JOIN tbluser ON intServAccNo= intAccNo LEFT JOIN (SELECT *,AVG(intRating) AS ave FROM tblrating GROUP BY intRatedAccNo)A ON intAccNo= intRatedAccNo LEFT JOIN (SELECT intServAccNo as servacc, S.sum FROM(SELECT *,SUM(count) AS sum FROM";
        stringquery= stringquery.concat("(SELECT *,COUNT(intTransID)as count FROM tbltransaction INNER JOIN tblchat ON intChatID= intTransChatID INNER JOIN tblservice ON intChatServ= intServID GROUP BY intServAccNo)C GROUP BY intServAccNo)S)B ON intAccNo= servacc WHERE strServName= ? AND intAccNo!= ? AND tblservice.intServStatus= 1 AND boolIsBanned= 0 ");
        var paramsarray= [];
        if(req.params.city!='any'){
          stringquery = stringquery.concat("AND strCity= ? ");
          paramsarray.push(req.params.city);
        }
        if(req.params.brngy!='any'){
          stringquery = stringquery.concat("AND strBarangay= ? ");
          paramsarray.push(req.params.brngy);
        }
        if(req.params.pricing!='any'){
          stringquery = stringquery.concat("AND intPriceType= ? ");
          paramsarray.push(req.params.pricing);
        }

        if(req.params.sorting=='rating'){
          stringquery = stringquery.concat("ORDER BY ave DESC ");
        }
        else if(req.params.sorting=='lprice'){
          stringquery = stringquery.concat("ORDER BY fltPrice ASC ");
        }
        else if(req.params.sorting=='finished'){
          stringquery = stringquery.concat("ORDER BY sum DESC ");
        }

        if(paramsarray.length==1){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
              }
          });
        }
        else if(paramsarray.length==2){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0],paramsarray[1]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
              }
          });
        }
        else if(paramsarray.length==3){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0],paramsarray[1],paramsarray[2]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
              }
          });
        }
        else{
          db.query(stringquery,[req.params.servName, req.session.user], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
              }
          });
        }
      }
      break;
  }
}
function servReqRender(req,res){
  var searchparams = [req.params.servName, req.params.city, req.params.brngy, req.params.pricing, req.params.sorting];
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.searchServTag[0]){
        res.render('services/views/notag', {thisUserTab: req.user, messCount: req.messCount[0].count, servName: req.params.servName, servTags: req.servTags});
      }
      else{
        var stringquery="SELECT * FROM tblservice INNER JOIN tblservicetag ON intServTag= intServTagID INNER JOIN tbluser ON intServAccNo= intAccNo LEFT JOIN (SELECT *,AVG(intRating) AS ave FROM tblrating GROUP BY intRatedAccNo)A ON intAccNo= intRatedAccNo LEFT JOIN (SELECT intServAccNo as servacc, S.sum FROM(SELECT *,SUM(count) AS sum FROM";
        stringquery= stringquery.concat("(SELECT *,COUNT(intTransID)as count FROM tbltransaction INNER JOIN tblchat ON intChatID= intTransChatID INNER JOIN tblservice ON intChatServ= intServID GROUP BY intServAccNo)C GROUP BY intServAccNo)S)B ON intAccNo= servacc WHERE strServName= ? AND intAccNo!= ? AND tblservice.intServStatus= 1 AND boolIsBanned= 0 ");
        var paramsarray= [];
        if(req.params.city!='any'){
          stringquery = stringquery.concat("AND strCity= ? ");
          paramsarray.push(req.params.city);
        }
        if(req.params.brngy!='any'){
          stringquery = stringquery.concat("AND strBarangay= ? ");
          paramsarray.push(req.params.brngy);
        }
        if(req.params.pricing!='any'){
          stringquery = stringquery.concat("AND intPriceType= ? ");
          paramsarray.push(req.params.pricing);
        }

        if(req.params.sorting=='rating'){
          stringquery = stringquery.concat("ORDER BY ave DESC ");
        }
        else if(req.params.sorting=='lprice'){
          stringquery = stringquery.concat("ORDER BY fltPrice ASC ");
        }
        else if(req.params.sorting=='finished'){
          stringquery = stringquery.concat("ORDER BY sum DESC ");
        }

        if(paramsarray.length==1){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                if(!req.requestServ[0]){
                  res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
                }
                else{
                  res.render('services/views/request', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, unratedTab: req.unrated, emptyUnrated: req.emptyUnrated});
                }
              }
          });
        }
        else if(paramsarray.length==2){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0],paramsarray[1]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                if(!req.requestServ[0]){
                  res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
                }
                else{
                res.render('services/views/request', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, unratedTab: req.unrated, emptyUnrated: req.emptyUnrated});
                }
              }
          });
        }
        else if(paramsarray.length==3){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0],paramsarray[1],paramsarray[2]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                if(!req.requestServ[0]){
                  res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
                }
                else{
                res.render('services/views/request', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, unratedTab: req.unrated, emptyUnrated: req.emptyUnrated});
                }
              }
          });
        }
        else{
          db.query(stringquery,[req.params.servName, req.session.user], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                if(!req.requestServ[0]){
                  res.render('services/views/result', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results});
                }
                else{
                res.render('services/views/request', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial, unratedTab: req.unrated, emptyUnrated: req.emptyUnrated});
                }
              }
          });
        }
      }
      break;
  }
}
function portfolioRender(req,res){
  var searchparams = [req.params.servName, req.params.city, req.params.brngy, req.params.pricing, req.params.sorting];
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.searchServTag[0]){
        res.render('services/views/notag', {thisUserTab: req.user, messCount: req.messCount[0].count, servName: req.params.servName, servTags: req.servTags});
      }
      else{
        var stringquery="SELECT * FROM tblservice INNER JOIN tblservicetag ON intServTag= intServTagID INNER JOIN tbluser ON intServAccNo= intAccNo LEFT JOIN (SELECT *,AVG(intRating) AS ave FROM tblrating GROUP BY intRatedAccNo)A ON intAccNo= intRatedAccNo LEFT JOIN (SELECT intServAccNo as servacc, S.sum FROM(SELECT *,SUM(count) AS sum FROM";
        stringquery= stringquery.concat("(SELECT *,COUNT(intTransID)as count FROM tbltransaction INNER JOIN tblchat ON intChatID= intTransChatID INNER JOIN tblservice ON intChatServ= intServID GROUP BY intServAccNo)C GROUP BY intServAccNo)S)B ON intAccNo= servacc WHERE strServName= ? AND intAccNo!= ? AND tblservice.intServStatus= 1 AND boolIsBanned= 0 ");
        var paramsarray= [];
        if(req.params.city!='any'){
          stringquery = stringquery.concat("AND strCity= ? ");
          paramsarray.push(req.params.city);
        }
        if(req.params.brngy!='any'){
          stringquery = stringquery.concat("AND strBarangay= ? ");
          paramsarray.push(req.params.brngy);
        }
        if(req.params.pricing!='any'){
          stringquery = stringquery.concat("AND intPriceType= ? ");
          paramsarray.push(req.params.pricing);
        }

        if(req.params.sorting=='rating'){
          stringquery = stringquery.concat("ORDER BY ave DESC ");
        }
        else if(req.params.sorting=='lprice'){
          stringquery = stringquery.concat("ORDER BY fltPrice ASC ");
        }
        else if(req.params.sorting=='finished'){
          stringquery = stringquery.concat("ORDER BY sum DESC ");
        }

        if(paramsarray.length==1){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                  res.render('services/views/portfolio', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, documents: req.documents, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial});
              }
          });
        }
        else if(paramsarray.length==2){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0],paramsarray[1]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/portfolio', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, documents: req.documents, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial});

              }
          });
        }
        else if(paramsarray.length==3){
          db.query(stringquery,[req.params.servName,req.session.user,paramsarray[0],paramsarray[1],paramsarray[2]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/portfolio', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, documents: req.documents, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial});

              }
          });
        }
        else{
          db.query(stringquery,[req.params.servName, req.session.user], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, servTags: req.servTags});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                  if(!results[count].ave){
                    results[count].ave = 0;
                  }
                  else{
                    results[count].ave = numberFormat(results[count].ave.toFixed(1));
                  }
                  if(!results[count].sum){
                    results[count].sum = 0;
                  }
                  if (results[count].strCity.length > 10){
                    results[count].city = ellipsis(results[count].strCity,0,10);
                  }
                  else{
                    results[count].city = results[count].strCity;
                  }
                  if (results[count].strBarangay.length > 10){
                    results[count].brngy = ellipsis(results[count].strBarangay,0,10);
                  }
                  else{
                    results[count].brngy = results[count].strBarangay;
                  }
                }
                res.render('services/views/portfolio', {thisUserTab: req.user, messCount: req.messCount[0].count, servParams: searchparams, searchServ: results, documents: req.documents, requestTab: req.requestServ, regSchedTab: req.regularSched, empty: req.empty, specSchedTab: req.specialSched, emptyspecial: req.emptyspecial});

              }
          });
        }
      }
      break;
  }
}

router.get('/', flog, messCount, servTags, render);
router.get('/:servName', flog, messCount, servTags, servNameRender);
router.get('/:servName/:city/:brngy/:pricing/:sorting', flog, messCount, searchServTag, servTags, servRender);
router.get('/:servName/:city/:brngy/:pricing/:sorting/request/:servid', flog, messCount, searchServTag, servTags, requestServ, regularSched, specialSched, unrated, servReqRender);
router.get('/:servName/:city/:brngy/:pricing/:sorting/portfolio/:servid', flog, messCount, searchServTag, servTags, documents, portfolioRender);

router.post('/', flog, messCount, (req, res) => {
  if(!req.body.city)
    req.body.city= 'any';
  if(!req.body.brngy)
    req.body.brngy= 'any';
  res.redirect('/services/'+ req.body.searchtag +'/'+ req.body.city +'/'+ req.body.brngy +'/'+ req.body.pricing +'/'+ req.body.sorting);
});
router.post('/request/:servid', flog, messCount, servStatus, requestServ, (req, res) => {
  if(!req.servStatus[0]){
    res.render('welcome/views/noroute', {thisUserTab: req.user, messCount: req.messCount[0].count});
  }
  else{
    var stringquery1= "UPDATE tblservice SET intServStatus= 2 WHERE intServAccNo= ? AND intServStatus= 1";
    var stringquery2= "INSERT INTO tblchat (intChatSeeker, intChatServ) VALUES (?,?)";
    var stringquery3= "SELECT @A:=intChatID FROM tblchat WHERE intChatServ= ? AND intChatSeeker= ? ORDER BY intChatID DESC LIMIT 1";
    var stringquery4= "INSERT INTO tblmessage (intMessChatID, txtMessage, dtmDateSent, intSender) VALUES (@A,?,NOW(),2)";
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      db.query(stringquery1,[req.requestServ[0].intAccNo], function (err,  results, fields) {
          if (err) console.log(err);
          db.query(stringquery2,[req.session.user, req.params.servid], function (err,  results, fields) {
              if (err) console.log(err);
              db.query(stringquery3,[req.params.servid, req.session.user], function (err,  results, fields) {
                  if (err) console.log(err);
                  db.query(stringquery4,[req.body.message], function (err,  results, fields) {
                      if (err) console.log(err);
                      db.commit(function(err) {
                          if (err) console.log(err);
                          res.redirect('/messages');
                      });
                  });
              });
          });
      });
    });
  }
});

exports.services = router;
