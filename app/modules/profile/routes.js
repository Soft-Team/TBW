var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');
var numberFormat = require('../welcome/numberFormat');
var fs = require('fs');
var prepend = require('../welcome/prepend');
var makeid = require('../welcome/makeid');

function paramsUser(req, res, next){
  /*All Service Tags of Selected User, Match(params)
  *(tblservicetag)*(tblservice)*(tbluser)*/
  var stringquery = "SELECT * FROM tbluser LEFT JOIN tblservice ON intAccNo= intServAccNo LEFT JOIN tblservicetag ON intServTag= intServTagID LEFT JOIN (SELECT *,AVG(intRating) AS ave FROM tblrating WHERE intRatedAccNo= ? GROUP BY intRatedAccNo)A ON intAccNo= intRatedAccNo LEFT JOIN (SELECT intServAccNo as servacc, S.sum FROM(SELECT *,SUM(count) AS sum FROM(SELECT *,COUNT(intTransID)as count FROM tbltransaction INNER JOIN tblchat ON intChatID= intTransChatID INNER JOIN tblservice ON intChatServ= intServID WHERE ";
  stringquery = stringquery.concat("intServAccNo= ? GROUP BY intServAccNo)C)S)B ON intAccNo= servacc WHERE intAccNo= ?");
  db.query(stringquery,[req.params.userid, req.params.userid, req.params.userid], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          results[count].prepend = prepend(results[count].intAccNo);
          results[count].current = 0;
          if(results[count].intAccNo == req.session.user){
            results[count].current = 1;
          }
        }
        req.servempty = 1;
        if(!(!results[0].intServAccNo)){
          req.servempty = 0;
          for(count=0;count<results.length;count++){
            results[count].formatPrice = numberFormat(results[count].fltPrice.toFixed(2));
          }
        }
        if(!results[0].strValidID){
          for(count=0;count<results.length;count++){
            results[count].strValidID = 'none';
          }
        }
        if(!results[0].ave){
          for(count=0;count<results.length;count++){
            results[count].ave = 0;
          }
        }
        else{
          for(count=0;count<results.length;count++){
            results[count].ave = numberFormat(results[count].ave.toFixed(1));
          }
        }
        if(!results[0].sum){
          for(count=0;count<results.length;count++){
            results[count].sum = 0;
          }
        }
      }
      req.paramsUser = results;
      return next();
  });
}
function documents(req,res,next){
  /*Documents of Params User, Match(params);
  *(tbldocument)*/
  db.query("SELECT * FROM tbldocument WHERE intDocAccNo= ?",[req.params.userid], (err, results, fields) => {
      if (err) console.log(err);
      req.documents= results;
      return next();
    });
}
function paramsDoc(req,res,next){
  /*Documents of Params User, Match(params);
  *(tbldocument)*/
  db.query("SELECT * FROM tbldocument WHERE intDocID= ?",[req.params.docid], (err, results, fields) => {
      if (err) console.log(err);
      req.paramsDoc= results;
      return next();
    });
}
function paramsReviews(req,res,next){
  /*Reviews of Params User, Match(params);
  *(tblrating)*(tbltransaction)*(tblchat)*(tblservice)*(tbluser)*/
  var stringquery= "SELECT * FROM tblrating INNER JOIN tbltransaction ON intTransID= intRateTransID ";
  stringquery = stringquery.concat("INNER JOIN (SELECT * FROM tblchat INNER JOIN tblservice ON intChatServ= intServID WHERE intChatSeeker!= ? OR intServAccNo!= ?)A ON intTransChatID= A.intChatID INNER JOIN (SELECT * FROM tbluser WHERE intAccNo!= ?)B ON B.intAccNo= intServAccNo OR intAccNo= intChatSeeker INNER JOIN tblservicetag ON intServTagID= intServTag WHERE intRatedAccNo = ? ORDER BY dtmTransEnded");
  db.query(stringquery,[req.params.userid, req.params.userid, req.params.userid, req.params.userid], (err, results, fields) => {
      if (err) console.log(err);
      req.paramsReviews= results;
      return next();
    });
}
function workers(req,res,next){
  /*Workers of Params User, Match(params);
  *(tbldocument)*/
  db.query("SELECT * FROM tblworker WHERE intWorkBusID= ?",[req.params.userid], (err, results, fields) => {
      if (err) console.log(err);
      req.workers= results;
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
      res.redirect('/profile/'+req.session.user);
      break;
  }
}
function profRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.paramsUser[0]){
        res.redirect('/noroute');
      }
      else{
        res.render('profile/views/index',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty, documents: req.documents, reviews: req.paramsReviews, workers: req.workers});
      }
      break;
  }
}
function delDocRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if (!req.paramsUser[0] || !req.paramsDoc[0]){
        res.redirect('/noroute');
      }
      else if (req.paramsUser[0].intAccNo != req.session.user){
        res.redirect('/profile/'+req.session.user);
      }
      else{
        db.query("DELETE FROM tbldocument WHERE intDocID= ?", [req.params.docid] , (err,results,fields)=>{
            if (err) console.log(err);
            fs.unlink('public/userImages/documents/'+req.paramsDoc[0].strDocument);
            res.redirect('/profile/'+req.session.user);
        });
      }
      break;
  }
}

router.get('/', flog, messCount, render);
router.get('/:userid', flog, messCount, paramsUser, documents, paramsReviews, workers, profRender);
router.get('/:userid/document/remove/:docid', flog, paramsUser, documents, paramsDoc, delDocRender);

router.post('/personal/:userid', flog, messCount, paramsUser, documents, paramsReviews, workers, (req, res) => {
  var contact = '0'+req.body.contact.toString();
  if(!req.files.profilepic){
    db.query("UPDATE tbluser SET strEmail= ?, strContactNo= ?, strCity= ?, strBarangay= ? WHERE intAccNo= ?",[req.body.email, contact, req.body.city, req.body.brngy, req.session.user], function (err,  results, fields) {
      if (err) console.log(err);
      res.redirect('/profile/'+req.session.user);
    });
  }
  else if(req.files.profilepic.mimetype != 'image/jpeg' && req.files.profilepic.mimetype != 'image/png'){

    res.render('profile/views/invalid/imgerror',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty, documents: req.documents, reviews: req.paramsReviews, workers: req.workers});
  }
  else{
    var newAccNo= prepend(req.session.user);
    var jpeg = 'DP-'+newAccNo.toString().concat('.jpg');
    db.beginTransaction(function(err) {
      if (err) console.log(err);
      if(req.user[0].strProfilePic!= 'unknown.jpg'){
        fs.unlink('public/userImages/profile/'+jpeg);
      }
      db.query("SELECT * FROM tbluser WHERE intAccNo= ?",[req.session.user], function (err,  results, fields) {
          if (err) console.log(err);
          req.files.profilepic.mv('public/userImages/profile/'+jpeg, function(err){
              db.query("UPDATE tbluser SET strEmail= ?, strContactNo= ?, strCity= ?, strBarangay= ?, strProfilePic= ? WHERE intAccNo= ?", [req.body.email, contact, req.body.city, req.body.barangay, jpeg, req.session.user] , (err,results,fields)=>{
                  if (err) console.log(err);
                  db.commit(function(err) {
                      if (err) console.log(err);
                      res.redirect('/profile/'+req.session.user);
                  });
              });
          });
      });
    });
  }
});
router.post('/pass/:userid', flog, messCount, paramsUser, documents, paramsReviews, workers, (req, res) => {
  if(req.paramsUser[0].strPassword == req.body.oldpass){
    if(req.body.newpass == req.body.confirmpass){
      db.query("UPDATE tbluser SET strPassword= ? WHERE intAccNo= ?",[req.body.newpass, req.session.user], function (err,  results, fields) {
        if (err) console.log(err);
        res.redirect('/profile/'+req.session.user);
      });
    }
    else{
      res.render('profile/views/invalid/notmatch',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty, documents: req.documents, reviews: req.paramsReviews, workers: req.workers});
    }
  }
  else{
    res.render('profile/views/invalid/notmatch',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty, documents: req.documents, reviews: req.paramsReviews, workers: req.workers});
  }

});
router.post('/validid/:userid', flog, messCount, paramsUser, documents, paramsReviews, workers, (req, res) => {
  var newAccNo= prepend(req.session.user);
  var jpeg = 'VID-'+newAccNo.toString().concat('.jpg');
  if(req.files.validid.mimetype != 'image/jpeg' && req.files.validid.mimetype != 'image/png'){
    res.render('profile/views/invalid/imgerror',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty, documents: req.documents, reviews: req.paramsReviews, workers: req.workers});
  }
  else{
    req.files.validid.mv('public/userImages/ids/'+jpeg, function(err){
      db.query("UPDATE tbluser SET strValidID= ? WHERE intAccNo= ?", [jpeg, req.session.user] , (err,results,fields)=>{
          if (err) console.log(err);
          res.redirect('/profile/'+req.session.user);
      });
    });
  }
});
router.post('/document/:userid', flog, messCount, paramsUser, documents, paramsReviews, workers, (req, res) => {
  var newAccNo= prepend(req.session.user);
  var jpeg = 'DOC-'+newAccNo.toString().concat(makeid(30)+'.jpg');
  if(req.files.document.mimetype != 'image/jpeg' && req.files.document.mimetype != 'image/png'){
    res.render('profile/views/invalid/imgerror',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty, documents: req.documents, reviews: req.paramsReviews, workers: req.workers});
  }
  else{
    req.files.document.mv('public/userImages/documents/'+jpeg, function(err){
      db.query("INSERT INTO tbldocument (intDocAccNo, strDocument) VALUES (?,?)", [req.session.user, jpeg] , (err,results,fields)=>{
          if (err) console.log(err);
          res.redirect('/profile/'+req.session.user);
      });
    });
  }
});
router.post('/more/:userid', flog, messCount, paramsUser, documents, (req, res) =>{
  var check = req.body.autofill ? 1 : 0;
  db.query("UPDATE tbluser SET intAutoFill=? WHERE intAccNo= ?",[check, req.session.user], function (err,  results, fields) {
    if (err) console.log(err);
    res.redirect('/profile/'+req.session.user);
  });

});
router.post('/add-workers/:userid', flog, messCount, paramsUser, (req, res) =>{
  db.query("INSERT INTO tblworker (intWorkBusID, strWorker) VALUES (?,?)",[req.session.user, req.body.workername], function (err,  results, fields) {
    if (err) console.log(err);
    res.redirect('/profile/'+req.session.user);
  });

});
router.post('/manage-workers/:userid', flog, messCount, paramsUser, (req, res) =>{
  db.query("UPDATE tblworker SET intWorkerStatus= ? WHERE intWorkerID= ?",[req.body.workerstatus, req.body.workid], function (err,  results, fields) {
    if (err) console.log(err);
    res.redirect('/profile/'+req.session.user);
  });

});

router.post('reported/:userid', flog, messCount, paramsUser, (req,res) =>{
  db.query("INSERT INTO tblreport VALUES(")
})

exports.profile = router;
