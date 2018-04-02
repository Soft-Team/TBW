var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');
var prepend = require('../welcome/prepend');
var timeFormat = require('../welcome/timeFormat');
var dateformat = require('../welcome/dateformat');
var numberFormat = require('../welcome/numberFormat');
var ellipsis = require('../welcome/ellipsis');

function unrated(req,res,next){
  /*Unrated Finished Transactions of Current User as Seeker, Match(session);
  *(tblchat)*(tbluser)*(tblservice)*(tblservicetag)*(tbltransaction)*(tblmessage)*/
  var stringquery = "SELECT A.* , strName, intAccNo FROM(SELECT * FROM tblservice INNER JOIN tblchat ON intServID= intChatServ INNER JOIN tblservicetag ON intServTagID= intServTag INNER JOIN tbltransaction ON intChatID= intTransChatID LEFT JOIN (SELECT * FROM tblrating WHERE intRatedAccNo != ?)X ON intRateTransID= intTransID WHERE (intServAccNo= ? OR intChatSeeker= ?) AND intTransStatus= 2)A INNER JOIN tbluser ON intAccNo= intServAccNo OR intAccNo= intChatSeeker WHERE intAccNo!= ? ";
  stringquery = stringquery.concat("AND intServAccNo!= 1 AND intRateID IS NULL LIMIT 1;");
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
        req.emptyUnrated= 0;
      }
      else{
        req.emptyUnrated= 1;
      }
      req.unrated= results;
      return next();
    });
}
function search(req,res,next){
  /*Search Results, Match(session,params);
  *(tbluser)*(tblservice)*(tblrating)*(tbltransaction)*(tblchat)*(tblservice)**/
  var searchquery = "%"+req.params.searchname.toString()+"%"
  var stringquery = "SELECT * FROM tbluser LEFT JOIN tblservice ON intServAccNo= intAccNo LEFT JOIN (SELECT *,AVG(intRating) AS ave FROM tblrating GROUP BY intRatedAccNo)A ON intAccNo= intRatedAccNo LEFT JOIN (SELECT intServAccNo as servacc, S.sum FROM(SELECT *,SUM(count) AS sum FROM"
  stringquery = stringquery.concat("(SELECT *,COUNT(intTransID)as count FROM tbltransaction INNER JOIN tblchat ON intChatID= intTransChatID INNER JOIN tblservice ON intChatServ= intServID GROUP BY intServAccNo)C GROUP BY intServAccNo)S)B ON intAccNo= servacc WHERE intAccNo!= ? AND boolIsBanned= 0 AND strName LIKE ? AND ((intType=3 AND intStatus=2) OR intType= 2) GROUP BY intAccNo");
  db.query(stringquery,[req.session.user, searchquery], (err, results, fields) => {
    if (err) console.log(err);
    if(!(!results[0])){
      for(count=0;count<results.length;count++){
        results[count].prepend = prepend(results[count].intAccNo);
        if(!results[count].ave){
          results[count].ave = 0;
        }
        else{
          results[count].ave = numberFormat(results[count].ave.toFixed(1));
        }
        if(!results[count].sum){
          results[count].sum = 0;
        }
        if (results[count].strCity.length > 12){
          results[count].city = ellipsis(results[count].strCity,0,10);
          results[count].cityEllipsis = 1;
        }
        else{
          results[count].city = results[count].strCity;
          results[count].cityEllipsis = 0;
        }
        if (results[count].strBarangay.length > 12){
          results[count].brngy = ellipsis(results[count].strBarangay,0,10);
          results[count].brngyEllipsis = 1;
        }
        else{
          results[count].brngy = results[count].strBarangay;
          results[count].brngyEllipsis = 0;
        }
      }
    }
    console.log(results)
    req.search= results;
    return next();
  });
}
function documents(req,res,next){
  /*Documents of Params Service User, Match(params);
  *(tbldocument)*(tbluser)*/
  db.query("SELECT * FROM tbldocument INNER JOIN tbluser ON intDocAccNo= intAccNo WHERE intAccNo= ?",[req.params.userid], (err, results, fields) => {
      if (err) console.log(err);
      req.documents= results;
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
      console.log(req.unrated)
      if(!req.unrated[0])
        res.render('home/views/index', {thisUserTab: req.user, messCount: req.messCount[0].count});
      else
        res.render('home/views/notify-unrated', {thisUserTab: req.user, messCount: req.messCount[0].count, unratedTab: req.unrated, emptyUnrated: req.emptyUnrated});

      break;
  }
}
function guideRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/guide', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function helpRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/help', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function aboutRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/about', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function teamRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/team', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function searchRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!(!req.search[0]))
        res.render('home/views/search', {thisUserTab: req.user, messCount: req.messCount[0].count, searchtab: req.search, paramsSearch: req.params.searchname});
      else
        res.render('home/views/nosearch', {thisUserTab: req.user, messCount: req.messCount[0].count, noresult: req.params.searchname, paramsSearch: req.params.searchname});
      break;
  }
}
function portRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!(!req.search[0]))
        res.render('home/views/portfolio', {thisUserTab: req.user, messCount: req.messCount[0].count, searchtab: req.search, paramsSearch: req.params.searchname, documents: req.documents});
      else
        res.render('home/views/nosearch', {thisUserTab: req.user, messCount: req.messCount[0].count, noresult: req.params.searchname, paramsSearch: req.params.searchname});
      break;
  }
}

router.get('/', flog, messCount, unrated, render);
router.get('/guide', flog, messCount, guideRender);
router.get('/help', flog, messCount, helpRender);
router.get('/about', flog, messCount, aboutRender);
router.get('/team', flog, messCount, teamRender);
router.get('/search/:searchname', flog, messCount, search, searchRender);
router.get('/search/:searchname/:userid', flog, messCount, search, documents, portRender);

router.post('/search', flog, (req, res) => {
  res.redirect('/home/search/'+req.body.search);
});

exports.home = router;
