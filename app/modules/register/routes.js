var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var prepend = require('../welcome/prepend');

function auth(req,res,next){
  /*Entered UserName, Match
  *(tbluser)*/
  db.query("SELECT * FROM tbluser WHERE strUserName= ?",[req.body.username], (err, results, fields) => {
      if (err) console.log(err);
      if(!results[0])
        return next();
      else {
        res.render('register/views/invalid/taken');
      }
  });
}

function render(req,res){
  res.render('register/views/index');
}
function businessRender(req,res){
  res.render('register/views/business');
}
function termsRender(req,res){
  res.render('register/views/terms');
}

router.get('/', render);
router.get('/business', businessRender);
router.get('/terms', termsRender);

router.post('/', auth, (req, res) => {
  if(req.body.password === req.body.confirm){
    db.query("INSERT INTO tbluser (strName, strUserName, strPassword, intType, intStatus, strCity, strBarangay, strEmail, strContactNo) VALUES (?,?,?,'2','1',?,?,?,?)",[req.body.name, req.body.username, req.body.password, req.body.city, req.body.brngy, req.body.email, req.body.contact], (err, results, fields) => {
      if (err) console.log(err);
      res.render('register/views/success');
    });
  }
  else{
    res.render('register/views/invalid/notmatch');
  }
});
router.post('/business', auth, (req, res) => {
  if(req.body.password === req.body.confirm){
    jpeg = 'BP-'+req.body.username.concat('.jpg');
    req.files.bpermit.mv('public/userImages/permits/'+jpeg, function(err) {
      db.query("INSERT INTO tbluser (strName, strUserName, strPassword, intType, intStatus, strCity, strBarangay, strEmail, strContactNo, strOwner, strValidID) VALUES (?,?,?,'3','1',?,?,?,?,?,?)",[req.body.name, req.body.username, req.body.password, req.body.city, req.body.brngy, req.body.email, req.body.contact, req.body.owner, jpeg], (err, results, fields) => {
        if (err) console.log(err);
        res.render('register/views/success');
      });
    });
  }
  else{
    res.render('register/views/invalid/notmatch');
  }
});

exports.register = router;
