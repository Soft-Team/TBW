var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');
var numberFormat = require('../welcome/numberFormat');
var fs = require('fs');

function render(req,res){
  res.redirect('/profile/'+req.session.user);
}



router.get('/', flog, messCount, render);



router.get('/:accno', flog, messCount, (req,res) => {
  function queryOne(x){
    switch (req.valid) {
      case 1:
        res.render('welcome/views/invalid/adm-restrict');
        break;
      case 2:
      case 3:
      db.query(`SELECT * FROM tbluser WHERE tbluser.intAccNo=?`, [x], (err,results,fields)=>{
        if(err) return console.log(err);
      console.log(results);
      queryTwo(results,x);
    });
    break;
    }
  }
  
  function queryTwo(resultsOne,paramsMo){
    switch (req.valid) {
      case 1:
        res.render('welcome/views/invalid/adm-restrict');
        break;
      case 2:
      case 3:
    db.query(`SELECT * FROM tblservice JOIN tblservicetag on tblservice.intServTag = tblservicetag.intServTagID
              JOIN tbluser on tblservice.intServAccNo = tbluser.intAccNo WHERE tbluser.IntAccNo = ?`, [paramsMo], (err, results, fields) =>{
      res.render('profile/views/index', {thisUserTab: req.user, messCount: req.messCount[0].count, SelUserTab: resultsOne, resultsTwoForPug: results});
      if(err) return console.log(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          results[count].formatPrice = numberFormat(results[count].fltPrice.toFixed(2));
        }
      }
      console.log(results);
    });
    break;
  }
}
queryOne(req.params.accno);
});

router.post('/edit/:accno', flog, messCount, (req,res) => {
  switch (req.valid) {
    case 1:
        res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
    jpeg = 'DP-'+req.session.user.toString().concat('.jpg');
    if (!req.files.profilepic){
      db.query(`UPDATE tbluser SET strEmail=?, strContactNo=?, strPassword=?, strCity=?, strBarangay=? WHERE tbluser.intAccNo=?`, [req.body.email, req.body.contactno, req.body.password, req.body.city, req.body.barangay, req.params.accno] , (err,results,fields)=>{
        if(err) return console.log(err);
        res.redirect('/profile/'+req.params.accno);
        console.log(results);
        });
    }
    else{
    req.files.profilepic.mv('public/userImages/profile/'+jpeg, function(err){
    db.query(`UPDATE tbluser SET strEmail=?, strContactNo=?, strPassword=?, strCity=?, strBarangay=?, strProfilePic=? WHERE tbluser.intAccNo=?`, [req.body.email, req.body.contactno, req.body.password, req.body.city, req.body.barangay, jpeg, req.params.accno] , (err,results,fields)=>{
    if(err) return console.log(err);
    res.redirect('/profile/'+req.params.accno);
    console.log(results);
    });
  });
}
    break;
  } 
});


exports.profile = router;