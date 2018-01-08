var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

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

router.get('/', render);

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

exports.register = router;
