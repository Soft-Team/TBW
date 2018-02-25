var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');

function render(req,res){
  res.redirect('/profile/'+req.session.user);
}

function profileRender(req,res){
  res.render('profile/views/index', {thisUserTab: req.user});
}



router.get('/', flog, render);
router.get('/:accno', flog, profileRender);


router.get('/main/:accno', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
    db.query(`SELECT * FROM tbluser WHERE tbluser.intAccNo=?`, [req.params.accno], (err,results,fields)=>{
      res.render('profile/views/main', {thisUserTab: req.user, SelUserTab: results});
    });
      break;
  }
});

router.get('/main/:accno/personalinfo', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
    db.query(`SELECT * FROM tbluser WHERE tbluser.intAccNo=?`, [req.params.accno], (err,results,fields)=>{
      res.render('profile/views/personalinfo', {thisUserTab: results, userNgayon: req.user});
    });
      break;
  }
});

function query1(results){
  db.query(`SELECT * FROM tbluser WHERE tbluser.intAccNo=?`,[req.params.accno], (err, results, fields) => {
    if(err) return console.log(err);
    console.log(results[0]);
  });
}

function query2(results){
  
}




exports.profile = router;
