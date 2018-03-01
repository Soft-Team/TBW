var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');
var numberFormat = require('../welcome/numberFormat');
var fs = require('fs');
var prepend = require('../welcome/prepend');

function paramsUser(req, res, next){
  /*All Service Tags of Selected User, Match(params)
  *(tblservicetag)*(tblservice)*(tbluser)*/
  db.query("SELECT * FROM tbluser LEFT JOIN tblservice ON intAccNo= intServAccNo LEFT JOIN tblservicetag ON intServTag= intServTagID WHERE intAccNo= ?",[req.params.userid], function (err, results, fields) {
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
      }
      console.log(results);
      req.paramsUser = results;
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
        res.render('profile/views/index',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty});
      }
      break;
  }
}

router.get('/', flog, messCount, render);
router.get('/:userid', flog, messCount, paramsUser, profRender);

router.post('/personal/:userid', flog, messCount, paramsUser, (req, res) => {
  var contact = '0'+req.body.contact.toString();
  if(!req.files.profilepic){
    db.query("UPDATE tbluser SET strEmail= ?, strContactNo= ?, strCity= ?, strBarangay= ? WHERE intAccNo= ?",[req.body.email, contact, req.body.city, req.body.brngy, req.session.user], function (err,  results, fields) {
      if (err) console.log(err);
      res.redirect('/profile/'+req.session.user);
    });
  }
  else if(req.files.profilepic.mimetype != 'image/jpeg' && req.files.profilepic.mimetype != 'image/png'){
    console.log(req.files.profilepic.mimetype);
    res.render('profile/views/invalid/imgerror',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty});
  }
  else{
    console.log('no');
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
router.post('/pass/:userid', flog, messCount, paramsUser, (req, res) => {
  if(req.paramsUser[0].strPassword == req.body.oldpass){
    if(req.body.newpass == req.body.confirmpass){
      db.query("UPDATE tbluser SET strPassword= ? WHERE intAccNo= ?",[req.body.newpass, req.session.user], function (err,  results, fields) {
        if (err) console.log(err);
        res.redirect('/profile/'+req.session.user);
      });
    }
    else{
      res.render('profile/views/invalid/notmatch',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty});
    }
  }
  else{
    res.render('profile/views/invalid/notmatch',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty});
  }

});
router.post('/validid/:userid', flog, messCount, paramsUser, (req, res) => {
  var newAccNo= prepend(req.session.user);
  var jpeg = 'VID-'+newAccNo.toString().concat('.jpg');
  if(req.files.validid.mimetype != 'image/jpeg' && req.files.validid.mimetype != 'image/png'){
    res.render('profile/views/invalid/imgerror',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty});
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

exports.profile = router;
