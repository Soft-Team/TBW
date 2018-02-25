var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');

function render(req,res){
  res.redirect('/profile/'+req.session.user);
}

function profileRender(req,res){
  res.render('profile/views/index', {thisUserTab: req.user, messCount: req.messCount[0].count});
}



router.get('/', flog, messCount, render);
router.get('/:accno', flog, messCount, profileRender);


router.get('/main/:accno', flog, messCount, (req,res) => {
  function queryOne(){
    switch (req.valid) {
      case 1:
        res.render('welcome/views/invalid/adm-restrict');
        break;
      case 2:
      case 3:
      db.query(`SELECT * FROM tbluser WHERE tbluser.intAccNo=?`, [req.params.accno], (err,results,fields)=>{
        if(err) return console.log(err);
      console.log(results);
      queryTwo(resultsTwo);
    });
    break;
    }
  }
  
  function queryTwo(resultsTwo){
    switch (req.valid) {
      case 1:
        res.render('welcome/views/invalid/adm-restrict');
        break;
      case 2:
      case 3:
    db.query(`JOIN tblservicetag on tblservice.intServTag = tblservicetag.intServTagID WHERE tbluser.IntAccNo = ?`, [req.params.accno], (err, results, fields) =>{
      res.render('profile/views/main', {thisUserTab: req.user, messCount: req.messCount[0].count, SelUserTab: results, resultsTwoForPug: resultsTwo});
      if(err) return console.log(err);
      console.log(resultsTwo);
    });
    break;
  }
}
queryOne();
});

router.get('/main/:accno/personalinfo', flog, messCount, (req,res) => {
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





exports.profile = router;